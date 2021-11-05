# Running a Network Node

This project lets you set up a local read-only replica of the Optimistic Ethereum chain (either the main one or the Kovan testnet). [New
transactions are submitted either to the sequencer outside of Ethereum or to the Canonical Transaction Chain on
L1](https://research.paradigm.xyz/optimism#data-availability-batches), so submitting transactions to an L2 replica does not make sense.

## Architecture

You need two components to replicate Optimistic Ethereum:

- `data-transport-layer`, which retrieves and indexes blocks from L1. To access L1 you need an Ethereum Layer 1 provider, such as
  [Infura](https://infura.io/).

- `l2geth`, which provides an Ethereum node where you applications can connect and run API calls.

## Resource requirements

The `data-tansport-layer` should run with 1 CPU and 256Mb of memory.

The `l2geth` process should run with 1 or 2 CPUs and between 4 and 8Gb of memory.

With this configuration a synchronization from block 0 to current height is expect to take about 8 hours.

## Software Packages

These packages are required to run the replica:

1. [Docker](https://www.docker.com/)
1. [Docker compose](https://docs.docker.com/compose/install/)

## Configuration

To configure the project, clone this repository and copy the `env.example` file to `.env`.

Set the `SHARED_ENV_PATH` to an existing collection of environment files, or copy those, make your changes and point to that new directory.

Fill in the rest of the `.env` file with your endpoints.

### Additional Settings

Change any other settings required for your environment

| Variable                 | Purpose                                                  | Default
| ------------------------ | -------------------------------------------------------- | -----------
| DATA_TRANSPORT_LAYER__L1_RPC_ENDPOINT | An endpoint for the L1 network, either kovan or mainnet.
| DATA_TRANSPORT_LAYER__L2_RPC_ENDPOINT | Optimistic endpoint, such as https://kovan.optimism.io or https://mainnet.optimism.io
| REPLICA_HEALTHCHECK__ETH_NETWORK_RPC_PROVIDER | The L2 endpoint to check the replica against | (typically the same as the DATA_TRANSPORT_LAYER__L2_RPC_ENDPOINT)
| DTL_IMAGE_TAG            | Data transport layer version                             | 0.4.3 (see below)
| ETH_NETWORK              | Ethereum Layer1 and Layer2 network (mainnet,kovan)       | mainnet (change to `kovan` for the test network)
| L2GETH_HTTP_PORT         | Port number for the l2geth endpoint                      | 9991
| L2GETH_IMAGE_TAG         | L2geth version                                           | 0.4.6 (see below)
| SHARED_ENV_PATH          | Path to a directory containing env files                 | [a directory under ./kustomize/replica/envs](https://github.com/optimisticben/op-replica/tree/main/kustomize/replica/envs)


### Docker Image Versions

We recommend using the latest versions of both docker images. Find them as GitHub tags
[here](https://github.com/ethereum-optimism/optimism/tags) and as published Docker images linked in the badges:

| Package                                                                                                                         | Docker                                                                                                                                                                                                              |
| ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`@eth-optimism/l2geth`](https://github.com/ethereum-optimism/optimism/tree/master/l2geth)                                      | [![Docker Image Version (latest by date)](https://img.shields.io/docker/v/ethereumoptimism/l2geth)](https://hub.docker.com/r/ethereumoptimism/l2geth/tags?page=1&ordering=last_updated)                             |
| [`@eth-optimism/data-transport-layer`](https://github.com/ethereum-optimism/optimism/tree/master/packages/data-transport-layer) | [![Docker Image Version (latest by date)](https://img.shields.io/docker/v/ethereumoptimism/data-transport-layer)](https://hub.docker.com/r/ethereumoptimism/data-transport-layer/tags?page=1&ordering=last_updated) |



## Usage

- Start the replica (after which you can access it at `http://localhost/L2GETH_HTTP_PORT`:
   ```sh
   docker-compose up -d
   ```

- Get the logs for `l2geth`:
  ```sh
  docker logs op-replica_l2geth_1
  ```

- Get the logs for `data-transport-layer`:
  ```sh
  docker logs op-replica_dtl_1
  ```

- Stop the replica:
  ```sh
  docker-compose down
  ```


## Sync Check
 
There is a sync check container. It fails at startup because at that point the replica is not running yet. But you can run it later with this command:

```sh
docker start op-replica_replica-healthcheck_1
```

And then view its status using this command:

```sh
docker logs op-replica_replica-healthcheck_1 -f
```
