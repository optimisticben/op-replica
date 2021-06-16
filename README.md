# Optimism replica

This project can be used to set up a local Optmism replica.

## Usage

```
docker-compose up -d
```

## Configuration

To configure the project, create a `.env` file at the project root with this optional settings.

- `PROJECT_NETWORK` The name of the network to use, `kovan` or `mainnet`
- `L2GETH_IMAGE_TAG` The Docker image tag to use for [l2geth](https://hub.docker.com/r/ethereumoptimism/l2geth)
- `DTL_IMAGE_TAG` The Docker image tag to use for [data-transport-layer](https://hub.docker.com/r/ethereumoptimism/data-transport-layer)
- `L2GETH_HTTP_PORT` The port to expose for `l2geth`

### Versions

We recommend using the latest versions of both packages. Find them as GitHub tags [here](https://github.com/ethereum-optimism/optimism/tags) and as published Docker images linked in the badges:

| Package                                                                                                                         | Docker                                                                                                                                                                                                              |
| ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`@eth-optimism/l2geth`](https://github.com/ethereum-optimism/optimism/tree/master/l2geth)                                      | [![Docker Image Version (latest by date)](https://img.shields.io/docker/v/ethereumoptimism/l2geth)](https://hub.docker.com/r/ethereumoptimism/l2geth/tags?page=1&ordering=last_updated)                             |
| [`@eth-optimism/data-transport-layer`](https://github.com/ethereum-optimism/optimism/tree/master/packages/data-transport-layer) | [![Docker Image Version (latest by date)](https://img.shields.io/docker/v/ethereumoptimism/data-transport-layer)](https://hub.docker.com/r/ethereumoptimism/data-transport-layer/tags?page=1&ordering=last_updated) |

### Example
```
PROJECT_NETWORK=mainnet
L2GETH_HTTP_PORT=9991
DTL_IMAGE_TAG=0.4.0
L2GETH_IMAGE_TAG=0.4.0
```

## Sync check

To make sure your verifier is running correctly, we've provided a script that checks its state roots against our sequencer. To run it, run

```
yarn
npx ts-node src/sync-check.ts
```