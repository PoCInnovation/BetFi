#!/usr/bin/env node

// RPC Connection Test for Katana
console.log('🔗 Testing Katana RPC Connection...\n');

const rpcUrls = [
    'http://localhost:5050',
    'http://localhost:5051', 
    'http://localhost:7878',
    'http://127.0.0.1:5050'
];

async function testRpc(url) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                jsonrpc: '2.0',
                method: 'starknet_chainId',
                params: [],
                id: 1
            })
        });
        
        const result = await response.json();
        
        if (result.result) {
            console.log(`✅ ${url} - ONLINE`);
            console.log(`   Chain ID: ${result.result}`);
            return true;
        } else {
            console.log(`❌ ${url} - ${result.error?.message || 'Unknown error'}`);
            return false;
        }
    } catch (error) {
        console.log(`❌ ${url} - ${error.message}`);
        return false;
    }
}

async function testAllRpcs() {
    for (const url of rpcUrls) {
        const isOnline = await testRpc(url);
        if (isOnline) {
            console.log(`\n🎉 Found working RPC: ${url}`);
            
            // Test getting latest block
            try {
                const blockResponse = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        jsonrpc: '2.0',
                        method: 'starknet_blockNumber',
                        params: [],
                        id: 1
                    })
                });
                
                const blockResult = await blockResponse.json();
                if (blockResult.result) {
                    console.log(`   Latest Block: ${parseInt(blockResult.result, 16)}`);
                }
            } catch (e) {
                console.log('   Could not get block number');
            }
            
            break;
        }
        console.log('');
    }
    
    console.log('\n💡 If no RPC is working:');
    console.log('   1. Start Katana: katana --dev');
    console.log('   2. Check the port with: ps aux | grep katana');
    console.log('   3. Or start on specific port: katana --dev --port 5050');
}

// Import fetch for Node.js
import fetch from 'node-fetch';

testAllRpcs().catch(console.error);
