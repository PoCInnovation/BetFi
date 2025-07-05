// Quick vault check
const endpoint = 'https://api.studio.thegraph.com/query/115527/bet-fi/v0.0.5';

console.log('🔍 Quick Vault Check...');

fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        query: '{ createMetaMorphos(first: 10) { id name symbol metaMorpho blockNumber } }'
    })
})
.then(response => response.json())
.then(result => {
    if (result.errors) {
        console.log('❌ Errors:', result.errors);
    } else if (result.data) {
        const vaults = result.data.createMetaMorphos;
        console.log(`✅ Found ${vaults.length} vault(s):`);
        
        if (vaults.length === 0) {
            console.log('📭 No vaults found - subgraph may still be indexing');
        } else {
            vaults.forEach((vault, i) => {
                console.log(`${i+1}. ${vault.name || 'Unnamed'} (${vault.symbol || 'No Symbol'})`);
                console.log(`   Address: ${vault.metaMorpho}`);
                console.log(`   Block: ${vault.blockNumber}`);
                console.log('');
            });
        }
    } else {
        console.log('❌ No data returned');
    }
})
.catch(error => {
    console.log('❌ Network error:', error.message);
});
