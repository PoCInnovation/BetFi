# BetFi MetaMorpho Subgraph - Query Examples & Best Practices

## 🎯 Your Live Subgraph
- **Endpoint**: `https://api.studio.thegraph.com/query/115527/bet-fi/v0.0.2`
- **Network**: Katana
- **Contract**: `0x1c8De6889acee12257899BFeAa2b7e534de32E16`
- **Studio URL**: https://thegraph.com/studio/subgraph/bet-fi

## 📋 Quick Test Query

```graphql
{
  createMetaMorphos(first: 5, orderBy: blockTimestamp, orderDirection: desc) {
    id
    metaMorpho
    caller
    name
    symbol
    asset
    blockTimestamp
  }
}
```

## 🚀 Query Examples

### 1. Basic Query - All MetaMorphos
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  --data '{
    "query": "{
      createMetaMorphos(first: 10, orderBy: blockTimestamp, orderDirection: desc) {
        id
        metaMorpho
        caller
        name
        symbol
        asset
        blockTimestamp
      }
    }"
  }' \
  https://api.studio.thegraph.com/query/115527/bet-fi/v0.0.2
```

### 2. Filter by Caller Address
```graphql
query GetMetaMorphosByCaller($caller: Bytes!) {
  createMetaMorphos(
    where: { caller: $caller }
    orderBy: blockTimestamp
    orderDirection: desc
  ) {
    id
    metaMorpho
    caller
    name
    symbol
    asset
    initialTimelock
    blockTimestamp
  }
}
```

### 3. Search by Name/Symbol
```graphql
query SearchMetaMorphos($searchTerm: String!) {
  createMetaMorphos(
    where: {
      or: [
        { name_contains: $searchTerm }
        { symbol_contains: $searchTerm }
      ]
    }
  ) {
    id
    metaMorpho
    name
    symbol
    asset
    caller
  }
}
```

### 4. Filter by Asset
```graphql
query GetMetaMorphosByAsset($asset: Bytes!) {
  createMetaMorphos(where: { asset: $asset }) {
    id
    metaMorpho
    caller
    name
    symbol
    initialTimelock
    blockTimestamp
  }
}
```

### 5. Get Recent Creations
```graphql
query GetRecentMetaMorphos($afterTimestamp: BigInt!) {
  createMetaMorphos(
    where: { blockTimestamp_gt: $afterTimestamp }
    orderBy: blockTimestamp
    orderDirection: desc
  ) {
    id
    metaMorpho
    caller
    name
    symbol
    blockTimestamp
  }
}
```

## 🎨 Available Fields

Your `CreateMetaMorpho` entity includes these fields:

```graphql
type CreateMetaMorpho {
  id: Bytes!              # Unique ID (tx hash + log index)
  metaMorpho: Bytes!      # Created MetaMorpho contract address
  caller: Bytes!          # Address that called the factory
  initialOwner: Bytes!    # Initial owner of the MetaMorpho
  initialTimelock: BigInt! # Initial timelock period
  asset: Bytes!           # Asset address for the MetaMorpho
  name: String!           # Name of the MetaMorpho
  symbol: String!         # Symbol of the MetaMorpho
  salt: Bytes!            # Salt used for contract creation
  blockNumber: BigInt!    # Block number of the event
  blockTimestamp: BigInt! # Timestamp of the block
  transactionHash: Bytes! # Transaction hash
}
```

## 💡 Best Practices Applied

### ✅ Static Queries with Variables
```javascript
// GOOD - Static query with variables
const query = `
  query GetMetaMorphos($caller: Bytes!, $first: Int!) {
    createMetaMorphos(where: { caller: $caller }, first: $first) {
      id
      name
      symbol
    }
  }
`;
```

### ✅ GraphQL Fragments for Reusability
```graphql
fragment MetaMorphoDetails on CreateMetaMorpho {
  id
  metaMorpho
  caller
  name
  symbol
  asset
  blockTimestamp
}

query GetMetaMorphoData {
  recent: createMetaMorphos(first: 5) {
    ...MetaMorphoDetails
  }
  byAsset: createMetaMorphos(where: { asset: "0x..." }) {
    ...MetaMorphoDetails
  }
}
```

### ✅ Efficient Multiple Records Query
```graphql
# GOOD - Single query for multiple records
query GetMultipleMetaMorphos($ids: [Bytes!]!) {
  createMetaMorphos(where: { id_in: $ids }) {
    id
    name
    symbol
  }
}
```

### ✅ Conditional Fields with Directives
```graphql
query GetMetaMorphos($includeOwner: Boolean!) {
  createMetaMorphos(first: 10) {
    id
    metaMorpho
    name
    symbol
    initialOwner @include(if: $includeOwner)
    salt @include(if: $includeOwner)
  }
}
```

## 🧪 Testing Your Queries

1. **Graph Explorer**: Visit your [subgraph's studio page](https://thegraph.com/studio/subgraph/bet-fi)
2. **Local Testing**: Use the provided examples in `examples/client.ts`
3. **Unit Tests**: Run `npm run test` to test mapping logic

## 🔧 Integration Examples

See the following files for complete integration examples:
- `examples/queries.js` - Basic JavaScript examples
- `examples/client.ts` - TypeScript client with proper typing
- `examples/react-hooks.tsx` - React hooks for frontend integration

## 📊 Query Performance Tips

1. **Limit Results**: Always use `first` parameter to limit results
2. **Use Pagination**: Implement `skip` for pagination
3. **Order Results**: Use `orderBy` and `orderDirection` for consistent ordering
4. **Filter Early**: Use `where` clauses to reduce data transfer
5. **Select Only Needed Fields**: Don't query fields you don't need

## 🚀 Next Steps

1. **Deploy Updates**: When you modify your contract, update `startBlock` and redeploy
2. **Add More Events**: If your contract emits other events, add them to the subgraph
3. **Index More Data**: Consider indexing additional contract calls or derived data
4. **Monitor Performance**: Use The Graph Studio analytics to monitor query performance

---

Your subgraph is now live and ready to serve MetaMorpho factory data from the Katana network! 🎉
