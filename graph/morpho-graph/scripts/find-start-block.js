#!/usr/bin/env node

// Script to find the correct start block for the MetaMorpho factory contract
// This will help determine when the contract was deployed and first used

const CONTRACT_ADDRESS = "0x1c8De6889acee12257899BFeAa2b7e534de32E16";
const CURRENT_START_BLOCK = 4809113;

async function findStartBlock() {
  console.log('🔍 Finding the correct start block for MetaMorpho factory...\n');
  
  // Method 1: Check if the current start block is too high
  console.log(`Current configured start block: ${CURRENT_START_BLOCK}`);
  
  // Method 2: Suggest checking recent blocks on Katana
  console.log('\n📊 Methods to find the correct start block:\n');
  
  console.log('1️⃣  Check Katana Explorer:');
  console.log(`   - Visit Katana block explorer`);
  console.log(`   - Search for contract: ${CONTRACT_ADDRESS}`);
  console.log(`   - Find the deployment transaction block number`);
  
  console.log('\n2️⃣  Check for CreateMetaMorpho events:');
  console.log(`   - Look for the first CreateMetaMorpho event emitted by the contract`);
  console.log(`   - Use that block number as your start block`);
  
  console.log('\n3️⃣  Try a lower block number:');
  console.log(`   - Current: ${CURRENT_START_BLOCK}`);
  console.log(`   - Try: ${CURRENT_START_BLOCK - 100000} (100k blocks earlier)`);
  console.log(`   - Or try: ${CURRENT_START_BLOCK - 500000} (500k blocks earlier)`);
  
  console.log('\n4️⃣  Use block 0 (slowest but guaranteed):');
  console.log(`   - Set startBlock: 0 to index from genesis`);
  console.log(`   - This will be slower but will catch all events`);
  
  // Method 3: Test different start blocks
  console.log('\n🧪 Let\'s test some potential start blocks:\n');
  
  const testBlocks = [
    0,                           // Genesis
    4000000,                     // 800k blocks earlier
    4300000,                     // 500k blocks earlier  
    4500000,                     // 300k blocks earlier
    4700000,                     // 100k blocks earlier
    CURRENT_START_BLOCK - 50000, // 50k blocks earlier
    CURRENT_START_BLOCK          // Current setting
  ];
  
  testBlocks.forEach((block, index) => {
    console.log(`Option ${index + 1}: startBlock: ${block}`);
    if (block === 0) {
      console.log('   ⚠️  Slowest option - indexes from genesis');
    } else if (block < 4000000) {
      console.log('   ⚡ Very early - likely safe but slow');
    } else if (block < CURRENT_START_BLOCK - 100000) {
      console.log('   ✅ Good compromise - should catch most events');
    } else if (block === CURRENT_START_BLOCK) {
      console.log('   ❓ Current setting - might be too high');
    }
  });
  
  console.log('\n💡 Recommendations:');
  console.log('1. Start with a lower block number like 4000000');
  console.log('2. Deploy and check if events are indexed');
  console.log('3. If still no events, try block 0');
  console.log('4. Once working, you can optimize to a higher block later');
  
  console.log('\n🔧 To update your start block:');
  console.log('1. Edit subgraph.yaml');
  console.log('2. Change startBlock: 4809113 to startBlock: 4000000');
  console.log('3. Rebuild and redeploy: npm run deploy');
  
  console.log('\n📝 Quick fix commands:');
  console.log(`cd /Users/gregz./PoC/BetFi/bet-fi`);
  console.log(`# Edit startBlock in subgraph.yaml to a lower number`);
  console.log(`npm run codegen`);
  console.log(`npm run build`);
  console.log(`npm run deploy`);
}

// Additional function to create a test subgraph.yaml with different start block
function generateTestConfig(newStartBlock) {
  const config = `specVersion: 1.3.0
indexerHints:
  prune: auto
schema:
  file: ./schema.graphql
dataSources:
  - kind: ethereum
    name: MetaMorpho_factory
    network: katana
    source:
      address: "0x1c8De6889acee12257899BFeAa2b7e534de32E16"
      abi: MetaMorpho_factory
      startBlock: ${newStartBlock}
    mapping:
      kind: ethereum/events
      apiVersion: 0.0.9
      language: wasm/assemblyscript
      entities:
        - CreateMetaMorpho
        - Token
      abis:
        - name: MetaMorpho_factory
          file: ./abis/MetaMorpho_factory.json
        - name: ERC20
          file: ./abis/ERC20.json
      eventHandlers:
        - event: CreateMetaMorpho(indexed address,indexed address,address,uint256,indexed address,string,string,bytes32)
          handler: handleCreateMetaMorpho
      file: ./src/meta-morpho-factory.ts`;
  
  return config;
}

if (require.main === module) {
  findStartBlock();
}

module.exports = { 
  findStartBlock, 
  generateTestConfig,
  suggestedStartBlocks: [0, 4000000, 4300000, 4500000, 4700000]
};
