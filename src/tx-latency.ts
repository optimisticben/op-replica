import { providers, Wallet } from 'ethers'
import { injectL2Context } from '@eth-optimism/core-utils'
import * as dotenv from 'dotenv'

dotenv.config()
// Constants
const ETH_NETWORK = process.env.ETH_NETWORK || 'mainnet'
const ETH_REPLICA_RPC_PROVIDER = process.env.ETH_REPLICA_RPC_PROVIDER || 'http://localhost:8545'
const L2_USER_PRIVATE_KEY = process.env.L2_USER_PRIVATE_KEY as string
const L2_RECIPIENT_ADDRESS = process.env.L2_RECIPIENT_ADDRESS as string


export const runLatencyCheck = async () => {
  const replicaProvider = injectL2Context(new providers.JsonRpcBatchProvider(ETH_REPLICA_RPC_PROVIDER))

  const l2Wallet = new Wallet(L2_USER_PRIVATE_KEY, replicaProvider)
	const startTime = new Date()
	const tx = await l2Wallet.sendTransaction({
		to: L2_RECIPIENT_ADDRESS,
		value: 42069,
	})
	const { status } = await tx.wait()
	const endTime = new Date()
	const successMessage = status === 1 ? 'Tx succeeded' : 'Tx reverted'
	const etherscanPrefix = ETH_NETWORK === 'mainnet' ? '' : 'kovan-'
	console.log(`${successMessage}: https://${etherscanPrefix}optimistic.etherscan.io/tx/${tx.hash}`)
	const timeDiff = endTime.getTime() - startTime.getTime() //in ms
	console.log(`ETH transfer tx completed in ${timeDiff} ms.`)
}

runLatencyCheck().catch(e => {
  console.log(e)
  process.exit(1)
})
