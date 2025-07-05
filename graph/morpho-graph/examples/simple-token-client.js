// JavaScript version of the BetFi subgraph client with token data support
// Compatible with Node.js

// Known tokens (you can expand this list)
const KNOWN_TOKENS = {
  "0xa0b86a33e6c7c7b02c9b8c3cb5e2c0c2b5c8e8d7f": {
    address: "0xa0b86a33e6c7c7b02c9b8c3cb5e2c0c2b5c8e8d7f",
    name: "USD Coin",
    symbol: "USDC",
    decimals: 6
  },
  "0x1234567890123456789012345678901234567890": {
    address: "0x1234567890123456789012345678901234567890",
    name: "Tether USD",
    symbol: "USDT",
    decimals: 6
  }
  // Add more known tokens here
};

class BetFiSubgraphClientWithTokenData {
  constructor() {
    this.endpoint = 'https://api.studio.thegraph.com/query/115527/bet-fi/v0.0.2';
    this.tokenCache = new Map();
  }

  async query(query, variables = {}) {
    try {
      // Use node-fetch or global fetch
      const fetch = globalThis.fetch || require('node-fetch');
      
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          variables,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.errors) {
        throw new Error(`GraphQL errors: ${result.errors.map(e => e.message).join(', ')}`);
      }

      return result.data;
    } catch (error) {
      console.error('Query failed:', error);
      throw error;
    }
  }

  async fetchTokenData(tokenAddress) {
    // Check cache first
    const cacheKey = tokenAddress.toLowerCase();
    if (this.tokenCache.has(cacheKey)) {
      return this.tokenCache.get(cacheKey);
    }

    // Check known tokens
    const knownToken = KNOWN_TOKENS[cacheKey];
    if (knownToken) {
      this.tokenCache.set(cacheKey, knownToken);
      return knownToken;
    }

    // For demo purposes, return a placeholder
    // In real implementation, you'd call an external API
    try {
      const placeholderToken = {
        address: tokenAddress,
        name: `Token ${tokenAddress.slice(0, 6)}...`,
        symbol: `TKN${tokenAddress.slice(-4).toUpperCase()}`,
        decimals: 18
      };
      
      this.tokenCache.set(cacheKey, placeholderToken);
      return placeholderToken;
    } catch (error) {
      console.error(`Failed to fetch token data for ${tokenAddress}:`, error);
      return null;
    }
  }

  async getMetaMorphosWithTokenData(first = 10) {
    const query = `
      query GetMetaMorphos($first: Int!) {
        createMetaMorphos(
          first: $first
          orderBy: blockTimestamp
          orderDirection: desc
        ) {
          id
          metaMorpho
          caller
          initialOwner
          name
          symbol
          asset
          salt
          initialTimelock
          blockNumber
          blockTimestamp
          transactionHash
        }
      }
    `;

    const result = await this.query(query, { first });
    
    // Enrich with token data
    const enrichedMetaMorphos = await Promise.all(
      result.createMetaMorphos.map(async (metamorpho) => {
        const tokenData = await this.fetchTokenData(metamorpho.asset);
        return {
          ...metamorpho,
          tokenData
        };
      })
    );

    return enrichedMetaMorphos;
  }

  async searchByTokenSymbol(tokenSymbol) {
    // First get all MetaMorphos
    const allMetaMorphos = await this.getMetaMorphosWithTokenData(1000);
    
    // Filter by token symbol
    return allMetaMorphos.filter(metamorpho => 
      metamorpho.tokenData?.symbol.toLowerCase().includes(tokenSymbol.toLowerCase())
    );
  }

  async getMetaMorphosGroupedByToken() {
    const metaMorphos = await this.getMetaMorphosWithTokenData(1000);
    const grouped = {};

    metaMorphos.forEach(metamorpho => {
      const tokenSymbol = metamorpho.tokenData?.symbol || 'Unknown';
      if (!grouped[tokenSymbol]) {
        grouped[tokenSymbol] = [];
      }
      grouped[tokenSymbol].push(metamorpho);
    });

    return grouped;
  }

  async getTokenSummary() {
    const metaMorphos = await this.getMetaMorphosWithTokenData(1000);
    const tokenMap = {};

    metaMorphos.forEach(metamorpho => {
      if (metamorpho.tokenData) {
        const address = metamorpho.tokenData.address.toLowerCase();
        if (!tokenMap[address]) {
          tokenMap[address] = {
            token: metamorpho.tokenData,
            vaults: []
          };
        }
        tokenMap[address].vaults.push(metamorpho.name);
      }
    });

    return Object.values(tokenMap).map(({ token, vaults }) => ({
      token,
      vaultCount: vaults.length,
      vaults
    }));
  }

  // Additional utility methods
  async getVaultsByAsset(assetAddress) {
    const query = `
      query GetVaultsByAsset($asset: Bytes!) {
        createMetaMorphos(where: { asset: $asset }) {
          id
          name
          symbol
          metaMorpho
          caller
          initialTimelock
          blockTimestamp
          asset
        }
      }
    `;

    const result = await this.query(query, { asset: assetAddress });
    return result.createMetaMorphos;
  }

  async getVaultStats() {
    const query = `
      query GetVaultStats {
        createMetaMorphos(first: 1000) {
          id
          asset
          initialTimelock
          blockTimestamp
        }
      }
    `;

    const result = await this.query(query);
    const vaults = result.createMetaMorphos;

    // Calculate statistics
    const uniqueAssets = new Set(vaults.map(v => v.asset)).size;
    const avgTimelock = vaults.reduce((sum, v) => sum + parseInt(v.initialTimelock), 0) / vaults.length;
    const oldestVault = vaults.reduce((oldest, current) => 
      parseInt(current.blockTimestamp) < parseInt(oldest.blockTimestamp) ? current : oldest
    );

    return {
      totalVaults: vaults.length,
      uniqueAssets,
      averageTimelock: Math.round(avgTimelock),
      oldestVault: {
        name: oldestVault.name || oldestVault.id,
        createdAt: new Date(parseInt(oldestVault.blockTimestamp) * 1000).toLocaleDateString()
      }
    };
  }
}

