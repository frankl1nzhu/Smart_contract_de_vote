const Voting = artifacts.require("Voting");
const { BN, expectRevert, expectEvent } = require("@openzeppelin/test-helpers");
const { expect } = require("chai");


contract("Voting", (accounts) => {
    const owner = accounts[0];
    const second = accounts[1];
    const third = accounts[2];
    const fourth = accounts[3];
    const fifth = accounts[4];
    let votingInstance;

  
    // Décrire les tests pour la session d'inscription des électeurs
    describe("1. Registering Voters Session Testing", () => {
        before(async () => {
            votingInstance = await Voting.new({ from: owner });
        });


        // Test d'ajout et de récupération d'un électeur
        it("should Add & Return a single voter; Get event voter added", async () => {
            console.log("Add a single voter");
            const findEvent = await votingInstance.registerVoter(owner, { from: owner });

            console.log("Get a single voter");
            const storedData = await votingInstance.voters(owner);
            expect(storedData.isRegistered).to.be.true;

            console.log("Get event voter added");
            expectEvent(findEvent, "VoterRegistered", {
                voterAddress: owner,
            });
        });



        // Test d'ajout et de suppression d'un électeur
        it("should Remove a single voter; Get event voter removed", async () => {
            console.log("Remove a single voter");
            const findEvent = await votingInstance.removeVoter(owner, { from: owner });

            console.log("Check if voter is removed");
            const storedData = await votingInstance.voters(owner);
            expect(storedData.isRegistered).to.be.false;

            console.log("Get event voter removed");
            expectEvent(findEvent, "VoterRemoved", {
                voterAddress: owner,
            });
        });
    });



    // Décrire les tests pour la session d'enregistrement des propositions
    describe("2. Proposals Registration Session Testing", () => {
        before(async () => {
            // Déployer le contrat pour tester la session d'enregistrement des propositions
            votingInstance = await Voting.new({ from: owner });

            // Ajouter des électeurs
            await votingInstance.registerVoter(second, { from: owner });
            await votingInstance.registerVoter(third, { from: owner });
        });
    
        // Tester l'ajout d'une proposition
        it("should Add a single proposal; Get event proposal added", async () => {
            // Commencer la session d'enregistrement des propositions
            await votingInstance.startProposalsRegistration({ from: owner });
        
            // Ajouter une proposition
            const proposalDescription = "Sample proposal";
            const findEvent = await votingInstance.registerProposal(proposalDescription, { from: second });
        
            // Vérifier si la proposition a été correctement ajoutée
            const storedProposal = await votingInstance.proposals(0);
            expect(storedProposal.description).to.equal(proposalDescription);
        
            // Vérifier si l'événement de proposition ajoutée a été émis
            expectEvent(findEvent, "ProposalRegistered", {
                proposalId: new BN(0),
            });
        });
    });
  



    // Décrire les tests pour la session de vote
    describe("3. Voting Session Testing", () => {
        
        beforeEach(async () => {
            // Déployer le contrat pour tester la session de vote
            votingInstance = await Voting.new({ from: owner });

            // Ajouter des électeurs et enregistrer des propositions
            await votingInstance.registerVoter(second, { from: owner });
            await votingInstance.registerVoter(third, { from: owner });

            await votingInstance.startProposalsRegistration({ from: owner });
            await votingInstance.registerProposal("Proposal 1", { from: second });
            await votingInstance.registerProposal("Proposal 2", { from: third });
            await votingInstance.endProposalsRegistration({ from: owner });

            await votingInstance.startVotingSession({ from: owner });
        });
  

        // Tester le vote pour une proposition
        it("should Vote for a single proposal; Get event vote added", async () => {
            // Voter pour une proposition
            const findEvent = await votingInstance.vote(0, { from: second });
        
            // Vérifier si le vote a été correctement enregistré
            const voter = await votingInstance.voters(second);
            expect(voter.hasVoted).to.be.true;
        
            // Vérifier si l'événement de vote a été émis
            expectEvent(findEvent, "Voted", {
                voter: second,
                proposalId: new BN(0),
            });
        });
    });
  



    // Décrire les tests pour la clôture des sessions et le comptage des votes
    describe("4. Session Closing & Votes Tallying Testing", () => {
        before(async () => {
            // Déployer le contrat pour tester la clôture des sessions et le comptage des votes
            votingInstance = await Voting.new({ from: owner });

            // Ajouter des électeurs et enregistrer des propositions
            await votingInstance.registerVoter(second, { from: owner });
            await votingInstance.registerVoter(third, { from: owner });

            await votingInstance.startProposalsRegistration({ from: owner });
            await votingInstance.registerProposal("Proposal 1", { from: second });
            await votingInstance.registerProposal("Proposal 2", { from: third });
            await votingInstance.endProposalsRegistration({ from: owner });

            await votingInstance.startVotingSession({ from: owner });

            // Voter pour une proposition
            await votingInstance.vote(0, { from: second });

            // Clôturer la session de vote
            await votingInstance.endVotingSession({ from: owner });
        });
    
        // Tester la clôture de la session d'enregistrement des propositions
        it("should End Proposals Registration Session; Get event registration ended", async () => {
            // Démarre une nouvelle session d'enregistrement des propositions
            await votingInstance.startProposalsRegistration({ from: owner });
        
            // Vérifie si une erreur est renvoyée lorsque l'on essaie de démarrer une nouvelle session
            await expectRevert(
                votingInstance.startProposalsRegistration({ from: owner }),
                "Proposals registration cannot start at this stage."
            );
        });
    
        // Tester la clôture de la session de vote
        it("should End Voting Session; Get event voting ended", async () => {
            // Vérifie si une erreur est renvoyée lorsque l'on essaie de démarrer une nouvelle session de vote
            await expectRevert(
                votingInstance.startVotingSession({ from: owner }),
                "Voting session cannot start at this stage."
            );
        });
    
        // Tester le comptage des votes
        it("should Tally Votes; Get event votes tallied and winner announced", async () => {
            // Compter les votes
            const findEvent = await votingInstance.tallyVotes({ from: owner });
        
            // Récupérer le gagnant
            const winner = await votingInstance.getWinner();
        
            // Vérifier si l'événement de comptage des votes a été émis
            expectEvent(findEvent, "WorkflowStatusChange", {
                previousStatus: web3.utils.asciiToHex("VotingSessionEnded"),
                newStatus: web3.utils.asciiToHex("VotesTallied"),
            });
        
            // Vérifier si le gagnant est correct
            expect(winner).to.equal("Proposal 1");
        });
    });
  


  
});
