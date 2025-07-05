import React, { useState, useEffect } from 'react';
import BetFiSubgraphClientWithTokenData, { CreateMetaMorpho, TokenData } from './simple-token-client';

// Types
interface MetaMorphoWithToken extends CreateMetaMorpho {
  tokenData?: TokenData;
}

interface VaultCardProps {
  vault: MetaMorphoWithToken;
}

// Vault Card Component
const VaultCard: React.FC<VaultCardProps> = ({ vault }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-4 border-l-4 border-blue-500">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-800">{vault.name}</h3>
          <p className="text-gray-600">Symbol: {vault.symbol}</p>
        </div>
        <div className="text-right">
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
            {vault.tokenData?.symbol || 'Unknown Token'}
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-500">Asset Token</p>
          <p className="font-mono text-sm text-gray-800 break-all">
            {vault.tokenData?.name || vault.asset}
          </p>
          <p className="text-xs text-gray-500">{vault.asset}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Vault Address</p>
          <p className="font-mono text-sm text-gray-800 break-all">{vault.metaMorpho}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-500">Creator</p>
          <p className="font-mono text-sm text-gray-800 break-all">{vault.caller}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Timelock</p>
          <p className="text-sm text-gray-800">{vault.initialTimelock} seconds</p>
        </div>
      </div>
      
      {vault.tokenData && (
        <div className="bg-gray-50 rounded p-3 mt-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Token Details</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-500">Decimals:</span> {vault.tokenData.decimals}
            </div>
            {vault.tokenData.totalSupply && (
              <div>
                <span className="text-gray-500">Supply:</span> {vault.tokenData.totalSupply}
              </div>
            )}
          </div>
        </div>
      )}
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          Created: {new Date(parseInt(vault.blockTimestamp) * 1000).toLocaleString()}
        </p>
        <p className="text-xs text-gray-500 font-mono">
          Tx: {vault.transactionHash}
        </p>
      </div>
    </div>
  );
};

// Token Filter Component
interface TokenFilterProps {
  tokens: string[];
  selectedToken: string;
  onTokenChange: (token: string) => void;
}

const TokenFilter: React.FC<TokenFilterProps> = ({ tokens, selectedToken, onTokenChange }) => {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Filter by Token
      </label>
      <select
        value={selectedToken}
        onChange={(e) => onTokenChange(e.target.value)}
        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">All Tokens</option>
        {tokens.map((token) => (
          <option key={token} value={token}>
            {token}
          </option>
        ))}
      </select>
    </div>
  );
};

// Search Component
interface SearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

const Search: React.FC<SearchProps> = ({ onSearch, placeholder = "Search vaults..." }) => {
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSearch} className="mb-6">
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Search
        </button>
      </div>
    </form>
  );
};

// Main Dashboard Component
const BetFiVaultDashboard: React.FC = () => {
  const [vaults, setVaults] = useState<MetaMorphoWithToken[]>([]);
  const [filteredVaults, setFilteredVaults] = useState<MetaMorphoWithToken[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedToken, setSelectedToken] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [client] = useState(() => new BetFiSubgraphClientWithTokenData());

  // Get unique token symbols for filter
  const uniqueTokens = React.useMemo(() => {
    const tokens = new Set<string>();
    vaults.forEach(vault => {
      if (vault.tokenData?.symbol) {
        tokens.add(vault.tokenData.symbol);
      }
    });
    return Array.from(tokens).sort();
  }, [vaults]);

  // Load vaults
  useEffect(() => {
    const loadVaults = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const vaultsData = await client.getMetaMorphosWithTokenData(50);
        setVaults(vaultsData);
        setFilteredVaults(vaultsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load vaults');
      } finally {
        setLoading(false);
      }
    };

    loadVaults();
  }, [client]);

  // Filter vaults based on selected token and search query
  useEffect(() => {
    let filtered = vaults;

    // Filter by token
    if (selectedToken) {
      filtered = filtered.filter(vault => vault.tokenData?.symbol === selectedToken);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(vault =>
        vault.name.toLowerCase().includes(query) ||
        vault.symbol.toLowerCase().includes(query) ||
        vault.tokenData?.name.toLowerCase().includes(query) ||
        vault.tokenData?.symbol.toLowerCase().includes(query) ||
        vault.asset.toLowerCase().includes(query) ||
        vault.metaMorpho.toLowerCase().includes(query)
      );
    }

    setFilteredVaults(filtered);
  }, [vaults, selectedToken, searchQuery]);

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Handle token filter change
  const handleTokenChange = (token: string) => {
    setSelectedToken(token);
  };

  // Refresh data
  const handleRefresh = async () => {
    try {
      setLoading(true);
      const vaultsData = await client.getMetaMorphosWithTokenData(50);
      setVaults(vaultsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh vaults');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading MetaMorpho vaults...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <strong className="font-bold">Error:</strong> {error}
          </div>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">BetFi MetaMorpho Vaults</h1>
              <p className="text-gray-600">
                Showing {filteredVaults.length} of {vaults.length} vaults
              </p>
            </div>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Search onSearch={handleSearch} placeholder="Search by name, symbol, or address..." />
          <TokenFilter
            tokens={uniqueTokens}
            selectedToken={selectedToken}
            onTokenChange={handleTokenChange}
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h6m-6 4h6m-6 4h6" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Vaults</p>
                <p className="text-2xl font-semibold text-gray-900">{vaults.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Unique Tokens</p>
                <p className="text-2xl font-semibold text-gray-900">{uniqueTokens.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Filtered Results</p>
                <p className="text-2xl font-semibold text-gray-900">{filteredVaults.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Vault List */}
        <div className="space-y-4">
          {filteredVaults.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No vaults found</h3>
              <p className="mt-2 text-gray-500">
                {searchQuery || selectedToken
                  ? 'Try adjusting your search criteria.'
                  : 'No MetaMorpho vaults have been created yet.'}
              </p>
            </div>
          ) : (
            filteredVaults.map((vault) => (
              <VaultCard key={vault.id} vault={vault} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BetFiVaultDashboard;
