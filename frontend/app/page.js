'use client'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { abi, contractAddress } from '@/constants';

import { useAccount } from 'wagmi'
import { readContract, prepareWriteContract, writeContract } from '@wagmi/core'

import { useState } from 'react';
import Button from '@mui/material/Button';

export default function Home() {

  const { address, isConnected } = useAccount()
  const [voterAddress, setVoterAddress] = useState('')
  const [proposalDescription, setProposalDescription] = useState('')
  const [feedbackMessage, setFeedbackMessage] = useState('')

  const startProposalsRegistration = async () => {
    const { request } = await prepareWriteContract({
      address: contractAddress,
      abi: abi,
      functionName: 'startProposalsRegistration',
    })
    const { hash } = await writeContract(request, { gasLimit: 5000000 }); // 增加 gas 限制
    setFeedbackMessage("Proposals registration started successfully. Transaction hash: " + hash)
  }
  
  const registerVoter = async () => {
    await startProposalsRegistration();
    
    const { request } = await prepareWriteContract({
      address: contractAddress,
      abi: abi,
      functionName: 'registerVoter',
    })
    const { hash } = await writeContract(request, { gasLimit: 5000000 }); // 增加 gas 限制
    setFeedbackMessage("Voter registered successfully. Transaction hash: " + hash)
  }
  
  
  const registerProposal = async () => {
    const { request } = await prepareWriteContract({
      address: contractAddress,
      abi: abi,
      functionName: 'registerProposal',
      args: [proposalDescription]
    })
    const { hash } = await writeContract(request)
    setFeedbackMessage("Proposal registered successfully. Transaction hash: " + hash)
  }

  const endProposalsRegistration = async () => {
    const { request } = await prepareWriteContract({
      address: contractAddress,
      abi: abi,
      functionName: 'endProposalsRegistration',
    })
    const { hash } = await writeContract(request)
    setFeedbackMessage("Proposals registration ended successfully. Transaction hash: " + hash)
  }

  const startVotingSession = async () => {
    const { request } = await prepareWriteContract({
      address: contractAddress,
      abi: abi,
      functionName: 'startVotingSession',
    })
    const { hash } = await writeContract(request)
    setFeedbackMessage("Voting session started successfully. Transaction hash: " + hash)
  }

  const vote = async (proposalId) => {
    const { request } = await prepareWriteContract({
      address: contractAddress,
      abi: abi,
      functionName: 'vote',
      args: [proposalId]
    })
    const { hash } = await writeContract(request)
    setFeedbackMessage("Vote cast successfully. Transaction hash: " + hash)
  }

  const endVotingSession = async () => {
    const { request } = await prepareWriteContract({
      address: contractAddress,
      abi: abi,
      functionName: 'endVotingSession',
    })
    const { hash } = await writeContract(request)
    setFeedbackMessage("Voting session ended successfully. Transaction hash: " + hash)
  }

  const tallyVotes = async () => {
    const { request } = await prepareWriteContract({
      address: contractAddress,
      abi: abi,
      functionName: 'tallyVotes',
    })
    const { hash } = await writeContract(request)
    setFeedbackMessage("Votes tallied successfully. Transaction hash: " + hash)
  }

  const getWinner = async () => {
    const data = await readContract({
      address: contractAddress,
      abi: abi,
      functionName: 'getWinner',
    })
    setFeedbackMessage("Winner retrieved successfully. Winner: " + data)
  }

  return (
    <>
      <ConnectButton />
      {isConnected ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <p style={{ margin: '10px 0' }}>Voter Address: <input type="text" onChange={(e) => setVoterAddress(e.target.value)} /></p>
          <Button variant="contained" style={{ marginBottom: '10px' }} onClick={registerVoter}>Register Voter</Button>
          <Button variant="contained" style={{ marginBottom: '10px' }} onClick={startProposalsRegistration}>Start Proposals Registration</Button>
          <p style={{ margin: '10px 0' }}>Proposal Description: <input type="text" onChange={(e) => setProposalDescription(e.target.value)} /></p>
          <Button variant="contained" style={{ marginBottom: '10px' }} onClick={registerProposal}>Register Proposal</Button>
          <Button variant="contained" style={{ marginBottom: '10px' }} onClick={endProposalsRegistration}>End Proposals Registration</Button>
          <Button variant="contained" style={{ marginBottom: '10px' }} onClick={startVotingSession}>Start Voting Session</Button>
          <Button variant="contained" style={{ marginBottom: '10px' }} onClick={() => vote(0)}>Vote for Proposal 0</Button>
          <Button variant="contained" style={{ marginBottom: '10px' }} onClick={endVotingSession}>End Voting Session</Button>
          <Button variant="contained" style={{ marginBottom: '10px' }} onClick={tallyVotes}>Tally Votes</Button>
          <Button variant="contained" onClick={getWinner}>Get Winner</Button>
          {feedbackMessage && <p style={{ marginTop: '10px' }}>{feedbackMessage}</p>}
        </div>
      ) : (
        <p style={{ textAlign: 'center', marginTop: '20px' }}>Please connect your Wallet to our DApp.</p>
      )}
    </>
  )
}
