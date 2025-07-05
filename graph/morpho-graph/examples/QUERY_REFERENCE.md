# MetaMorpho Subgraph Query Reference

## 🏗️ Available Entities

### 1. CreateMetaMorpho Entity
The main entity that tracks MetaMorpho vault creation events.

```graphql
type CreateMetaMorpho {
  id: Bytes!              # Unique ID (tx hash + log index)
  metaMorpho: Bytes!      # Created MetaMorpho vault contract address
  caller: Bytes!          # Address that called the factory
  initialOwner: Bytes!    # Initial owner of the MetaMorpho vault
  initialTimelock: BigInt! # Initial timelock period in seconds
  asset: Bytes!           # Underlying asset address (ERC20 token)
  assetToken: Token       # Relationship to Token entity
  name: String!           # Name of the MetaMorpho vault
  symbol: String!         # Symbol of the MetaMorpho vault
  salt: Bytes!            # Salt used for CREATE2 deployment
  blockNumber: BigInt!    # Block number when vault was created
  blockTimestamp: BigInt! # Timestamp when vault was created
  transactionHash: Bytes! # Transaction hash of creation
}
```

### 2. Token Entity
Information about the underlying ERC20 tokens used in MetaMorpho vaults.

```graphql
type Token {
  id: Bytes!                           # Token contract address
  symbol: String!                      # Token symbol (e.g., "USDC", "WETH")
  name: String!                        # Token name (e.g., "USD Coin")
  decimals: BigInt!                    # Token decimals (e.g., 6, 18)
  totalSupply: BigInt                  # Total supply of the token
  metaMorphos: [CreateMetaMorpho!]!    # All MetaMorpho vaults using this token
}
```

## 🔍 Query Examples

### Basic Queries

#### 1. Get All MetaMorpho Vaults
```graphql
query GetAllVaults {
  createMetaMorphos(first: 20, orderBy: blockTimestamp, orderDirection: desc) {
    id
    name
    symbol
    metaMorpho
    asset
    caller
    initialOwner
    initialTimelock
    blockTimestamp
  }
}
```

#### 2. Get Vault Details with Token Information
```graphql
query GetVaultsWithTokens {
  createMetaMorphos(first: 10) {
    id
    name
    symbol
    metaMorpho
    asset
    caller
    initialTimelock
    assetToken {
      id
      name
      symbol
      decimals
      totalSupply
    }
    blockTimestamp
  }
}
```

### Filtering Queries

#### 3. Filter by Creator Address
```graphql
query GetVaultsByCreator($creator: Bytes!) {
  createMetaMorphos(where: { caller: $creator }) {
    id
    name
    symbol
    metaMorpho
    asset
    initialTimelock
    blockTimestamp
  }
}
```

#### 4. Filter by Asset Token
```graphql
query GetVaultsByAsset($assetAddress: Bytes!) {
  createMetaMorphos(where: { asset: $assetAddress }) {
    id
    name
    symbol
    metaMorpho
    caller
    initialTimelock
    assetToken {
      name
      symbol
      decimals
    }
  }
}
```

#### 5. Filter by Timelock Period
```graphql
query GetVaultsByTimelock($minTimelock: BigInt!) {
  createMetaMorphos(where: { initialTimelock_gte: $minTimelock }) {
    id
    name
    symbol
    initialTimelock
    metaMorpho
    caller
  }
}
```

#### 6. Search by Name/Symbol
```graphql
query SearchVaults($searchTerm: String!) {
  createMetaMorphos(
    where: {
      or: [
        { name_contains_nocase: $searchTerm }
        { symbol_contains_nocase: $searchTerm }
      ]
    }
  ) {
    id
    name
    symbol
    metaMorpho
    asset
  }
}
```

### Time-based Queries

#### 7. Get Recent Vaults
```graphql
query GetRecentVaults($afterTimestamp: BigInt!) {
  createMetaMorphos(
    where: { blockTimestamp_gte: $afterTimestamp }
    orderBy: blockTimestamp
    orderDirection: desc
  ) {
    id
    name
    symbol
    metaMorpho
    blockTimestamp
  }
}
```

#### 8. Get Vaults in Block Range
```graphql
query GetVaultsInBlockRange($startBlock: BigInt!, $endBlock: BigInt!) {
  createMetaMorphos(
    where: { 
      blockNumber_gte: $startBlock
      blockNumber_lte: $endBlock 
    }
  ) {
    id
    name
    symbol
    metaMorpho
    blockNumber
    blockTimestamp
  }
}
```

### Token-focused Queries

#### 9. Get All Tokens Used in MetaMorpho
```graphql
query GetAllTokens {
  tokens(first: 50) {
    id
    name
    symbol
    decimals
    totalSupply
    metaMorphos {
      id
      name
      symbol
      metaMorpho
    }
  }
}
```

