#!/bin/sh
set -eou

if [[ -z $DATADIR ]]; then
    echo "Must pass DATADIR"
    exit 1
fi
if [[ -z $BLOCK_SIGNER_ADDRESS ]]; then
    echo "Must pass BLOCK_SIGNER_ADDRESS"
    exit 1
fi

geth \
  --datadir=$DATADIR \
  --password=$DATADIR/password \
  --allow-insecure-unlock \
  --unlock=$BLOCK_SIGNER_ADDRESS \
  --mine \
  --miner.etherbase=$BLOCK_SIGNER_ADDRESS
