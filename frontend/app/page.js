'use client'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { abi, contractAddress } from '@/constants';

import { useAccount } from 'wagmi'
import { readContract, prepareWriteContract, writeContract } from '@wagmi/core'

import { useState } from 'react';

export default function Home() {

  const { address, isConnected } = useAccount()
  const [voterAddress, setVoterAddress] = useState('')
  const [proposalDescription, setProposalDescription] = useState('')
  const [feedbackMessage, setFeedbackMessage] = useState('')

  const registerVoter = async () => {
    const { request } = await prepareWriteContract({
      address: contractAddress,
      abi: abi,
      functionName: 'registerVoter',
      args: [voterAddress]
    })
    const { hash } = await writeContract(request)
    setFeedbackMessage("Voter registered successfully. Transaction hash: " + hash)
  }

  const startProposalsRegistration = async () => {
    const { request } = await prepareWriteContract({
      address: contractAddress,
      abi: abi,
      functionName: 'startProposalsRegistration',
    })
    const { hash } = await writeContract(request)
    setFeedbackMessage("Proposals registration started successfully. Transaction hash: " + hash)
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
        <div>
          <p>Voter Address: <input type="text" onChange={(e) => setVoterAddress(e.target.value)} /></p>
          <p><button onClick={registerVoter}>Register Voter</button></p>
          <p><button onClick={startProposalsRegistration}>Start Proposals Registration</button></p>
          <p>Proposal Description: <input type="text" onChange={(e) => setProposalDescription(e.target.value)} /></p>
          <p><button onClick={registerProposal}>Register Proposal</button></p>
          <p><button onClick={endProposalsRegistration}>End Proposals Registration</button></p>
          <p><button onClick={startVotingSession}>Start Voting Session</button></p>
          <p><button onClick={() => vote(0)}>Vote for Proposal 0</button></p> {/* Change the proposal ID as needed */}
          <p><button onClick={endVotingSession}>End Voting Session</button></p>
          <p><button onClick={tallyVotes}>Tally Votes</button></p>
          <p><button onClick={getWinner}>Get Winner</button></p>
          {feedbackMessage && <p>{feedbackMessage}</p>}
        </div>
      ) : (
        <p>Please connect your Wallet to our DApp.</p>
      )}
    </>
  )
}
