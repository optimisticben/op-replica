import express from 'express'
import promBundle from 'express-prom-bundle'
import { Metrics } from '@eth-optimism/common-ts'

import { runSyncCheck } from './sync-check'

const app = express()

const metrics = new Metrics({
  prefix: 'sync',
  labels: {
    network: '',
    release: '',
  },
})
const metricsMiddleware = promBundle({
  includeMethod: true,
  includePath: true,
})
app.use(metricsMiddleware)

// TODO: add error handling and metrics
runSyncCheck()

app.get('/', (req, res) => {
  res.send('hello')
})

app.listen(3000, () => {
  console.log('Listening on port 3000')
})