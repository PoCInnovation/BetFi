// Simple Token Data Integration for Current BetFi Subgraph
// This works with your existing subgraph without schema changes

export interface CreateMetaMorpho {
  id: string;
  metaMorpho: string;
  caller: string;
  initialOwner: string;
  initialTimelock: string;
  asset: string;
  name: string;
  symbol: string;
  salt: string;
  blockNumber: string;
  blockTimestamp: string;
  transactionHash: string;
}

export interface TokenData {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  totalSupply?: string;
}

// External token data sources (you can replace with your preferred source)
const KNOWN_TOKENS: { [address: string]: TokenData } = {
  // Add known token addresses and their data
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

export class BetFiSubgraphClientWithTokenData {
  private endpoint = 'https://api.studio.thegraph.com/query/115527/bet-fi/v0.0.2';
  private tokenCache: Map<string, TokenData> = new Map();

  async query<T>(query: string, variables?: Record<string, any>): Promise<T> {
    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          variables: variables || {},
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.errors) {
        throw new Error(`GraphQL errors: ${result.errors.map((e: any) => e.message).join(', ')}`);
      }

      return result.data;
    } catch (error) {
      console.error('Query failed:', error);
      throw error;
    }
  }

  // Fetch token data from external source (you can replace this with your preferred API)
  async fetchTokenData(tokenAddress: string): Promise<TokenData | null> {
    // Check cache first
    if (this.tokenCache.has(tokenAddress.toLowerCase())) {
      return this.tokenCache.get(tokenAddress.toLowerCase()) || null;
    }

    // Check known tokens
    const knownToken = KNOWN_TOKENS[tokenAddress.toLowerCase()];
    if (knownToken) {
      this.tokenCache.set(tokenAddress.toLowerCase(), knownToken);
      return knownToken;
    }

    // For demo purposes, return a placeholder
    // In real implementation, you'd call an external API like:
    // - CoinGecko API
    // - 1inch Token API
    // - Your own token registry
    // - Direct contract calls
    
    try {
      // Placeholder for external API call
      const placeholderToken: TokenData = {
        address: tokenAddress,
        name: `Token ${tokenAddress.slice(0, 6)}...`,
        symbol: `TKN${tokenAddress.slice(-4)}`,
        decimals: 18
      };
      
      this.tokenCache.set(tokenAddress.toLowerCase(), placeholderToken);
      return placeholderToken;
    } catch (error) {
      console.error(`Failed to fetch token data for ${tokenAddress}:`, error);
      return null;
    }
  }

  // Get MetaMorphos with enriched token data
  async getMetaMorphosWithTokenData(first: number = 10): Promise<Array<CreateMetaMorpho & { tokenData?: TokenData }>> {
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
          initialTimelock
          blockTimestamp
          transactionHash
        }
      }
    `;

    const result = await this.query<{ createMetaMorphos: CreateMetaMorpho[] }>(query, { first });
    
    // Enrich with token data
    const enrichedMetaMorphos = await Promise.all(
      result.createMetaMorphos.map(async (metamorpho) => {
        const tokenData = await this.fetchTokenData(metamorpho.asset);
        return {
          ...metamorpho,
          tokenData: tokenData || undefined
        };
      })
    );

    return enrichedMetaMorphos;
  }

  // Search MetaMorphos by token symbol
  async searchByTokenSymbol(tokenSymbol: string): Promise<Array<CreateMetaMorpho & { tokenData?: TokenData }>> {
    // First get all MetaMorphos
    const allMetaMorphos = await this.getMetaMorphosWithTokenData(1000);
    
    // Filter by token symbol
    return allMetaMorphos.filter(metamorpho => 
      metamorpho.tokenData?.symbol.toLowerCase().includes(tokenSymbol.toLowerCase())
    );
  }

  // Group MetaMorphos by token
  async getMetaMorphosGroupedByToken(): Promise<{ [tokenSymbol: string]: Array<CreateMetaMorpho & { tokenData?: TokenData }> }> {
    const metaMorphos = await this.getMetaMorphosWithTokenData(1000);
    const grouped: { [tokenSymbol: string]: Array<CreateMetaMorpho & { tokenData?: TokenData }> } = {};

    metaMorphos.forEach(metamorpho => {
      const tokenSymbol = metamorpho.tokenData?.symbol || 'Unknown';
      if (!grouped[tokenSymbol]) {
        grouped[tokenSymbol] = [];
      }
      grouped[tokenSymbol].push(metamorpho);
    });

    return grouped;
  }

  // Get token summary
  async getTokenSummary(): Promise<Array<{ token: TokenData; vaultCount: number; vaults: string[] }>> {
    const metaMorphos = await this.getMetaMorphosWithTokenData(1000);
    const tokenMap: { [address: string]: { token: TokenData; vaults: string[] } } = {};

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
}

// Example usage
export async function exampleUsageWithExternalTokenData() {
  const client = new BetFiSubgraphClientWithTokenData();

  try {
    // Get MetaMorphos with token data
    console.log('📊 Getting MetaMorphos with token data...');
    const metaMorphosWithTokens = await client.getMetaMorphosWithTokenData(10);
    
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

    // Search for USDC vaults
    console.log('🔍 Searching for USDC vaults...');
    const usdcVaults = await client.searchByTokenSymbol('USDC');
    console.log(`Found ${usdcVaults.length} USDC vaults`);

    // Get token summary
    console.log('📈 Token summary...');
    const tokenSummary = await client.getTokenSummary();
    tokenSummary.forEach(({ token, vaultCount, vaults }) => {
      console.log(`${token.symbol} (${token.name}): ${vaultCount} vaults`);
      console.log(`  Vaults: ${vaults.slice(0, 3).join(', ')}${vaults.length > 3 ? '...' : ''}`);
    });

  } catch (error) {
    console.error('Error:', error);
  }
}

// Query examples that include asset information
export const QUERIES_WITH_ASSET_FOCUS = {
  // Get vaults grouped by asset
  getVaultsByAsset: `
    query GetVaultsByAsset {
      createMetaMorphos(orderBy: asset) {
        id
        name
        symbol
        asset
        metaMorpho
        caller
        blockTimestamp
      }
    }
  `,

  // Get vaults for specific asset
  getVaultsForAsset: `
    query GetVaultsForAsset($asset: Bytes!) {
      createMetaMorphos(where: { asset: $asset }) {
        id
        name
        symbol
        metaMorpho
        caller
        initialTimelock
        blockTimestamp
      }
    }
  `,

  // Get unique assets used
  getUniqueAssets: `
    query GetUniqueAssets {
      createMetaMorphos(first: 1000) {
        asset
      }
    }
  `
};

export default BetFiSubgraphClientWithTokenData;
