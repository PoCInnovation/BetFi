#!/usr/bin/env node

// GraphQL Query Tester - Test different queries to verify data
import fetch from 'node-fetch';

const endpoint = 'https://api.studio.thegraph.com/query/115527/bet-fi/v0.0.2';

async function runQuery(name, query, variables = {}) {
    console.log(`\n📊 Testing Query: ${name}`);
    console.log(`Query: ${query.trim()}`);
    
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query, variables })
        });
        
        const result = await response.json();
        
        if (result.errors) {
            console.log('❌ GraphQL Errors:', result.errors);
            return null;
        } else {
            console.log('✅ Query successful');
            console.log('Result:', JSON.stringify(result.data, null, 2));
            return result.data;
        }
    } catch (error) {
        console.log('❌ Network Error:', error.message);
        return null;
    }
}

async function testAllQueries() {
    console.log('🔍 BetFi Subgraph Query Verification');
    console.log('=' * 50);
    
    // 1. Test basic vault query
    await runQuery('Basic Vaults', `
        query {
            createMetaMorphos(first: 5) {
                id
                metaMorpho
                name
                symbol
                asset
                caller
                blockNumber
                blockTimestamp
                transactionHash
            }
        }
    `);
    
    // 2. Test vault with specific ID
    await runQuery('Specific Vault by ID', `
        query {
            createMetaMorpho(id: "0x2311a0f64d9cb8cf3d44b4e00561054122b6b198ed1b44c4da6f4d8d6b6b970704000000") {
                id
                metaMorpho
                name
                symbol
                asset
                caller
                initialOwner
                initialTimelock
                blockNumber
                blockTimestamp
                transactionHash
            }
        }
    `);
    
    // 3. Test token query
    await runQuery('Token Data', `
        query {
            tokens(first: 5) {
                id
                name
                symbol
                decimals
                totalSupply
                metaMorphos {
                    id
                    name
                }
            }
        }
    `);
    
    // 4. Test meta data
    await runQuery('Subgraph Meta Info', `
        query {
            _meta {
                block {
                    number
                    timestamp
                    hash
                }
                deployment
                hasIndexingErrors
            }
        }
    `);
    
    // 5. Test filtering by asset
    await runQuery('Vaults by Asset', `
        query {
            createMetaMorphos(where: { asset: "0x3f16c1f7a4688cb9b42522d95e13cac840512c72" }) {
                id
                name
                symbol
                metaMorpho
                asset
            }
        }
    `);
    
    // 6. Test ordering
    await runQuery('Vaults Ordered by Block', `
        query {
            createMetaMorphos(
                first: 5
                orderBy: blockNumber
                orderDirection: desc
            ) {
                id
                blockNumber
                blockTimestamp
                name
                symbol
            }
        }
    `);
    
    // 7. Test count/stats
    await runQuery('Vault Count Stats', `
        query {
            createMetaMorphos(first: 1000) {
                id
                asset
            }
        }
    `);
    
    console.log('\n' + '=' * 50);
    console.log('📋 Verification Complete!');
    console.log('\n💡 Next steps to verify:');
    console.log('   1. Check transaction hashes on block explorer');
    console.log('   2. Verify contract addresses are deployed');
    console.log('   3. Cross-reference with factory contract events');
    console.log('   4. Test with fresh vault deployments');
}

testAllQueries().catch(console.error);