#### 10. Get Token with All Its Vaults
```graphql
query GetTokenWithVaults($tokenAddress: Bytes!) {
  token(id: $tokenAddress) {
    id
    name
    symbol
    decimals
    totalSupply
    metaMorphos(orderBy: blockTimestamp, orderDirection: desc) {
      id
      name
      symbol
      metaMorpho
      caller
      initialTimelock
      blockTimestamp
    }
  }
}
```

### Aggregation Queries

#### 11. Count Vaults by Creator
```graphql
query GetCreatorStats {
  createMetaMorphos(first: 1000) {
    caller
    blockTimestamp
  }
}
```

#### 12. Get Unique Assets
```graphql
query GetUniqueAssets {
  tokens {
    id
    name
    symbol
    metaMorphos {
      id
    }
  }
}
```

### Advanced Filtering

#### 13. Complex Multi-filter Query
```graphql
query GetFilteredVaults(
  $minTimelock: BigInt!
  $afterTimestamp: BigInt!
  $creator: Bytes!
) {
  createMetaMorphos(
    where: {
      initialTimelock_gte: $minTimelock
      blockTimestamp_gte: $afterTimestamp
      caller: $creator
    }
    orderBy: blockTimestamp
    orderDirection: desc
  ) {
    id
    name
    symbol
    metaMorpho
    caller
    initialTimelock
    asset
    assetToken {
      name
      symbol
    }
    blockTimestamp
  }
}
```

#### 14. Pagination Example
```graphql
query GetVaultsPaginated($first: Int!, $skip: Int!) {
  createMetaMorphos(
    first: $first
    skip: $skip
    orderBy: blockTimestamp
    orderDirection: desc
  ) {
    id
    name
    symbol
    metaMorpho
    blockTimestamp
  }
}
```

## 🎯 What You Can Analyze

### Vault Analytics
- **Creation trends**: When vaults are created over time
- **Popular assets**: Which tokens are most used for vaults
- **Creator activity**: Who's creating the most vaults
- **Timelock patterns**: Distribution of timelock periods
- **Naming conventions**: How vaults are named and symbolized

### Token Analytics
- **Token adoption**: Which tokens are preferred for MetaMorpho vaults
- **Vault diversity**: How many vaults exist per token
- **Token metadata**: Names, symbols, decimals for all assets

### Network Analytics
- **Transaction patterns**: Block numbers and timestamps
- **Creator behavior**: Address patterns and creation frequency
- **Asset preferences**: Which assets are chosen most often

## 🚀 JavaScript Query Examples

```javascript
// Example using fetch
const endpoint = 'https://api.studio.thegraph.com/query/115527/bet-fi/v0.0.3';

async function querySubgraph(query, variables = {}) {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
  });
  
  const result = await response.json();
  
  if (result.errors) {
    throw new Error(result.errors.map(e => e.message).join(', '));
  }
  
  return result.data;
}

// Get vault creation stats
const statsQuery = `
  query GetVaultStats {
    createMetaMorphos(first: 1000) {
      id
      caller
      asset
      initialTimelock
      blockTimestamp
    }
    tokens {
      id
      symbol
      metaMorphos {
        id
      }
    }
  }
`;

// Process the data
const result = await querySubgraph(statsQuery);
const vaults = result.createMetaMorphos;
const tokens = result.tokens;

// Analyze creators
const creatorCounts = {};
vaults.forEach(vault => {
  creatorCounts[vault.caller] = (creatorCounts[vault.caller] || 0) + 1;
});

// Analyze popular assets
const assetCounts = {};
vaults.forEach(vault => {
  assetCounts[vault.asset] = (assetCounts[vault.asset] || 0) + 1;
});

// Average timelock
const avgTimelock = vaults.reduce((sum, v) => sum + parseInt(v.initialTimelock), 0) / vaults.length;
```

## 📡 Curl Examples

```bash
# Test basic connectivity
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"query": "{ createMetaMorphos(first: 5) { id metaMorpho caller } }"}' \
  https://api.studio.thegraph.com/query/115527/bet-fi/v0.0.3

# Get vault and token data
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "query": "{ 
      tokens(first: 5) { 
        id 
        symbol 
        name 
        decimals 
      } 
      createMetaMorphos(first: 5) { 
        id 
        metaMorpho 
        caller 
        initialOwner 
        name
        symbol
      } 
    }"
  }' \
  https://api.studio.thegraph.com/query/115527/bet-fi/v0.0.3

# Query with variables
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query GetVaultsByCreator($creator: Bytes!) { createMetaMorphos(where: { caller: $creator }) { id name symbol metaMorpho } }",
    "variables": { "creator": "0x1234567890123456789012345678901234567890" }
  }' \
  https://api.studio.thegraph.com/query/115527/bet-fi/v0.0.3
```

This comprehensive query reference shows everything you can extract from your MetaMorpho subgraph! 🎉
