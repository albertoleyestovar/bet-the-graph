import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  OwnershipTransferred,
  betPlaced,
  betRoundFinished,
  claimedReward
} from "../generated/BetApp/BetApp"

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent =
    changetype<OwnershipTransferred>(newMockEvent())

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createbetPlacedEvent(
  _roundId: BigInt,
  _address: Address,
  _betValue: BigInt,
  _betAmount: BigInt
): betPlaced {
  let betPlacedEvent = changetype<betPlaced>(newMockEvent())

  betPlacedEvent.parameters = new Array()

  betPlacedEvent.parameters.push(
    new ethereum.EventParam(
      "_roundId",
      ethereum.Value.fromUnsignedBigInt(_roundId)
    )
  )
  betPlacedEvent.parameters.push(
    new ethereum.EventParam("_address", ethereum.Value.fromAddress(_address))
  )
  betPlacedEvent.parameters.push(
    new ethereum.EventParam(
      "_betValue",
      ethereum.Value.fromUnsignedBigInt(_betValue)
    )
  )
  betPlacedEvent.parameters.push(
    new ethereum.EventParam(
      "_betAmount",
      ethereum.Value.fromUnsignedBigInt(_betAmount)
    )
  )

  return betPlacedEvent
}

export function createbetRoundFinishedEvent(
  _roundId: BigInt,
  _winningValue: BigInt
): betRoundFinished {
  let betRoundFinishedEvent = changetype<betRoundFinished>(newMockEvent())

  betRoundFinishedEvent.parameters = new Array()

  betRoundFinishedEvent.parameters.push(
    new ethereum.EventParam(
      "_roundId",
      ethereum.Value.fromUnsignedBigInt(_roundId)
    )
  )
  betRoundFinishedEvent.parameters.push(
    new ethereum.EventParam(
      "_winningValue",
      ethereum.Value.fromUnsignedBigInt(_winningValue)
    )
  )

  return betRoundFinishedEvent
}

export function createclaimedRewardEvent(
  _roundId: BigInt,
  _address: Address,
  _rewardAmount: BigInt
): claimedReward {
  let claimedRewardEvent = changetype<claimedReward>(newMockEvent())

  claimedRewardEvent.parameters = new Array()

  claimedRewardEvent.parameters.push(
    new ethereum.EventParam(
      "_roundId",
      ethereum.Value.fromUnsignedBigInt(_roundId)
    )
  )
  claimedRewardEvent.parameters.push(
    new ethereum.EventParam("_address", ethereum.Value.fromAddress(_address))
  )
  claimedRewardEvent.parameters.push(
    new ethereum.EventParam(
      "_rewardAmount",
      ethereum.Value.fromUnsignedBigInt(_rewardAmount)
    )
  )

  return claimedRewardEvent
}
