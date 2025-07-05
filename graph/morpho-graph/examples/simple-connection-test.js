// Simple connection test
import fetch from 'node-fetch';

const endpoint = 'https://api.studio.thegraph.com/query/115527/bet-fi/v0.0.5';

console.log('🔗 Testing BetFi subgraph connection...');

try {
    const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            query: `
                query {
                    createMetaMorphos(first: 1) {
                        id
                        name
                        symbol
                    }
                }
            `
        })
    });
    
    const result = await response.json();
    
    if (result.errors) {
        console.log('❌ GraphQL errors:', result.errors);
    } else {
        console.log('✅ Connection successful!');
        console.log('Data:', JSON.stringify(result.data, null, 2));
    }
} catch (error) {
    console.log('❌ Connection failed:', error.message);
}
