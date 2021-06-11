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


### Example
```
PROJECT_NETWORK=kovan
L2GETH_HTTP_PORT=9991
DTL_IMAGE_TAG=0.3.5
L2GETH_IMAGE_TAG=0.3.7
```

## Sync check

To make sure your verifier is running correctly, we've provided a script that checks its state roots against our sequencer. To run it, run

```
yarn
ts-node sync-check.ts
```