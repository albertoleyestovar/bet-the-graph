import {
  OwnershipTransferred as OwnershipTransferredEvent,
  betPlaced as betPlacedEvent,
  betRoundFinished as betRoundFinishedEvent,
  claimedReward as claimedRewardEvent
} from "../generated/BetApp/BetApp"
import {
  OwnershipTransferred,
  betPlaced,
  betRoundFinished,
  claimedReward
} from "../generated/schema"

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handlebetPlaced(event: betPlacedEvent): void {
  let entity = new betPlaced(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity._roundId = event.params._roundId
  entity._address = event.params._address
  entity._betValue = event.params._betValue
  entity._betAmount = event.params._betAmount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handlebetRoundFinished(event: betRoundFinishedEvent): void {
  let entity = new betRoundFinished(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity._roundId = event.params._roundId
  entity._winningValue = event.params._winningValue

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleclaimedReward(event: claimedRewardEvent): void {
  let entity = new claimedReward(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity._roundId = event.params._roundId
  entity._address = event.params._address
  entity._rewardAmount = event.params._rewardAmount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
