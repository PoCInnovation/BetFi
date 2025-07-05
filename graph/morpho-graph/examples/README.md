# BetFi Subgraph Examples

This directory contains practical examples of how to interact with the BetFi MetaMorpho subgraph, including token data integration.

## 📁 Files Overview

### Core Examples
- **`simple-token-client.ts`** - TypeScript client with external token data integration
- **`simple-token-client.js`** - JavaScript version for Node.js
- **`demo.js`** - Interactive demonstration script
- **`react-dashboard.tsx`** - Complete React dashboard (requires React setup)

### Query Examples
- **`queries.js`** - Static GraphQL query examples
- **`client.ts`** - Basic TypeScript client
- **`client-with-tokens.ts`** - Advanced client with token relationships
- **`react-hooks.tsx`** - React hooks for subgraph integration

## 🚀 Quick Start

### 1. Basic Demo (Node.js)

Run the interactive demo to see your subgraph data:

```bash
# Install node-fetch if needed (for Node.js < 18)
npm install node-fetch

# Run the demo
node examples/demo.js
```

This will show:
- All MetaMorpho vaults with token information
- Search functionality
- Token summaries
- Grouped data by token type

### 2. Using the JavaScript Client

```javascript
const BetFiClient = require('./examples/simple-token-client.js');

async function main() {
  const client = new BetFiClient();
  
  // Get vaults with token data
  const vaults = await client.getMetaMorphosWithTokenData(10);
  console.log('Vaults:', vaults);
  
  // Search for USDC vaults
  const usdcVaults = await client.searchByTokenSymbol('USDC');
  console.log('USDC Vaults:', usdcVaults);
  
  // Get token summary
  const summary = await client.getTokenSummary();
  console.log('Token Summary:', summary);
}

main();
```

### 3. TypeScript Client

```typescript
import BetFiClient from './examples/simple-token-client';

const client = new BetFiClient();

// Get vaults with type safety
const vaults: Array<CreateMetaMorpho & { tokenData?: TokenData }> = 
  await client.getMetaMorphosWithTokenData(10);
```

## 📊 Available Methods

### BetFiSubgraphClientWithTokenData

#### Core Methods
- `getMetaMorphosWithTokenData(first?: number)` - Get vaults with enriched token data
- `searchByTokenSymbol(tokenSymbol: string)` - Search vaults by token symbol
- `getMetaMorphosGroupedByToken()` - Group vaults by their underlying token
- `getTokenSummary()` - Get summary of all tokens and their vault counts

#### Utility Methods
- `getVaultsByAsset(assetAddress: string)` - Get vaults for specific asset
- `getVaultStats()` - Get overall vault statistics
- `fetchTokenData(tokenAddress: string)` - Get token metadata

## 🔍 Query Examples

### Basic Vault Query
```graphql
query GetVaults($first: Int!) {
  createMetaMorphos(
    first: $first
    orderBy: blockTimestamp
    orderDirection: desc
  ) {
    id
    name
    symbol
    metaMorpho
    asset
    caller
    initialTimelock
    blockTimestamp
  }
}
```

### Filter by Asset
```graphql
query GetVaultsByAsset($asset: Bytes!) {
  createMetaMorphos(where: { asset: $asset }) {
    id
    name
    symbol
    metaMorpho
    caller
    initialTimelock
  }
}
```

### Recent Vaults
```graphql
query GetRecentVaults($timestamp: BigInt!) {
  createMetaMorphos(
    where: { blockTimestamp_gte: $timestamp }
    orderBy: blockTimestamp
    orderDirection: desc
  ) {
    id
    name
    symbol
    asset
    blockTimestamp
  }
}
```

## 🎯 Token Data Integration

The examples include token data integration in two ways:

### 1. External Token Data (Current Approach)
- Uses known token mappings
- Fetches data from external APIs (placeholder in examples)
- Works with current subgraph schema

### 2. Enhanced Subgraph (Future)
- Includes token entities in the subgraph schema
- Direct GraphQL queries for token data
- More efficient and reliable

## 🔧 Customization

### Adding Known Tokens
Edit the `KNOWN_TOKENS` object in the client files:

```javascript
const KNOWN_TOKENS = {
  "0xYourTokenAddress": {
    address: "0xYourTokenAddress",
    name: "Your Token Name",
    symbol: "YTN",
    decimals: 18
  }
};
```

### External Token API Integration
Replace the `fetchTokenData` method to use your preferred token data source:

```javascript
async fetchTokenData(tokenAddress) {
  // Example: CoinGecko API
  const response = await fetch(`https://api.coingecko.com/api/v3/coins/ethereum/contract/${tokenAddress}`);
  const data = await response.json();
  
  return {
    address: tokenAddress,
    name: data.name,
    symbol: data.symbol,
    decimals: data.detail_platforms.ethereum.decimal_place
  };
}
```

### Custom Queries
Add your own query methods:

```javascript
async getVaultsByTimelock(minTimelock) {
  const query = `
    query GetVaultsByTimelock($minTimelock: BigInt!) {
      createMetaMorphos(where: { initialTimelock_gte: $minTimelock }) {
        id
        name
        symbol
        initialTimelock
      }
    }
  `;
  
  return await this.query(query, { minTimelock });
}
```

## 🚀 React Integration

For React applications, use the provided hooks and components:

```tsx
import { useBetFiVaults } from './examples/react-hooks';

function VaultList() {
  const { vaults, loading, error } = useBetFiVaults();
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      {vaults.map(vault => (
        <div key={vault.id}>
          <h3>{vault.name}</h3>
          <p>Token: {vault.tokenData?.symbol}</p>
        </div>
      ))}
    </div>
  );
}
```

## 📈 Performance Tips

1. **Caching**: Token data is cached to avoid repeated API calls
2. **Pagination**: Use `first` parameter to limit query size
3. **Filtering**: Apply filters server-side when possible
4. **Batching**: Group multiple queries when needed

## 🛠️ Troubleshooting

### Common Issues

1. **Subgraph not accessible**
   - Check the endpoint URL
   - Verify subgraph is deployed
   - Check network connectivity

2. **No data returned**
   - Ensure events have been indexed
   - Check the start block in subgraph.yaml
   - Verify contract address is correct

3. **Token data missing**
   - Add tokens to KNOWN_TOKENS
   - Implement external API integration
   - Check token contract addresses

### Debug Mode
Add debug logging:

```javascript
const client = new BetFiClient();
client.debug = true; // Enable debug mode
```

## 🔗 Useful Links

- [BetFi Subgraph Endpoint](https://api.studio.thegraph.com/query/115527/bet-fi/v0.0.1)
- [The Graph Documentation](https://thegraph.com/docs/)
- [GraphQL Query Language](https://graphql.org/learn/queries/)
- [MetaMorpho Documentation](https://docs.morpho.org/)

## 📝 License

MIT License - see LICENSE file for details.