// Example usage function
async function exampleUsage() {
  const client = new BetFiSubgraphClientWithTokenData();

  try {
    // Get MetaMorphos with token data
    console.log('📊 Getting MetaMorphos with token data...');
    const metaMorphosWithTokens = await client.getMetaMorphosWithTokenData(5);
    
    metaMorphosWithTokens.forEach(metamorpho => {
      console.log(`
Vault: ${metamorpho.name} (${metamorpho.symbol})
Token: ${metamorpho.tokenData?.name} (${metamorpho.tokenData?.symbol})
Address: ${metamorpho.metaMorpho}
Asset: ${metamorpho.asset}
Creator: ${metamorpho.caller}
Timelock: ${metamorpho.initialTimelock} seconds
      `);
    });

    // Get vault statistics
    console.log('📈 Vault statistics...');
    const stats = await client.getVaultStats();
    console.log(`
Total Vaults: ${stats.totalVaults}
Unique Assets: ${stats.uniqueAssets}
Average Timelock: ${stats.averageTimelock} seconds
Oldest Vault: ${stats.oldestVault.name} (created ${stats.oldestVault.createdAt})
    `);

  } catch (error) {
    console.error('Error:', error);
  }
}

// Query examples
const QUERY_EXAMPLES = {
  // Get all vaults with basic info
  getAllVaults: `
    query GetAllVaults($first: Int!) {
      createMetaMorphos(first: $first, orderBy: blockTimestamp, orderDirection: desc) {
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
  `,

  // Get vaults by specific creator
  getVaultsByCreator: `
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
  `,

  // Get recent vaults
  getRecentVaults: `
    query GetRecentVaults($timestamp: BigInt!) {
      createMetaMorphos(
        where: { blockTimestamp_gte: $timestamp }
        orderBy: blockTimestamp
        orderDirection: desc
      ) {
        id
        name
        symbol
        metaMorpho
        asset
        caller
        blockTimestamp
      }
    }
  `
};

module.exports = BetFiSubgraphClientWithTokenData;
