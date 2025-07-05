#!/usr/bin/env node

// Simple Vault Table Listing
// Quick overview of all vaults in table format

import fetch from 'node-fetch';

const endpoint = 'https://api.studio.thegraph.com/query/115527/bet-fi/v0.0.5';

console.log('🏦 BetFi Vault Summary Table\n');

async function listVaultsTable() {
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                query: `
                    query {
                        createMetaMorphos(first: 50, orderBy: blockTimestamp, orderDirection: desc) {
                            name
                            symbol
                            metaMorpho
                            asset
                            caller
                            initialTimelock
                            blockNumber
                            blockTimestamp
                        }
                    }
                `
            })
        });
        
        const result = await response.json();
        
        if (result.errors) {
            console.log('❌ Errors:', result.errors.map(e => e.message).join(', '));
            return;
        }
        
        const vaults = result.data?.createMetaMorphos || [];
        
        if (vaults.length === 0) {
            console.log('📭 No vaults found');
            return;
        }
        
        console.log(`Found ${vaults.length} vault(s):\n`);
        
        // Table Header
        console.log('┌─────┬─────────────────┬─────────┬─────────────────────┬──────────────┬───────────┐');
        console.log('│ #   │ Name            │ Symbol  │ Vault Address       │ Timelock(h)  │ Created   │');
        console.log('├─────┼─────────────────┼─────────┼─────────────────────┼──────────────┼───────────┤');
        
        // Table Rows
        vaults.forEach((vault, index) => {
            const name = (vault.name || 'Unnamed').padEnd(15).substring(0, 15);
            const symbol = (vault.symbol || 'N/A').padEnd(7).substring(0, 7);
            const address = `${vault.metaMorpho.substring(0, 8)}...${vault.metaMorpho.slice(-8)}`.padEnd(19);
            const timelock = (parseInt(vault.initialTimelock) / 3600).toFixed(1).padStart(12);
            const created = new Date(parseInt(vault.blockTimestamp) * 1000).toLocaleDateString().padEnd(9);
            const num = (index + 1).toString().padStart(3);
            
            console.log(`│ ${num} │ ${name} │ ${symbol} │ ${address} │ ${timelock} │ ${created} │`);
        });
        
        console.log('└─────┴─────────────────┴─────────┴─────────────────────┴──────────────┴───────────┘');
        
        // Quick stats
        const namedCount = vaults.filter(v => v.name && v.name.trim()).length;
        const uniqueCreators = new Set(vaults.map(v => v.caller)).size;
        
        console.log(`\n📊 Quick Stats: ${namedCount}/${vaults.length} named | ${uniqueCreators} unique creator(s)`);
        
    } catch (error) {
        console.log('❌ Error:', error.message);
    }
}

listVaultsTable();
