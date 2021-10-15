#!/bin/sh
set -exu

GETH_DATA_DIR=/geth
GETH_CHAINDATA_DIR=$GETH_DATA_DIR/geth/chaindata
GETH_KEYSTORE_DIR=$GETH_DATA_DIR/keystore
if [ -d "$GETH_CHAINDATA_DIR" ]; then
    echo "$GETH_CHAINDATA_DIR existing, skipping init"
    exit 0
fi
if [ ! -d "$GETH_KEYSTORE_DIR" ]; then
    echo "$GETH_KEYSTORE_DIR missing, running account import"
    echo -n "$BLOCK_SIGNER_PRIVATE_KEY_PASSWORD" > "$GETH_DATA_DIR"/password
    echo -n "$BLOCK_SIGNER_PRIVATE_KEY" > "$GETH_DATA_DIR"/block-signer-key
    geth account import \
        --datadir=/"$GETH_DATA_DIR" \
        --password "$GETH_DATA_DIR"/password \
        "$GETH_DATA_DIR"/block-signer-key
fi
if [ ! -d "$GETH_CHAINDATA_DIR" ]; then
    echo "$GETH_CHAINDATA_DIR missing, running init"
    echo "Retrieving genesis file $L2GETH_GENESIS_URL"
    TEMP_DIR=$(mktemp -d)
    wget -O "$TEMP_DIR"/genesis.json "$L2GETH_GENESIS_URL"
    geth init \
        --datadir=/"$GETH_DATA_DIR" \
        "$TEMP_DIR"/genesis.json
    exit 0
fi
echo "This should not happen, exiting with error"
exit 1