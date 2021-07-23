# Optimistic Ethereum Replica

This project lets you set up a local read-only replica to the Optimistic Ethereum chain (either the main one or the Kovan testnet). This is the
only kind of replica that makes sense in this environment. [New transactions are submitted either to the sequencer 

## About

An Optimism replica currently requires 2 components. A `data-transport-layer` component which retrieves and indexes blocks for the other component, `l2geth`. `l2geth` then provides the layer 2 endpoint.

The data-transport-layer requires an Ethereum layer1 RPC provider. This can be a your own local node, a hosted Infura node, etc.

## Required configuration

To configure the project, copy the `.env.example` file to `.env`.
Set `L1_RPC_ENDPOINT` in the `.env` file to your Ethereum Layer1 RPC provider (local node, Infura, etc.)

## Other configuration

Change any other settings required for your environment

| Variable  | Purpose |
| ------------- | ------------- |
| L1_RPC_ENDPOINT | External layer 1 RPC provider (you provide) |
| DTL_IMAGE_TAG | Data transport layer version |
| DTL_PORT | Port number for the data-transport-layer endpoint |
| ETH_NETWORK | Ethereum Layer1 and Layer2 network (mainnet,kovan) |
| ETH_NETWORK_RPC_PROVIDER | Layer2 source of truth endpoint, used for the sync check |
| ETH_REPLICA_RPC_PROVIDER | Layer2 local replica endpoint, used for the sync check |
| L2GETH_HTTP_PORT | Port number for the l2geth endpoint |
| L2GETH_IMAGE_TAG | L2geth version |

## Usage

```
docker-compose up -d
```

### Versions

We recommend using the latest versions of both packages. Find them as GitHub tags [here](https://github.com/ethereum-optimism/optimism/tags) and as published Docker images linked in the badges:

| Package                                                                                                                         | Docker                                                                                                                                                                                                              |
| ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`@eth-optimism/l2geth`](https://github.com/ethereum-optimism/optimism/tree/master/l2geth)                                      | [![Docker Image Version (latest by date)](https://img.shields.io/docker/v/ethereumoptimism/l2geth)](https://hub.docker.com/r/ethereumoptimism/l2geth/tags?page=1&ordering=last_updated)                             |
| [`@eth-optimism/data-transport-layer`](https://github.com/ethereum-optimism/optimism/tree/master/packages/data-transport-layer) | [![Docker Image Version (latest by date)](https://img.shields.io/docker/v/ethereumoptimism/data-transport-layer)](https://hub.docker.com/r/ethereumoptimism/data-transport-layer/tags?page=1&ordering=last_updated) |


## Sync check

To make sure your verifier is running correctly, we've provided a script that checks its state roots against our sequencer.

```
yarn
npx ts-node src/sync-check.ts
```

You can also run this sync check as an express server that exposes metrics:
```
npx ts-node src/index.ts
```
