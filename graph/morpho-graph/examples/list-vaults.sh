#!/usr/bin/env bash

# Vault Listing Script using curl
echo "🏦 BetFi Vault Directory"
echo "========================"

ENDPOINT="https://api.studio.thegraph.com/query/115527/bet-fi/v0.0.5"

echo "📊 Fetching vault details..."
echo ""

# Get detailed vault information
curl -s -X POST "$ENDPOINT" \
-H "Content-Type: application/json" \
-d '{
  "query": "{ 
    createMetaMorphos(orderBy: blockTimestamp, orderDirection: desc) { 
      id 
      name 
      symbol 
      metaMorpho 
      asset 
      caller 
      initialTimelock 
      blockNumber 
      blockTimestamp 
      transactionHash 
    } 
  }"
}' | python3 -c "
import json, sys
try:
    data = json.load(sys.stdin)
    vaults = data.get('data', {}).get('createMetaMorphos', [])
    
    if not vaults:
        print('📭 No vaults found')
        exit()
    
    print(f'✅ Found {len(vaults)} vault(s):')
    print()
    
    for i, vault in enumerate(vaults, 1):
        import datetime
        created = datetime.datetime.fromtimestamp(int(vault['blockTimestamp']))
        timelock_hours = int(vault['initialTimelock']) / 3600
        
        print(f'🏦 Vault #{i}')
        print(f'   Name: \"{vault[\"name\"] or \"Unnamed\"}\"')
        print(f'   Symbol: \"{vault[\"symbol\"] or \"No Symbol\"}\"')
        print(f'   Address: {vault[\"metaMorpho\"]}')
        print(f'   Asset: {vault[\"asset\"]}')
        print(f'   Creator: {vault[\"caller\"]}')
        print(f'   Timelock: {vault[\"initialTimelock\"]}s ({timelock_hours:.1f}h)')
        print(f'   Block: #{vault[\"blockNumber\"]}')
        print(f'   Created: {created.strftime(\"%Y-%m-%d %H:%M:%S\")}')
        print(f'   Tx: {vault[\"transactionHash\"]}')
        print()
        
except Exception as e:
    print(f'❌ Error: {e}')
"

echo "🔍 Testing subgraph health..."
curl -s -X POST "$ENDPOINT" \
-H "Content-Type: application/json" \
-d '{"query": "{ _meta { block { number timestamp } hasIndexingErrors } }"}' | python3 -c "
import json, sys, datetime
try:
    data = json.load(sys.stdin)
    meta = data.get('data', {}).get('_meta', {})
    block = meta.get('block', {})
    
    print(f'   Current Block: {block.get(\"number\", \"Unknown\")}')
    print(f'   Block Time: {datetime.datetime.fromtimestamp(int(block.get(\"timestamp\", 0))).strftime(\"%Y-%m-%d %H:%M:%S\")}')
    print(f'   Has Errors: {\"❌ Yes\" if meta.get(\"hasIndexingErrors\") else \"✅ No\"}')
except:
    print('   Could not get health info')
"
