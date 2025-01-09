import { BigInt, Bytes } from "@graphprotocol/graph-ts"
import {
  OwnershipTransferred as OwnershipTransferredEvent,
  betPlaced as betPlacedEvent,
  betRoundFinished as betRoundFinishedEvent,
  claimedReward as claimedRewardEvent,
} from "../generated/BetApp/BetApp"
import {
  OwnershipTransferred,
  betPlaced,
  betRoundFinished,
  claimedReward,
  userRound,
  roundAddressList
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

  entity.save();
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

  entity.save();

  let id = Bytes.fromUTF8(entity._roundId.toString());
  let roundAddressListEntity = roundAddressList.load(id);
  if (!roundAddressListEntity) {
    roundAddressListEntity = new roundAddressList(id);
    roundAddressListEntity._roundId = entity._roundId;
    roundAddressListEntity._addressList = new Array<Bytes>();;
  }

  let arr = roundAddressListEntity._addressList;
  arr.push(entity._address);
  roundAddressListEntity._addressList = arr;
  roundAddressListEntity.save();

  id = Bytes.fromUTF8(event.params._address.toHex().concat('-').concat(event.params._roundId.toString()));
  let roundEntity = userRound.load(id);
  if (!roundEntity) {
    roundEntity = new userRound(id);
  }
  roundEntity._roundId = event.params._roundId
  roundEntity._address = event.params._address
  roundEntity._betValue = event.params._betValue
  roundEntity._betAmount = event.params._betAmount
  roundEntity._isJoined = true;
  roundEntity.save()
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

  let roundAddressListEntity = roundAddressList.load(Bytes.fromUTF8(entity._roundId.toString()));
  if (roundAddressListEntity) {
    const _addressList = roundAddressListEntity._addressList;

    // get totalBetAmount & totalWinAmount
    let totalBetAmount = 0;
    let totalWinAmount = 0;
    for (let i = 0; i < _addressList.length; i++) {
      const address = _addressList[i];
      let id = Bytes.fromUTF8(address.toHex().concat('-').concat(entity._roundId.toString()));
      let roundEntity = userRound.load(id);
      if (roundEntity) {
        const betAmount = roundEntity._betAmount.toI32();
        const betValue = roundEntity._betValue;
        if (betValue == entity._winningValue) {
          totalWinAmount += roundEntity._betAmount.toI32();
        }
        totalBetAmount += betAmount;
      }
    }

    // update the userEntity per roundId and address
    for (let i = 0; i < _addressList.length; i++) {
      const address = _addressList[i];
      // calc reward amount
      let id = Bytes.fromUTF8(address.toHex().concat('-').concat(entity._roundId.toString()));
      let roundEntity = userRound.load(id);
      if (roundEntity) {
        const betAmount = roundEntity._betAmount.toI32();
        const betValue = roundEntity._betValue;
        let _rewardAmount = 0;
        if (betValue == entity._winningValue) {
          _rewardAmount = totalWinAmount == 0 ? 0 : i32(Math.floor(betAmount * totalBetAmount * 0.95) / totalWinAmount);
        }
        roundEntity._rewardAmount = BigInt.fromI32(i32(Math.floor(_rewardAmount)));
        roundEntity._isClaimed = false;
        roundEntity._totalDeposit = BigInt.fromI32(totalBetAmount);
        roundEntity._winningValue = entity._winningValue;
        roundEntity._numJoined = _addressList.length;
        roundEntity.save();
      }
    }
  }
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

  const id = Bytes.fromUTF8(event.params._address.toHex().concat('-').concat(event.params._roundId.toString()));
  let roundEntity = userRound.load(id);
  if (!roundEntity) {
    roundEntity = new userRound(id);
  }
  roundEntity._roundId = event.params._roundId
  roundEntity._address = event.params._address
  roundEntity._isClaimed = true

  roundEntity.save()
}