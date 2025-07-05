// Enhanced TypeScript Client with Token Data for BetFi MetaMorpho Subgraph
// Endpoint: https://api.studio.thegraph.com/query/115527/bet-fi/v0.0.1

// Enhanced type definitions including token data
export interface Token {
  id: string;
  symbol: string;
  name: string;
  decimals: string;
  totalSupply?: string;
}

export interface CreateMetaMorphoWithToken {
  id: string;
  metaMorpho: string;
  caller: string;
  initialOwner: string;
  initialTimelock: string;
  asset: string;
  assetToken?: Token; // Optional token data
  name: string;
  symbol: string;
  salt: string;
  blockNumber: string;
  blockTimestamp: string;
  transactionHash: string;
}

export interface QueryResponse<T> {
  data: T;
  errors?: Array<{ message: string }>;
}

export interface MetaMorphoWithTokenQueryResult {
  createMetaMorphos: CreateMetaMorphoWithToken[];
}

export interface TokenQueryResult {
  tokens: Token[];
}

// Enhanced client with token data support
export class BetFiSubgraphClientWithTokens {
  private endpoint = 'https://api.studio.thegraph.com/query/115527/bet-fi/v0.0.1';

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

      const result: QueryResponse<T> = await response.json();

      if (result.errors) {
        throw new Error(`GraphQL errors: ${result.errors.map(e => e.message).join(', ')}`);
      }

      return result.data;
    } catch (error) {
      console.error('Query failed:', error);
      throw error;
    }
  }

  // Get all MetaMorphos with token data
  async getAllMetaMorphosWithTokens(first: number = 100, skip: number = 0): Promise<CreateMetaMorphoWithToken[]> {
    const query = `
      query GetAllMetaMorphosWithTokens($first: Int!, $skip: Int!) {
        createMetaMorphos(
          first: $first
          skip: $skip
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
          assetToken {
            id
            name
            symbol
            decimals
            totalSupply
          }
          initialTimelock
          blockTimestamp
          transactionHash
        }
      }
    `;

    const result = await this.query<MetaMorphoWithTokenQueryResult>(query, { first, skip });
    return result.createMetaMorphos;
  }

  // Get MetaMorphos by specific caller with token data
  async getMetaMorphosByCallerWithTokens(caller: string, first: number = 10): Promise<CreateMetaMorphoWithToken[]> {
    const query = `
      query GetMetaMorphosByCallerWithTokens($caller: Bytes!, $first: Int!) {
        createMetaMorphos(
          where: { caller: $caller }
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
          assetToken {
            id
            name
            symbol
            decimals
            totalSupply
          }
          initialTimelock
          blockTimestamp
          transactionHash
        }
      }
    `;

    const result = await this.query<MetaMorphoWithTokenQueryResult>(query, { caller, first });
    return result.createMetaMorphos;
  }

  // Get MetaMorphos by token symbol
  async getMetaMorphosByTokenSymbol(tokenSymbol: string): Promise<CreateMetaMorphoWithToken[]> {
    const query = `
      query GetMetaMorphosByTokenSymbol($tokenSymbol: String!) {
        createMetaMorphos(
          where: { 
            assetToken_: { symbol_contains: $tokenSymbol }
          }
          orderBy: blockTimestamp
          orderDirection: desc
        ) {
          id
          metaMorpho
          caller
          name
          symbol
          asset
          assetToken {
            id
            name
            symbol
            decimals
            totalSupply
          }
          initialTimelock
          blockTimestamp
        }
      }
    `;

    const result = await this.query<MetaMorphoWithTokenQueryResult>(query, { tokenSymbol });
    return result.createMetaMorphos;
  }

  // Get all tokens used in MetaMorphos
  async getAllTokens(): Promise<Token[]> {
    const query = `
      query GetAllTokens {
        tokens(orderBy: symbol) {
          id
          name
          symbol
          decimals
          totalSupply
          metaMorphos {
            id
            name
            symbol
          }
        }
      }
    `;

    const result = await this.query<TokenQueryResult>(query);
    return result.tokens;
  }

  // Get MetaMorphos for a specific token
  async getMetaMorphosForToken(tokenAddress: string): Promise<CreateMetaMorphoWithToken[]> {
    const query = `
      query GetMetaMorphosForToken($tokenAddress: Bytes!) {
        createMetaMorphos(
          where: { asset: $tokenAddress }
          orderBy: blockTimestamp
          orderDirection: desc
        ) {
          id
          metaMorpho
          caller
          name
          symbol
          asset
          assetToken {
            id
            name
            symbol
            decimals
            totalSupply
          }
          initialTimelock
          blockTimestamp
        }
      }
    `;

    const result = await this.query<MetaMorphoWithTokenQueryResult>(query, { tokenAddress });
    return result.createMetaMorphos;
  }

  // Search MetaMorphos by vault name/symbol OR token name/symbol
  async searchMetaMorphosAndTokens(searchTerm: string): Promise<CreateMetaMorphoWithToken[]> {
    const query = `
      query SearchMetaMorphosAndTokens($searchTerm: String!) {
        createMetaMorphos(
          where: {
            or: [
              { name_contains: $searchTerm }
              { symbol_contains: $searchTerm }
              { assetToken_: { name_contains: $searchTerm } }
              { assetToken_: { symbol_contains: $searchTerm } }
            ]
          }
          orderBy: blockTimestamp
          orderDirection: desc
        ) {
          id
          metaMorpho
          caller
          name
          symbol
          asset
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
    `;

    const result = await this.query<MetaMorphoWithTokenQueryResult>(query, { searchTerm });
    return result.createMetaMorphos;
  }

  // Get MetaMorphos grouped by token
  async getMetaMorphosGroupedByToken(): Promise<{[tokenSymbol: string]: CreateMetaMorphoWithToken[]}> {
    const metaMorphos = await this.getAllMetaMorphosWithTokens(1000);
    
    const grouped: {[tokenSymbol: string]: CreateMetaMorphoWithToken[]} = {};
    
    metaMorphos.forEach(metamorpho => {
      const tokenSymbol = metamorpho.assetToken?.symbol || 'Unknown';
      if (!grouped[tokenSymbol]) {
        grouped[tokenSymbol] = [];
      }
      grouped[tokenSymbol].push(metamorpho);
    });
    
    return grouped;
  }

  // Get token statistics
  async getTokenStatistics(tokenAddress: string): Promise<{
    token: Token;
    metaMorphoCount: number;
    totalValueLocked?: string;
    metaMorphos: CreateMetaMorphoWithToken[];
  } | null> {
    const metaMorphos = await this.getMetaMorphosForToken(tokenAddress);
    
    if (metaMorphos.length === 0) return null;
    
    const token = metaMorphos[0].assetToken;
    if (!token) return null;
    
    return {
      token,
      metaMorphoCount: metaMorphos.length,
      metaMorphos
    };
  }
}

