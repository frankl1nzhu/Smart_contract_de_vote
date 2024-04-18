'use client'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { abi, contractAddress } from '@/constants';

import { useAccount } from 'wagmi';
import { readContract, prepareWriteContract, writeContract } from '@wagmi/core';
import { useState } from 'react';
import { actionAsyncStorage } from 'next/dist/client/components/action-async-storage.external';

export default function Home() {
  const { isConnected, address, account } = useAccount();
  const [proposalDescription, setProposalDescription] = useState('');
  const [votingSessionStarted, setVotingSessionStarted] = useState(false);


  const registerVoter = async (voterAddress) => {
    try {
      const contract = prepareWriteContract(abi, contractAddress, address, account);
      const result = await writeContract(contract, 'registerVoter', [voterAddress], account);
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  };

  const startProposalRegistrationSession = async () => {
    try {
      const contract = prepareWriteContract(abi, contractAddress, address, account);
      const result = await writeContract(contract, 'startProposalRegistrationSession', account);
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  };

  const registerProposal = async () => {
    try {
      const contract = prepareWriteContract(abi, contractAddress, address, account);
      const result = await writeContract(contract, 'registerProposal', [proposalDescription], account);
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  };

  const endProposalRegistrationSession = async () => {
    try {
      const contract = prepareWriteContract(abi, contractAddress, address, account);
      const result = await writeContract(contract, 'endProposalRegistrationSession', account);
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  };

  const startVotingSession = async () => {
    try {
      const contract = prepareWriteContract(abi, contractAddress, address, account);
      const result = await writeContract(contract, 'startVotingSession',account);
      console.log(result);
      setVotingSessionStarted(true);
    } catch (error) {
      console.error(error);
    }
  };


  const voteForProposal = async (proposalId) => {
    try {
      const contract = prepareWriteContract(abi, contractAddress, address, account);
      const result = await writeContract(contract, 'voteForProposal', [proposalId], account);
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  };
  
  const endVotingSession = async () => {
    try {
      const contract = prepareWriteContract(abi, contractAddress, address, account);
      const result = await writeContract(contract, 'endVotingSession',account);
      console.log(result);
      setVotingSessionStarted(false);
    } catch (error) {
      console.error(error);
    }
  };
  
  const tallyVotes = async () => {
    try {
      const contract = prepareWriteContract(abi, contractAddress, address, account);
      const result = await writeContract(contract, 'tallyVotes', account);
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  };
  
  const getResults = async () => {
    try {
      const contract = readContract(abi, contractAddress, account);
      const result = await readContract(contract, 'getResults', account);
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  };
  

  return (
    <>
      {isConnected ? (
        <div>
          <button onClick={() => registerVoter('0x...')}>Enregistrer un électeur</button>

          <button onClick={startProposalRegistrationSession}>Démarrer la session d'enregistrement des propositions</button>
          
          <input type="text" value={proposalDescription} onChange={(e) => setProposalDescription(e.target.value)} />
          
          <button onClick={registerProposal}>Enregistrer la proposition</button>
          
          <button onClick={endProposalRegistrationSession}>Terminer la session d'enregistrement des propositions</button>
          
          {!votingSessionStarted && <button onClick={startVotingSession}>Démarrer la session de vote</button>}
          
          {votingSessionStarted && <button onClick={endVotingSession}>Terminer la session de vote</button>}
          
          <button onClick={tallyVotes}>Comptabiliser les votes</button>
          
          <button onClick={getResults}>Consulter les résultats</button>
        </div>
      ) : (
        <p>Veuillez connecter votre portefeuille à notre DApp.</p>
      )}
    </>
  );

}