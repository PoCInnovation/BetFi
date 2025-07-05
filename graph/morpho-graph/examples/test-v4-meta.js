// Test meta info for v0.0.4
import fetch from 'node-fetch';

const endpoint = 'https://api.studio.thegraph.com/query/115527/bet-fi/v0.0.4';

console.log('🔍 Testing BetFi v0.0.4 meta info...');

try {
    const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            query: `
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
            `
        })
    });
    
    const result = await response.json();
    
    if (result.data) {
        console.log('✅ Subgraph Meta Info:');
        console.log('   Block Number:', result.data._meta.block.number);
        console.log('   Block Time:', new Date(result.data._meta.block.timestamp * 1000).toLocaleString());
        console.log('   Block Hash:', result.data._meta.block.hash);
        console.log('   Deployment:', result.data._meta.deployment);
        console.log('   Has Errors:', result.data._meta.hasIndexingErrors);
        
        // Test if any tokens exist
        const tokenResponse = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                query: '{ tokens(first: 5) { id name symbol } }'
            })
        });
        
        const tokenResult = await tokenResponse.json();
        console.log('\n📊 Token Data:');
        console.log('   Tokens found:', tokenResult.data?.tokens?.length || 0);
        if (tokenResult.data?.tokens?.length > 0) {
            tokenResult.data.tokens.forEach(token => {
                console.log(`   - ${token.name} (${token.symbol}) at ${token.id}`);
            });
        }
        
    } else {
        console.log('❌ Error:', result);
    }
} catch (error) {
    console.log('❌ Failed:', error.message);
}
