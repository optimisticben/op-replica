import { Gauge } from 'prom-client'

export interface ReplicaMetrics {
	lastMatchingStateRootHeight: Gauge<string>
  replicaSequencerHeightDiff: Gauge<string>
}
