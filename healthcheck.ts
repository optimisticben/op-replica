import { providers } from 'ethers'
import { injectL2Context, sleep } from '@eth-optimism/core-utils'
import * as dotenv from 'dotenv'

dotenv.config()

const findFirstMismatch = async (sequencerProvider, replicaProvider, startBlockNum) => {
  console.log(await sequencerProvider.getBlock(0))
  console.log(await replicaProvider.getBlock(0))
  let currBlockNum = startBlockNum
  while (currBlockNum > 0) {
    let lastSequencerBlock = await sequencerProvider.getBlock(currBlockNum - 1) as any
    let lastReplicaBlock = await replicaProvider.getBlock(currBlockNum - 1) as any

    if (lastSequencerBlock.stateRoot === lastReplicaBlock.stateRoot) {
      console.log(`found last matching state root at ${currBlockNum - 1}`)
      return currBlockNum
    }

    currBlockNum -= 1
    console.log(`still mismatched at ${currBlockNum}`)
  }

  return currBlockNum
}

const main = async () => {
  const sequencerProvider = injectL2Context(new providers.JsonRpcProvider(`https://${process.env.PROJECT_NETWORK}-sequencer.optimism.io`))
  console.log(sequencerProvider)
  const replicaProvider = injectL2Context(new providers.JsonRpcBatchProvider(`http://localhost:${process.env.L2GETH_HTTP_PORT}`))
  console.log(replicaProvider)

  let replicaLatest = await replicaProvider.getBlock('latest') as any
  let sequencerLatest = await sequencerProvider.getBlock('latest') as any

  console.log(replicaLatest)
  console.log(sequencerLatest)

  // This should always be true
  while (sequencerLatest.number >= replicaLatest.number) {
    let sequencerCorresponding = await sequencerProvider.getBlock(replicaLatest.number) as any
    console.log(sequencerCorresponding)
    if(replicaLatest.stateRoot !== sequencerCorresponding.stateRoot) {
      console.log('Found mismatch')
      const firstMismatch = await findFirstMismatch(sequencerProvider, replicaProvider, replicaLatest.number)
      console.log(`first mismatch at block number ${firstMismatch}`)
    } else {
      console.log(`block ${replicaLatest.number} state roots matching!`)
    }

    // TODO: separate the logic here since it's just waiting and checking on new blocks
    replicaLatest = await replicaProvider.getBlock('latest') as any
    sequencerLatest = await sequencerProvider.getBlock('latest') as any
    if (replicaLatest.number === sequencerCorresponding.number) {
      await sleep(1_000)
      replicaLatest = await replicaProvider.getBlock('latest') as any
    }
  }
}

main().catch(e => {
  console.log(e)
  process.exit(1)
})