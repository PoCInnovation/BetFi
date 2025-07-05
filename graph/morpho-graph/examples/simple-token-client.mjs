// JavaScript version for testing
import fetch from 'node-fetch';

export class BetFiSubgraphClientWithTokenData {
    constructor() {
        this.endpoint = 'https://api.studio.thegraph.com/query/115527/bet-fi/v0.0.5';
        this.tokenCache = new Map();
        
        // Known tokens for demo
        this.KNOWN_TOKENS = {
            "0xa0b86a33e6c7c7b02c9b8c3cb5e2c0c2b5c8e8d7f": {
                address: "0xa0b86a33e6c7c7b02c9b8c3cb5e2c0c2b5c8e8d7f",
                name: "USD Coin",
                symbol: "USDC",
                decimals: 6
            }
        };
    }

    async query(query, variables = {}) {
        try {
            const response = await fetch(this.endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query, variables })
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
        const address = tokenAddress.toLowerCase();
        
        if (this.tokenCache.has(address)) {
            return this.tokenCache.get(address);
        }

        const knownToken = this.KNOWN_TOKENS[address];
        if (knownToken) {
            this.tokenCache.set(address, knownToken);
            return knownToken;
        }

        const placeholderToken = {
            address: tokenAddress,
            name: `Token ${tokenAddress.slice(0, 6)}...`,
            symbol: `TKN${tokenAddress.slice(-4)}`,
            decimals: 18
        };
        
        this.tokenCache.set(address, placeholderToken);
        return placeholderToken;
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
                    initialTimelock
                    blockTimestamp
                    transactionHash
                }
            }
        `;

        const result = await this.query(query, { first });
        
        const enrichedMetaMorphos = await Promise.all(
            result.createMetaMorphos.map(async (metamorpho) => {
                const tokenData = await this.fetchTokenData(metamorpho.asset);
                return { ...metamorpho, tokenData };
            })
        );

        return enrichedMetaMorphos;
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
                tokenMap[address].vaults.push(metamorpho.name || 'Unnamed Vault');
            }
        });

        return Object.values(tokenMap).map(({ token, vaults }) => ({
            token,
            vaultCount: vaults.length,
            vaults
        }));
    }
}

export default BetFiSubgraphClientWithTokenData;
