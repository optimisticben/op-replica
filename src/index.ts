import express from 'express'
import promBundle from 'express-prom-bundle'
import { Metrics } from '@eth-optimism/common-ts'
import * as dotenv from 'dotenv'

import { ReplicaMetrics } from './types'
import { runSyncCheck } from './sync-check'


/**
 * Helper functions
 */

const initMetrics = (app: express.Express) : ReplicaMetrics => {
  const metrics = new Metrics({
    prefix: 'replica_health',
    labels: {
      network: process.env.PROJECT_NETWORK,
      gethRelease: process.env.L2GETH_IMAGE_TAG,
    },
  })
  const metricsMiddleware = promBundle({
    includeMethod: true,
    includePath: true,
  })
  app.use(metricsMiddleware)

  return {
    lastMatchingStateRootHeight: new metrics.client.Gauge({
      name: 'last_matching_state_root_height',
      help: 'Height of last matching state root of replica',
      registers: [metrics.registry]
    })
  }
}

dotenv.config()
const app = express()

const replicaMetrics = initMetrics(app)
runSyncCheck(replicaMetrics)

app.get('/', (req, res) => {
  res.send('hello')
})

app.listen(3000, () => {
  console.log('Listening on port 3000')
})