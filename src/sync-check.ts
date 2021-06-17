import { providers } from 'ethers'
import { injectL2Context, sleep } from '@eth-optimism/core-utils'
import * as dotenv from 'dotenv'

import { ReplicaMetrics } from './types'

dotenv.config()

const binarySearchForMismatch = async (
  sequencerProvider: providers.JsonRpcProvider,
  replicaProvider: providers.JsonRpcProvider,
  latest: number
): Promise<number> => {
  console.log(`Executing a binary search to determine the first mismatched block...`)

  let start = 0
  let end = latest
  while (start !== end) {
    const middle = Math.floor((start + end) / 2)

    console.log(`Checking block ${middle}`)
    const [replicaBlock, sequencerBlock] = await Promise.all([
      replicaProvider.getBlock(middle) as any,
      sequencerProvider.getBlock(middle) as any
    ])

    if (replicaBlock.stateRoot === sequencerBlock.stateRoot) {
      console.log(`State roots were still matching at block ${middle}`)
      start = middle
    } else {
      console.log(`State roots were mismatched at block ${middle}`)
      console.log('replica', replicaBlock)
      console.log('sequencer', sequencerBlock)

      end = middle
    }
  }

  return end
}

export const runSyncCheck = async (metrics?: ReplicaMetrics) => {
  const sequencerProvider = injectL2Context(new providers.JsonRpcProvider(`https://${process.env.PROJECT_NETWORK}.optimism.io`))
  const replicaProvider = injectL2Context(new providers.JsonRpcBatchProvider(`http://localhost:${process.env.L2GETH_HTTP_PORT}`))

  // Continuously loop while replica runs
  while (true) {
    let replicaLatest = await replicaProvider.getBlock('latest') as any
    let sequencerCorresponding = await sequencerProvider.getBlock(replicaLatest.number) as any

    if (replicaLatest.stateRoot !== sequencerCorresponding.stateRoot) {
      console.log('Latest replica state root is mismatched from sequencer')
      const firstMismatch = await binarySearchForMismatch(sequencerProvider, replicaProvider, replicaLatest.number)
      console.log(`First state root mismatch at block ${firstMismatch}`)
      if (metrics) {
        metrics.lastMatchingStateRootHeight.set(firstMismatch)
      }
      throw new Error('Replica state root mismatched')
    }

    console.log(`Block ${replicaLatest.number} state roots matching!`)
    if (metrics) {
      metrics.lastMatchingStateRootHeight.set(replicaLatest.number)
    }

    replicaLatest = await replicaProvider.getBlock('latest') as any
    const sequencerLatest = await sequencerProvider.getBlock('latest')
    const heightDiff = sequencerLatest.number - replicaLatest.number
    console.log(`Current height difference from sequencer: ${heightDiff}`)
    if (metrics) {
      metrics.replicaSequencerHeightDiff.set(heightDiff)
    }
    // Fetch next block and sleep if not new
    while (replicaLatest.number === sequencerCorresponding.number) {
      // Could make this configurable!
      await sleep(1_000)
      replicaLatest = await replicaProvider.getBlock('latest') as any
    }
  }
}

runSyncCheck().catch(e => {
  console.log(e)
  process.exit(1)
})
