#!/usr/bin/env node

// Comprehensive Vault Listing Test
// Lists all MetaMorpho vaults from the BetFi subgraph

import fetch from 'node-fetch';

const endpoint = 'https://api.studio.thegraph.com/query/115527/bet-fi/v0.0.5';

console.log('🏦 BetFi Vault Directory\n');
console.log('=' * 60);

async function getAllVaults() {
    try {
        console.log('📊 Fetching all vaults from subgraph...\n');
        
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                query: `
                    query GetAllVaults {
                        createMetaMorphos(
                            first: 100
                            orderBy: blockTimestamp
                            orderDirection: desc
                        ) {
                            id
                            metaMorpho
                            caller
                            initialOwner
                            initialTimelock
                            asset
                            name
                            symbol
                            salt
                            blockNumber
                            blockTimestamp
                            transactionHash
                        }
                    }
                `
            })
        });
        
        const result = await response.json();
        
        if (result.errors) {
            console.log('❌ GraphQL Errors:');
            result.errors.forEach(error => {
                console.log(`   - ${error.message}`);
            });
            return;
        }
        
        if (!result.data || !result.data.createMetaMorphos) {
            console.log('❌ No data returned from subgraph');
            return;
        }
        
        const vaults = result.data.createMetaMorphos;
        
        if (vaults.length === 0) {
            console.log('📭 No vaults found');
            console.log('\n💡 This could mean:');
            console.log('   - No vaults have been created yet');
            console.log('   - Subgraph is still indexing');
            console.log('   - Start block is set too high');
            console.log(`   - Current start block: 2741600`);
            return;
        }
        
        console.log(`✅ Found ${vaults.length} vault(s):\n`);
        
        // Display each vault
        vaults.forEach((vault, index) => {
            console.log(`🏦 Vault #${index + 1}`);
            console.log('─'.repeat(50));
            
            // Basic Info
            console.log(`📝 Name: "${vault.name || 'Unnamed'}" ${vault.name ? '✅' : '⚠️'}`);
            console.log(`🏷️  Symbol: "${vault.symbol || 'No Symbol'}" ${vault.symbol ? '✅' : '⚠️'}`);
            console.log(`🆔 ID: ${vault.id}`);
            
            // Addresses
            console.log(`🏗️  Vault Address: ${vault.metaMorpho}`);
            console.log(`💰 Asset Token: ${vault.asset}`);
            console.log(`👤 Creator: ${vault.caller}`);
            console.log(`👑 Initial Owner: ${vault.initialOwner}`);
            
            // Settings
            const timelockHours = parseInt(vault.initialTimelock) / 3600;
            console.log(`⏰ Timelock: ${vault.initialTimelock} seconds (${timelockHours.toFixed(2)} hours)`);
            console.log(`🧂 Salt: ${vault.salt}`);
            
            // Blockchain Info
            console.log(`📦 Block: #${vault.blockNumber}`);
            console.log(`📅 Created: ${new Date(parseInt(vault.blockTimestamp) * 1000).toLocaleString()}`);
            console.log(`🔗 Transaction: ${vault.transactionHash}`);
            
            // Verification Links
            console.log(`\n🔍 Verification Links:`);
            console.log(`   Tx: https://starkscan.co/tx/${vault.transactionHash}`);
            console.log(`   Vault: https://starkscan.co/contract/${vault.metaMorpho}`);
            console.log(`   Asset: https://starkscan.co/contract/${vault.asset}`);
            
            if (index < vaults.length - 1) {
                console.log('\n');
            }
        });
        
        // Summary Statistics
        console.log('\n' + '='.repeat(60));
        console.log('📊 Summary Statistics:');
        
        const namedVaults = vaults.filter(v => v.name && v.name.trim());
        const symbolVaults = vaults.filter(v => v.symbol && v.symbol.trim());
        const uniqueCreators = new Set(vaults.map(v => v.caller)).size;
        const uniqueAssets = new Set(vaults.map(v => v.asset)).size;
        const totalTimelock = vaults.reduce((sum, v) => sum + parseInt(v.initialTimelock), 0);
        const avgTimelock = totalTimelock / vaults.length / 3600; // in hours
        
        console.log(`   Total Vaults: ${vaults.length}`);
        console.log(`   Named Vaults: ${namedVaults.length} (${(namedVaults.length/vaults.length*100).toFixed(1)}%)`);
        console.log(`   With Symbols: ${symbolVaults.length} (${(symbolVaults.length/vaults.length*100).toFixed(1)}%)`);
        console.log(`   Unique Creators: ${uniqueCreators}`);
        console.log(`   Unique Assets: ${uniqueAssets}`);
        console.log(`   Average Timelock: ${avgTimelock.toFixed(2)} hours`);
        
        // Recent Activity
        if (vaults.length > 0) {
            const latestVault = vaults[0]; // Already sorted by timestamp desc
            const latestTime = new Date(parseInt(latestVault.blockTimestamp) * 1000);
            const timeSince = Date.now() - latestTime.getTime();
            const daysSince = timeSince / (1000 * 60 * 60 * 24);
            
            console.log(`   Latest Vault: ${daysSince.toFixed(1)} days ago`);
        }
        
    } catch (error) {
        console.log('❌ Error fetching vaults:', error.message);
        
        if (error.message.includes('fetch')) {
            console.log('\n💡 Troubleshooting:');
            console.log('   - Check network connection');
            console.log('   - Verify subgraph endpoint');
            console.log('   - Ensure subgraph is deployed');
        }
    }
}

// Also test subgraph health
async function checkSubgraphHealth() {
    try {
        console.log('🔍 Checking subgraph health...');
        
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                query: `
                    query SubgraphHealth {
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
                `
            })
        });
        
        const result = await response.json();
        
        if (result.data && result.data._meta) {
            const meta = result.data._meta;
            console.log(`✅ Subgraph is healthy`);
            console.log(`   Current Block: ${meta.block.number}`);
            console.log(`   Block Time: ${new Date(meta.block.timestamp * 1000).toLocaleString()}`);
            console.log(`   Has Errors: ${meta.hasIndexingErrors ? '❌ Yes' : '✅ No'}`);
            console.log(`   Deployment: ${meta.deployment}`);
            
            // Check if we're past the vault block
            const currentBlock = parseInt(meta.block.number);
            const vaultBlock = 2741669;
            
            if (currentBlock >= vaultBlock) {
                console.log(`✅ Subgraph has indexed past vault block (${vaultBlock})`);
            } else {
                console.log(`⏳ Subgraph still indexing (${currentBlock} / ${vaultBlock})`);
            }
        } else {
            console.log('⚠️  Could not get subgraph health info');
        }
        
    } catch (error) {
        console.log('❌ Health check failed:', error.message);
    }
    
    console.log(''); // Add spacing
}

// Run the tests
async function runAllTests() {
    await checkSubgraphHealth();
    await getAllVaults();
}

runAllTests().catch(console.error);
