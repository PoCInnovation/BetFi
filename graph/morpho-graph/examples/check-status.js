#!/usr/bin/env node

// Simple status checker
console.log('🔍 Checking BetFi Subgraph Status...\n');

const endpoints = [
    'https://api.studio.thegraph.com/query/115527/bet-fi/v0.0.1',
    'https://api.studio.thegraph.com/query/115527/bet-fi/v0.0.2',
    'https://api.studio.thegraph.com/query/115527/bet-fi/v0.0.3',
    'https://api.studio.thegraph.com/query/115527/bet-fi/version/latest'
];

async function checkEndpoint(url) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                query: '{ _meta { block { number } } }'
            })
        });
        
        const result = await response.json();
        
        if (result.data) {
            console.log(`✅ ${url} - ONLINE`);
            return true;
        } else {
            console.log(`❌ ${url} - ${result.message || 'Error'}`);
            return false;
        }
    } catch (error) {
        console.log(`❌ ${url} - ${error.message}`);
        return false;
    }
}

async function checkAllEndpoints() {
    console.log('Trying different endpoint versions...\n');
    
    for (const endpoint of endpoints) {
        const isOnline = await checkEndpoint(endpoint);
        if (isOnline) {
            console.log(`\n🎉 Found working endpoint: ${endpoint}`);
            break;
        }
    }
    
    console.log('\n💡 If none work, redeploy your subgraph:');
    console.log('   1. Get your deploy key from thegraph.com/studio');
    console.log('   2. Run: graph auth <deploy-key>');
    console.log('   3. Run: npm run deploy');
}

checkAllEndpoints().catch(console.error);
