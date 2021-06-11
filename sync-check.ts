import { providers } from 'ethers'
import { injectL2Context, sleep } from '@eth-optimism/core-utils'
import * as dotenv from 'dotenv'

dotenv.config()

const binarySearchForMismatch = async (sequencerProvider, replicaProvider, latest) => {
  console.log(`Executing a binary search to determine the first mismatched block...`)

  let start = 1
  let end = latest
  while (start + 1 !== end) {
    const middle = Math.floor((start + end) / 2)

    console.log(`Checking block ${middle + 1}`)
    const [replicaBlock, sequencerBlock] = await Promise.all([
      replicaProvider.getBlock('latest') as any,
      sequencerProvider.getBlock('latest') as any
    ])

    if (replicaBlock.stateRoot === sequencerBlock.stateRoot) {
      console.log(`State roots were still matching at block ${middle + 1}`)
      start = middle
    } else {
      console.log(`State roots were mismatched at block ${middle + 1}`)
      end = middle
    }
  }

  return end
}

const main = async () => {
  const sequencerProvider = injectL2Context(new providers.JsonRpcProvider(`https://${process.env.PROJECT_NETWORK}-sequencer.optimism.io`))
  const replicaProvider = injectL2Context(new providers.JsonRpcBatchProvider(`http://localhost:${process.env.L2GETH_HTTP_PORT}`))

  // Continuously loop while replica runs
  while (true) {
    let replicaLatest = await replicaProvider.getBlock('latest') as any
    let sequencerCorresponding = await sequencerProvider.getBlock(replicaLatest.number) as any

    if(replicaLatest.stateRoot !== sequencerCorresponding.stateRoot) {
      console.log('Latest replica state root is mismatched from sequencer')
      const firstMismatch = await binarySearchForMismatch(sequencerProvider, replicaProvider, replicaLatest.number)
      console.log(`First state root mismatch at block ${firstMismatch}`)
      throw new Error('Replica state root mismatched')
    } 
    
    console.log(`Block ${replicaLatest.number} state roots matching!`)

    // Fetch next block and sleep if not new
    replicaLatest = await replicaProvider.getBlock('latest') as any
    while (replicaLatest.number === sequencerCorresponding.number) {
      // Could make this configurable!
      await sleep(1_000)
      replicaLatest = await replicaProvider.getBlock('latest') as any
    }
  }
}

main().catch(e => {
  console.log(e)
  process.exit(1)
})