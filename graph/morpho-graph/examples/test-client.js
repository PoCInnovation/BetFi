#!/usr/bin/env node

// Test script for BetFi Subgraph Client
// Run with: node test-client.js

import BetFiSubgraphClientWithTokenData from './simple-token-client.mjs';

async function testSubgraphClient() {
    console.log('🚀 Testing BetFi Subgraph Client...\n');
    
    const client = new BetFiSubgraphClientWithTokenData();
    
    try {
        console.log('📊 Testing getMetaMorphosWithTokenData...');
        const vaults = await client.getMetaMorphosWithTokenData(5);
        
        if (vaults.length === 0) {
            console.log('⚠️  No vaults found. This might mean:');
            console.log('   - The subgraph is not deployed yet');
            console.log('   - No vaults have been created');
            console.log('   - Network connectivity issues');
        } else {
            console.log(`✅ Found ${vaults.length} vaults:`);
            
            vaults.forEach((vault, index) => {
                console.log(`\n🏦 Vault ${index + 1}:`);
                console.log(`   ID: ${vault.id}`);
                console.log(`   Name: "${vault.name}" ${vault.name ? '✅' : '⚠️ (empty - verify contract call)'}`);
                console.log(`   Symbol: "${vault.symbol}" ${vault.symbol ? '✅' : '⚠️ (empty - verify contract call)'}`);
                console.log(`   Vault Address: ${vault.metaMorpho}`);
                console.log(`   Asset Token: ${vault.asset}`);
                console.log(`   Creator: ${vault.caller}`);
                console.log(`   Initial Owner: ${vault.initialOwner || 'N/A'}`);
                console.log(`   Timelock: ${vault.initialTimelock} seconds`);
                console.log(`   Block Number: ${vault.blockNumber}`);
                console.log(`   Created: ${new Date(parseInt(vault.blockTimestamp) * 1000).toLocaleString()}`);
                console.log(`   Transaction Hash: ${vault.transactionHash}`);
                
                // Verification URLs
                console.log(`   🔍 Verify on Explorer:`);
                console.log(`      Tx: https://starkscan.co/tx/${vault.transactionHash} (if on mainnet)`);
                console.log(`      Vault: https://starkscan.co/contract/${vault.metaMorpho} (if on mainnet)`);
                
                if (vault.tokenData) {
                    console.log(`   Token Info: ${vault.tokenData.name} (${vault.tokenData.symbol})`);
                    console.log(`   Token Decimals: ${vault.tokenData.decimals}`);
                    console.log(`   Token Source: ${vault.tokenData.address === vault.asset ? '✅ Matches' : '❌ Mismatch'}`);
                } else {
                    console.log(`   ⚠️  No token data found for ${vault.asset}`);
                }
            });
        }
        
        console.log('\n🔍 Testing token summary...');
        const tokenSummary = await client.getTokenSummary();
        
        if (tokenSummary.length > 0) {
            console.log(`✅ Token Summary (${tokenSummary.length} unique tokens):`);
            tokenSummary.forEach(({ token, vaultCount }) => {
                console.log(`   ${token.symbol} (${token.name}): ${vaultCount} vault(s)`);
            });
        }
        
        console.log('\n✅ All tests completed successfully!');
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        
        if (error.message.includes('fetch')) {
            console.log('\n💡 Troubleshooting:');
            console.log('   - Check if the subgraph endpoint is correct');
            console.log('   - Verify network connectivity');
            console.log('   - Make sure the subgraph is deployed and synced');
        }
    }
}

// Test connection to subgraph
async function testConnection() {
    console.log('🔗 Testing subgraph connection...\n');
    
    const endpoint = 'https://api.studio.thegraph.com/query/115527/bet-fi/v0.0.5';
    
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                query: `
                    query TestConnection {
                        _meta {
                            block {
                                number
                                timestamp
                            }
                        }
                    }
                `
            })
        });
        
        const result = await response.json();
        
        if (result.data && result.data._meta) {
            console.log('✅ Subgraph is online!');
            console.log(`   Latest block: ${result.data._meta.block.number}`);
            console.log(`   Block time: ${new Date(result.data._meta.block.timestamp * 1000).toLocaleString()}`);
        } else {
            console.log('⚠️  Subgraph responded but no meta data available');
        }
        
    } catch (error) {
        console.error('❌ Connection failed:', error.message);
    }
}

// Run tests
async function runAllTests() {
    await testConnection();
    console.log('\n' + '='.repeat(50) + '\n');
    await testSubgraphClient();
}

runAllTests().catch(console.error);