// Usage examples with token data
export async function exampleUsageWithTokens() {
  const client = new BetFiSubgraphClientWithTokens();

  try {
    // Get all MetaMorphos with their token data
    console.log('📊 Getting MetaMorphos with token data...');
    const metaMorphosWithTokens = await client.getAllMetaMorphosWithTokens(10);
    console.log('MetaMorphos with token data:', metaMorphosWithTokens.map(m => ({
      vaultName: m.name,
      vaultSymbol: m.symbol,
      tokenName: m.assetToken?.name,
      tokenSymbol: m.assetToken?.symbol,
      tokenDecimals: m.assetToken?.decimals
    })));

    // Search for USDC-related MetaMorphos
    console.log('🔍 Searching for USDC MetaMorphos...');
    const usdcMetaMorphos = await client.searchMetaMorphosAndTokens('USDC');
    console.log('USDC-related MetaMorphos:', usdcMetaMorphos);

    // Get MetaMorphos grouped by token
    console.log('📈 Getting MetaMorphos grouped by token...');
    const groupedByToken = await client.getMetaMorphosGroupedByToken();
    Object.entries(groupedByToken).forEach(([tokenSymbol, metaMorphos]) => {
      console.log(`${tokenSymbol}: ${metaMorphos.length} MetaMorphos`);
    });

    // Get all tokens
    console.log('🪙 Getting all tokens...');
    const tokens = await client.getAllTokens();
    console.log('Available tokens:', tokens.map(t => `${t.name} (${t.symbol})`));

  } catch (error) {
    console.error('Error in example usage:', error);
  }
}

export default BetFiSubgraphClientWithTokens;
