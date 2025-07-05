#!/usr/bin/env node

// Simple Node.js script to demonstrate BetFi subgraph usage with token data
// Run with: node examples/demo.js

const BetFiSubgraphClientWithTokenData = require('./simple-token-client.js');

async function main() {
  console.log('🚀 BetFi MetaMorpho Vault Explorer\n');
  
  const client = new BetFiSubgraphClientWithTokenData();
  
  try {
    // 1. Get basic vault information
    console.log('📊 Fetching MetaMorpho vaults with token data...\n');
    const vaultsWithTokens = await client.getMetaMorphosWithTokenData(10);
    
    if (vaultsWithTokens.length === 0) {
      console.log('❌ No vaults found. Make sure your subgraph is deployed and has data.');
      return;
    }

    console.log(`✅ Found ${vaultsWithTokens.length} vaults\n`);

    // Display vault information
    vaultsWithTokens.forEach((vault, index) => {
      console.log(`🏦 Vault #${index + 1}`);
      console.log(`   Name: ${vault.name} (${vault.symbol})`);
      console.log(`   Address: ${vault.metaMorpho}`);
      console.log(`   Asset: ${vault.asset}`);
      
      if (vault.tokenData) {
        console.log(`   Token: ${vault.tokenData.name} (${vault.tokenData.symbol})`);
        console.log(`   Decimals: ${vault.tokenData.decimals}`);
      } else {
        console.log(`   Token: Unknown (${vault.asset})`);
      }
      
      console.log(`   Creator: ${vault.caller}`);
      console.log(`   Timelock: ${vault.initialTimelock} seconds`);
      console.log(`   Created: ${new Date(parseInt(vault.blockTimestamp) * 1000).toLocaleString()}`);
      console.log(`   Tx: ${vault.transactionHash}\n`);
    });

    // 2. Search for specific token vaults
    console.log('🔍 Searching for USDC vaults...');
    const usdcVaults = await client.searchByTokenSymbol('USDC');
    console.log(`   Found ${usdcVaults.length} USDC vault(s)\n`);

    // 3. Get token summary
    console.log('📈 Token Summary:');
    const tokenSummary = await client.getTokenSummary();
    
    if (tokenSummary.length === 0) {
      console.log('   No token data available\n');
    } else {
      tokenSummary.forEach((summary) => {
        console.log(`   ${summary.token.symbol} (${summary.token.name}):`);
        console.log(`     - ${summary.vaultCount} vault(s)`);
        console.log(`     - Vaults: ${summary.vaults.slice(0, 3).join(', ')}${summary.vaults.length > 3 ? '...' : ''}\n`);
      });
    }

    // 4. Group vaults by token
    console.log('🗂️  Vaults grouped by token:');
    const groupedVaults = await client.getMetaMorphosGroupedByToken();
    
    Object.entries(groupedVaults).forEach(([tokenSymbol, vaults]) => {
      console.log(`   ${tokenSymbol}: ${vaults.length} vault(s)`);
      vaults.forEach(vault => {
        console.log(`     - ${vault.name} (${vault.symbol})`);
      });
      console.log('');
    });

    // 5. Query specific examples
    console.log('🔧 Example: Query for vaults with long timelocks (> 1 day)');
    const longTimelockVaults = vaultsWithTokens.filter(vault => 
      parseInt(vault.initialTimelock) > 86400 // 1 day in seconds
    );
    console.log(`   Found ${longTimelockVaults.length} vault(s) with timelock > 1 day\n`);

    longTimelockVaults.forEach(vault => {
      const days = Math.floor(parseInt(vault.initialTimelock) / 86400);
      console.log(`   - ${vault.name}: ${days} day(s) timelock`);
    });

    console.log('\n✨ Demo completed successfully!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.message.includes('fetch')) {
      console.log('\n💡 Tips:');
      console.log('   - Make sure your subgraph is deployed and accessible');
      console.log('   - Check the endpoint URL in simple-token-client.ts');
      console.log('   - Verify your internet connection');
    }
  }
}

// Helper function to format addresses
function formatAddress(address) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// Run the demo
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main };
