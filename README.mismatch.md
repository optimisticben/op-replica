# Stop the project
```
docker-compose down
```

# Delete the docker volume if it exists
```
docker volume rm op-replica_geth || true
```

# Start the project
```
docker-compose up -d
```

# Observe geth logs
```
docker-compose logs l2geth
```

# Start sync script and observe matching roots
```
./node_modules/.bin/ts-node sync-check.ts 
```

# Stop l2geth
```
docker-compose stop l2geth
```

# Start the project back up
```
docker-compose up -d
```

# Observe geth logs start indexing
```
docker-compose logs -f l2geth
```

# Start sync check script again
```
./node_modules/.bin/ts-node sync-check.ts 
Latest replica state root is mismatched from sequencer
Executing a binary search to determine the first mismatched block...
Checking block 1753
State roots were still matching at block 1753
Checking block 2628
State roots were still matching at block 2628
Checking block 3066
State roots were still matching at block 3066
Checking block 3285
State roots were mismatched at block 3285
Checking block 3175
State roots were mismatched at block 3175
Checking block 3120
State roots were mismatched at block 3120
Checking block 3093
State roots were mismatched at block 3093
Checking block 3079
State roots were still matching at block 3079
Checking block 3086
State roots were still matching at block 3086
Checking block 3089
State roots were still matching at block 3089
Checking block 3091
State roots were mismatched at block 3091
Checking block 3090
State roots were still matching at block 3090
First state root mismatch at block 3090
Error: Replica state root mismatched
    at main (/home/opben/repos/op-replica/sync-check.ts:50:13)
    at processTicksAndRejections (node:internal/process/task_queues:96:5)
```

# Still syncing?

Repeat the process of stopping l2geth again. I've had about 50/50 experience.

