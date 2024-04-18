// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Voting is Ownable {
    
    constructor() Ownable(msg.sender) {
        workflowStatus = WorkflowStatus.RegisteringVoters;
    }

    enum WorkflowStatus {
        RegisteringVoters,
        ProposalsRegistrationStarted,
        ProposalsRegistrationEnded,
        VotingSessionStarted,
        VotingSessionEnded,
        VotesTallied
    }
    
    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint votedProposalId;
    }
    
    struct Proposal {
        string description;
        uint voteCount;
    }

    mapping(address => Voter) public voters;

    Proposal[] public proposals;
    uint public winningProposalId;
    WorkflowStatus public workflowStatus;
    
    event VoterRegistered(address indexed voterAddress);
    event WorkflowStatusChange(WorkflowStatus previousStatus, WorkflowStatus newStatus);
    event ProposalRegistered(uint indexed proposalId);
    event Voted (address indexed voter, uint indexed proposalId);
    
    
    
    modifier onlyRegisteredVoter() {
        require(voters[msg.sender].isRegistered, "You are not registered as a voter.");
        _;
    }
    
    modifier onlyDuringVotingSession() {
        require(workflowStatus == WorkflowStatus.VotingSessionStarted, "Voting session is not active.");
        _;
    }
    
    modifier onlyAfterVotingSessionEnded() {
        require(workflowStatus == WorkflowStatus.VotingSessionEnded, "Voting session has not ended yet.");
        _;
    }
    
    /**
     * @dev Enregistre un électeur.
     * @param _voterAddress L'adresse de l'électeur à inscrire.
     * @notice Seul le propriétaire du contrat peut appeler cette fonction.
     * @notice Cette fonction ne peut être appelée que pendant l'étape "RegisteringVoters".
     * @notice L'électeur ne doit pas être déjà inscrit.
     * @notice Emet un événement "VoterRegistered" lorsque l'inscription est réussie.
     */
    function registerVoter(address _voterAddress) public onlyOwner {
        require(workflowStatus == WorkflowStatus.RegisteringVoters, "Registration of voters is not allowed at this stage.");
        require(!voters[_voterAddress].isRegistered, "Voter is already registered.");
        voters[_voterAddress].isRegistered = true;
        emit VoterRegistered(_voterAddress);
    }
    

    /**
     * @dev Démarre l'enregistrement des propositions.
     * Cette fonction ne peut être appelée que par le propriétaire du contrat.
     * Elle vérifie si le statut du flux de travail est à l'étape "Enregistrement des électeurs" et le met à jour en "ProposalsRegistrationStarted".
     * Elle émet un événement WorkflowStatusChange avec l'ancien et le nouveau statut du flux de travail.
     */
    function startProposalsRegistration() public onlyOwner {
        require(workflowStatus == WorkflowStatus.RegisteringVoters, "Proposals registration cannot start at this stage.");
        workflowStatus = WorkflowStatus.ProposalsRegistrationStarted;
        emit WorkflowStatusChange(WorkflowStatus.RegisteringVoters, WorkflowStatus.ProposalsRegistrationStarted);
    }
    


    /**
     * @dev Termine l'enregistrement des propositions.
     * Seul le propriétaire du contrat peut appeler cette fonction.
     * Nécessite que le statut du flux de travail soit dans l'état "ProposalsRegistrationStarted".
     * Met à jour le statut du flux de travail à "ProposalsRegistrationEnded".
     * Emet un événement WorkflowStatusChange avec l'ancien et le nouveau statut du flux de travail.
     */
    function endProposalsRegistration() public onlyOwner {
        require(workflowStatus == WorkflowStatus.ProposalsRegistrationStarted, "Proposals registration has not started yet.");
        workflowStatus = WorkflowStatus.ProposalsRegistrationEnded;
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationStarted, WorkflowStatus.ProposalsRegistrationEnded);
    }
    
    
    /**
     * @dev Démarre la session de vote.
     * Seul le propriétaire du contrat peut appeler cette fonction.
     * La session de vote ne peut commencer que si le statut du flux de travail est "ProposalsRegistrationEnded".
     * Emet un événement WorkflowStatusChange avec l'ancien et le nouveau statut du flux de travail.
     */
    function startVotingSession() public onlyOwner {
        require(workflowStatus == WorkflowStatus.ProposalsRegistrationEnded, "Voting session cannot start at this stage.");
        workflowStatus = WorkflowStatus.VotingSessionStarted;
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationEnded, WorkflowStatus.VotingSessionStarted);
    }
    

    
    /**
     * @dev Termine la session de vote.
     * Seul le propriétaire du contrat peut appeler cette fonction.
     * Elle vérifie si la session de vote a commencé et change le statut du flux de travail en VotingSessionEnded.
     * Elle émet un événement WorkflowStatusChange avec l'ancien et le nouveau statut du flux de travail.
     */
    function endVotingSession() public onlyOwner {
        require(workflowStatus == WorkflowStatus.VotingSessionStarted, "Voting session has not started yet.");
        workflowStatus = WorkflowStatus.VotingSessionEnded;
        emit WorkflowStatusChange(WorkflowStatus.VotingSessionStarted, WorkflowStatus.VotingSessionEnded);
    }
    

    /**
     * @dev Enregistre une nouvelle proposition avec la description donnée.
     * @param _description La description de la proposition.
     * Exigences :
     * - La description de la proposition ne peut pas être vide.
     * Le votant ne doit pas avoir déjà voté.
     * Emet un événement `ProposalRegistered` avec l'index de la nouvelle proposition enregistrée.
     */
    function registerProposal(string memory _description) public onlyDuringVotingSession onlyRegisteredVoter {
        require(bytes(_description).length > 0, "Proposal description cannot be empty.");
        require(!voters[msg.sender].hasVoted, "You have already voted.");
        proposals.push(Proposal(_description, 0));
        emit ProposalRegistered(proposals.length - 1);
    }



    
    /**
     * @dev Permet à un électeur inscrit de voter pour une proposition spécifique.
     * @param _proposalId L'identifiant de la proposition pour laquelle voter.
     * Exigences :
     * - L'ID de la proposition doit être valide (inférieur au nombre total de propositions).
     * L'électeur ne doit pas avoir déjà voté.
     */
    function vote(uint _proposalId) public onlyDuringVotingSession onlyRegisteredVoter {
        require(_proposalId < proposals.length, "Invalid proposal ID.");
        require(!voters[msg.sender].hasVoted, "You have already voted.");
        proposals[_proposalId].voteCount++;
        voters[msg.sender].hasVoted = true;
        voters[msg.sender].votedProposalId = _proposalId;
        emit Voted(msg.sender, _proposalId);
    }
    


    /**
     * @dev Comptabiliser les votes et déterminer la proposition gagnante.
     * Cette fonction ne peut être appelée par le titulaire du contrat qu'après la fin de la session de vote.
     */
    function tallyVotes() public onlyOwner onlyAfterVotingSessionEnded {
        uint winningVoteCount = 0;
        for (uint i = 0; i < proposals.length; i++) {
            if (proposals[i].voteCount > winningVoteCount) {
                winningVoteCount = proposals[i].voteCount;
                winningProposalId = i;
            }
        }
        workflowStatus = WorkflowStatus.VotesTallied;
    }
    

    /**
     * @dev Retrieves the description of the winning proposal.
     * @return The description of the winning proposal.
     */
    function getWinner() public view returns (string memory) {
        require(workflowStatus == WorkflowStatus.VotesTallied, "Votes are not tallied yet.");
        return proposals[winningProposalId].description;
    }


    /**
     * @dev Supprime un électeur de la liste des électeurs inscrits.
     * @param _voterAddress L'adresse de l'électeur à supprimer.
     * @notice Seul le propriétaire du contrat peut appeler cette fonction.
     * @notice L'électeur doit être inscrit avant de pouvoir être supprimé.
     * @notice Emet un événement `VoterRemoved`.
     */
    function removeVoter(address _voterAddress) public onlyOwner {
        require(voters[_voterAddress].isRegistered, "Voter is not registered.");
        delete voters[_voterAddress];
        emit VoterRemoved(_voterAddress);
    }
    event VoterRemoved(address indexed voterAddress);


    /**
     * @dev Retourne si l'appelant a voté ou non.
     * @return Une valeur booléenne indiquant si l'appelant a voté.
     */
    function hasVoted() public view returns (bool) {
        return voters[msg.sender].hasVoted;
    }

}
