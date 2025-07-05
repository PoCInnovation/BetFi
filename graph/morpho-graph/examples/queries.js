// Best Practice Examples for BetFi MetaMorpho Subgraph
// Endpoint: https://api.studio.thegraph.com/query/115527/bet-fi/v0.0.1

// 1. Static Query with Variables (RECOMMENDED)
const getMetaMorphosByCallerQuery = `
  query GetMetaMorphosByCaller($caller: Bytes!, $first: Int!, $includeOwner: Boolean!) {
    createMetaMorphos(
      where: { caller: $caller }
      first: $first
      orderBy: blockTimestamp
      orderDirection: desc
    ) {
      id
      metaMorpho
      caller
      initialOwner @include(if: $includeOwner)
      name
      symbol
      asset
      initialTimelock
      blockTimestamp
      transactionHash
    }
  }
`;

// 2. Fragment-based Query for Reusability
const metaMorphoFragment = `
  fragment MetaMorphoDetails on CreateMetaMorpho {
    id
    metaMorpho
    caller
    name
    symbol
    asset
    blockTimestamp
  }
`;

const queryWithFragments = `
  ${metaMorphoFragment}
  
  query GetMetaMorphosWithFragments($first: Int!) {
    recent: createMetaMorphos(
      first: $first
      orderBy: blockTimestamp
      orderDirection: desc
    ) {
      ...MetaMorphoDetails
      initialTimelock
    }
    
    byAsset: createMetaMorphos(
      where: { asset: "0x..." }
      first: $first
    ) {
      ...MetaMorphoDetails
    }
  }
`;

// 3. Multiple Records in Single Query (Efficient)
const getMultipleMetaMorphosQuery = `
  query GetMultipleMetaMorphos($ids: [Bytes!]!) {
    createMetaMorphos(where: { id_in: $ids }) {
      id
      metaMorpho
      caller
      name
      symbol
      asset
      blockTimestamp
    }
  }
`;

// 4. Search and Filter Query
const searchMetaMorphosQuery = `
  query SearchMetaMorphos(
    $nameContains: String!
    $minTimelock: BigInt!
    $first: Int!
    $skip: Int!
  ) {
    createMetaMorphos(
      where: {
        and: [
          { name_contains: $nameContains }
          { initialTimelock_gte: $minTimelock }
        ]
      }
      first: $first
      skip: $skip
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
`;

// 5. Usage Examples with fetch
async function queryMetaMorphos() {
  const endpoint = 'https://api.studio.thegraph.com/query/115527/bet-fi/v0.0.1';
  
  try {
    // Example 1: Get MetaMorphos by specific caller
    const response1 = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: getMetaMorphosByCallerQuery,
        variables: {
          caller: "0x1234567890123456789012345678901234567890",
          first: 10,
          includeOwner: true
        }
      })
    });
    
    const data1 = await response1.json();
    console.log('MetaMorphos by caller:', data1.data.createMetaMorphos);
    
    // Example 2: Search MetaMorphos
    const response2 = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: searchMetaMorphosQuery,
        variables: {
          nameContains: "USDC",
          minTimelock: "3600", // 1 hour in seconds
          first: 5,
          skip: 0
        }
      })
    });
    
    const data2 = await response2.json();
    console.log('Search results:', data2.data.createMetaMorphos);
    
  } catch (error) {
    console.error('Query failed:', error);
  }
}

// Export for use in applications
module.exports = {
  getMetaMorphosByCallerQuery,
  queryWithFragments,
  getMultipleMetaMorphosQuery,
  searchMetaMorphosQuery,
  queryMetaMorphos
};
