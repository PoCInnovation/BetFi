// React Hooks for BetFi MetaMorpho Subgraph Integration
// Endpoint: https://api.studio.thegraph.com/query/115527/bet-fi/v0.0.1

import { useState, useEffect, useCallback } from 'react';

// Types (same as in client.ts)
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

interface QueryState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// Custom hook for MetaMorpho queries
export function useMetaMorphoQuery<T>(
  query: string,
  variables?: Record<string, any>,
  options?: { skip?: boolean }
) {
  const [state, setState] = useState<QueryState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const executeQuery = useCallback(async () => {
    if (options?.skip) return;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch('https://api.studio.thegraph.com/query/115527/bet-fi/v0.0.1', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, variables: variables || {} }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.errors) {
        throw new Error(result.errors.map((e: any) => e.message).join(', '));
      }

      setState({
        data: result.data,
        loading: false,
        error: null,
      });
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }, [query, variables, options?.skip]);

  useEffect(() => {
    executeQuery();
  }, [executeQuery]);

  return {
    ...state,
    refetch: executeQuery,
  };
}

// Hook to get all MetaMorphos
export function useAllMetaMorphos(first: number = 10, skip: number = 0) {
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

  const result = useMetaMorphoQuery<{ createMetaMorphos: CreateMetaMorpho[] }>(
    query,
    { first, skip }
  );

  return {
    ...result,
    metaMorphos: result.data?.createMetaMorphos || [],
  };
}

// Hook to get MetaMorphos by caller
export function useMetaMorphosByCaller(caller: string | null, first: number = 10) {
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
        name
        symbol
        asset
        initialTimelock
        blockTimestamp
      }
    }
  `;

  const result = useMetaMorphoQuery<{ createMetaMorphos: CreateMetaMorpho[] }>(
    query,
    { caller, first },
    { skip: !caller }
  );

  return {
    ...result,
    metaMorphos: result.data?.createMetaMorphos || [],
  };
}

// Hook to search MetaMorphos
export function useSearchMetaMorphos(searchTerm: string) {
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

  const result = useMetaMorphoQuery<{ createMetaMorphos: CreateMetaMorpho[] }>(
    query,
    { searchTerm },
    { skip: !searchTerm || searchTerm.length < 2 }
  );

  return {
    ...result,
    metaMorphos: result.data?.createMetaMorphos || [],
  };
}

// Hook to get MetaMorpho by ID
export function useMetaMorphoById(id: string | null) {
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

  const result = useMetaMorphoQuery<{ createMetaMorpho: CreateMetaMorpho | null }>(
    query,
    { id },
    { skip: !id }
  );

  return {
    ...result,
    metaMorpho: result.data?.createMetaMorpho || null,
  };
}

// Hook for MetaMorphos by asset
export function useMetaMorphosByAsset(asset: string | null) {
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

  const result = useMetaMorphoQuery<{ createMetaMorphos: CreateMetaMorpho[] }>(
    query,
    { asset },
    { skip: !asset }
  );

  return {
    ...result,
    metaMorphos: result.data?.createMetaMorphos || [],
  };
}

// Example React Components
export function MetaMorphosList() {
  const { metaMorphos, loading, error, refetch } = useAllMetaMorphos(20);

  if (loading) return <div>Loading MetaMorphos...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>MetaMorpho Vaults ({metaMorphos.length})</h2>
      <button onClick={refetch}>Refresh</button>
      
      <div className="grid">
        {metaMorphos.map((metamorpho) => (
          <div key={metamorpho.id} className="card">
            <h3>{metamorpho.name} ({metamorpho.symbol})</h3>
            <p><strong>Address:</strong> {metamorpho.metaMorpho}</p>
            <p><strong>Creator:</strong> {metamorpho.caller}</p>
            <p><strong>Asset:</strong> {metamorpho.asset}</p>
            <p><strong>Timelock:</strong> {metamorpho.initialTimelock} seconds</p>
            <p><strong>Created:</strong> {new Date(parseInt(metamorpho.blockTimestamp) * 1000).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MetaMorphoSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const { metaMorphos, loading, error } = useSearchMetaMorphos(searchTerm);

  return (
    <div>
      <h2>Search MetaMorphos</h2>
      <input
        type="text"
        placeholder="Search by name or symbol..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
      
      {loading && <div>Searching...</div>}
      {error && <div>Error: {error}</div>}
      
      <div className="results">
        {metaMorphos.map((metamorpho) => (
          <div key={metamorpho.id} className="result-item">
            <h4>{metamorpho.name} ({metamorpho.symbol})</h4>
            <p>Address: {metamorpho.metaMorpho}</p>
            <p>Asset: {metamorpho.asset}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function UserMetaMorphos({ userAddress }: { userAddress: string }) {
  const { metaMorphos, loading, error } = useMetaMorphosByCaller(userAddress);

  if (loading) return <div>Loading your MetaMorphos...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Your MetaMorphos ({metaMorphos.length})</h2>
      {metaMorphos.length === 0 ? (
        <p>You haven't created any MetaMorpho vaults yet.</p>
      ) : (
        <div className="user-metamorphos">
          {metaMorphos.map((metamorpho) => (
            <div key={metamorpho.id} className="metamorpho-card">
              <h3>{metamorpho.name}</h3>
              <p>Symbol: {metamorpho.symbol}</p>
              <p>Address: {metamorpho.metaMorpho}</p>
              <p>Created: {new Date(parseInt(metamorpho.blockTimestamp) * 1000).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
