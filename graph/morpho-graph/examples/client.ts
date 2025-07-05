// TypeScript Examples with Proper Typing for BetFi MetaMorpho Subgraph
// Endpoint: https://api.studio.thegraph.com/query/115527/bet-fi/v0.0.1

// Type definitions based on your schema
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

export interface QueryResponse<T> {
  data: T;
  errors?: Array<{ message: string }>;
}

export interface MetaMorphoQueryResult {
  createMetaMorphos: CreateMetaMorpho[];
}

export interface SingleMetaMorphoResult {
  createMetaMorpho: CreateMetaMorpho | null;
}

// Query class with proper error handling
export class BetFiSubgraphClient {
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

  // Get all MetaMorpho creations with pagination
  async getAllMetaMorphos(first: number = 100, skip: number = 0): Promise<CreateMetaMorpho[]> {
    const query = `
      query GetAllMetaMorphos($first: Int!, $skip: Int!) {
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
          initialTimelock
          blockTimestamp
          transactionHash
        }
      }
    `;

    const result = await this.query<MetaMorphoQueryResult>(query, { first, skip });
    return result.createMetaMorphos;
  }

  // Get MetaMorphos by specific caller
  async getMetaMorphosByCaller(caller: string, first: number = 10): Promise<CreateMetaMorpho[]> {
    const query = `
      query GetMetaMorphosByCaller($caller: Bytes!, $first: Int!) {
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
          initialTimelock
          blockTimestamp
          transactionHash
        }
      }
    `;

    const result = await this.query<MetaMorphoQueryResult>(query, { caller, first });
    return result.createMetaMorphos;
  }

  // Get MetaMorphos by asset
  async getMetaMorphosByAsset(asset: string): Promise<CreateMetaMorpho[]> {
    const query = `
      query GetMetaMorphosByAsset($asset: Bytes!) {
        createMetaMorphos(
          where: { asset: $asset }
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

    const result = await this.query<MetaMorphoQueryResult>(query, { asset });
    return result.createMetaMorphos;
  }

  // Search MetaMorphos by name or symbol
  async searchMetaMorphos(searchTerm: string): Promise<CreateMetaMorpho[]> {
    const query = `
      query SearchMetaMorphos($searchTerm: String!) {
        createMetaMorphos(
          where: {
            or: [
              { name_contains: $searchTerm }
              { symbol_contains: $searchTerm }
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
          blockTimestamp
        }
      }
    `;

    const result = await this.query<MetaMorphoQueryResult>(query, { searchTerm });
    return result.createMetaMorphos;
  }

  // Get specific MetaMorpho by ID
  async getMetaMorphoById(id: string): Promise<CreateMetaMorpho | null> {
    const query = `
      query GetMetaMorphoById($id: Bytes!) {
        createMetaMorpho(id: $id) {
          id
          metaMorpho
          caller
          initialOwner
          name
          symbol
          asset
          initialTimelock
          salt
          blockNumber
          blockTimestamp
          transactionHash
        }
      }
    `;

    const result = await this.query<SingleMetaMorphoResult>(query, { id });
    return result.createMetaMorpho;
  }

  // Get MetaMorphos with minimum timelock
  async getMetaMorphosWithMinTimelock(minTimelock: string): Promise<CreateMetaMorpho[]> {
    const query = `
      query GetMetaMorphosWithMinTimelock($minTimelock: BigInt!) {
        createMetaMorphos(
          where: { initialTimelock_gte: $minTimelock }
          orderBy: initialTimelock
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

    const result = await this.query<MetaMorphoQueryResult>(query, { minTimelock });
    return result.createMetaMorphos;
  }

  // Get recent MetaMorphos created after specific timestamp
  async getRecentMetaMorphos(afterTimestamp: string): Promise<CreateMetaMorpho[]> {
    const query = `
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
          asset
          blockTimestamp
        }
      }
    `;

    const result = await this.query<MetaMorphoQueryResult>(query, { afterTimestamp });
    return result.createMetaMorphos;
  }
}

// Usage examples
export async function exampleUsage() {
  const client = new BetFiSubgraphClient();

  try {
    // Get all MetaMorphos
    console.log('📊 Getting all MetaMorphos...');
    const allMetaMorphos = await client.getAllMetaMorphos(10);
    console.log(`Found ${allMetaMorphos.length} MetaMorphos:`, allMetaMorphos);

    // Get MetaMorphos by specific caller
    console.log('👤 Getting MetaMorphos by caller...');
    const callerMetaMorphos = await client.getMetaMorphosByCaller('0x1234567890123456789012345678901234567890');
    console.log(`Caller's MetaMorphos:`, callerMetaMorphos);

    // Search MetaMorphos
    console.log('🔍 Searching MetaMorphos...');
    const searchResults = await client.searchMetaMorphos('USDC');
    console.log(`Search results for "USDC":`, searchResults);

    // Get MetaMorphos with minimum timelock
    console.log('⏱️ Getting MetaMorphos with min timelock...');
    const minTimelockResults = await client.getMetaMorphosWithMinTimelock('3600'); // 1 hour
    console.log(`MetaMorphos with ≥1h timelock:`, minTimelockResults);

  } catch (error) {
    console.error('Error in example usage:', error);
  }
}

// Export the client for use in applications
export default BetFiSubgraphClient;
