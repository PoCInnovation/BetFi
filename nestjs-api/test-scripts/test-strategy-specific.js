const axios = require('axios');

// Configuration
const API_URL = 'http://localhost:3001';
const API_PREFIX = '/api';
const STRATEGY_ENDPOINT = `${API_URL}${API_PREFIX}/strategies`;

// Helper functions
const logResponse = (response) => {
  console.log('\n===== Response =====');
  console.log('Status:', response.status);
  console.log('Data:', JSON.stringify(response.data, null, 2));
  console.log('====================\n');
};

const handleError = (error) => {
  console.error('\n❌ Error:');
  if (error.response) {
    console.error('Status:', error.response.status);
    console.error('Data:', error.response.data);
  } else {
    console.error('Message:', error.message);
  }
  console.error('====================\n');
};

// Available test functions
const tests = {
  // Get all strategies
  async getAllStrategies() {
    try {
      console.log('📡 Fetching all strategies...');
      const response = await axios.get(STRATEGY_ENDPOINT);
      logResponse(response);
    } catch (error) {
      handleError(error);
    }
  },

  // Get strategies by status
  async getStrategiesByStatus(status = 'active') {
    try {
      console.log(`📡 Fetching ${status} strategies...`);
      const response = await axios.get(`${STRATEGY_ENDPOINT}?status=${status}`);
      logResponse(response);
    } catch (error) {
      handleError(error);
    }
  },

  // Get strategy by ID
  async getStrategyById(id) {
    try {
      console.log(`📡 Fetching strategy with ID: ${id}...`);
      const response = await axios.get(`${STRATEGY_ENDPOINT}/${id}`);
      logResponse(response);
    } catch (error) {
      handleError(error);
    }
  },

  // Get strategies by trader
  async getStrategiesByTrader(address) {
    try {
      console.log(`📡 Fetching strategies for trader: ${address}...`);
      const response = await axios.get(`${STRATEGY_ENDPOINT}/trader/${address}`);
      logResponse(response);
    } catch (error) {
      handleError(error);
    }
  },

  // Create a new strategy
  async createStrategy(strategy = null) {
    try {
      // Default strategy if none provided
      const newStrategy = strategy || {
        vaults: ['0x1234567890123456789012345678901234567890'],
        amounts: ['1000000000000000000'], // 1 ETH in wei
        tokens: ['0x0000000000000000000000000000000000000000'], // ETH
        objective: 15, // 15% return objective
        duration: 30 * 24 * 60 * 60, // 30 days in seconds
        commission: 10 // 10% commission
      };
      
      console.log('📡 Creating new strategy:', JSON.stringify(newStrategy, null, 2));
      const response = await axios.post(STRATEGY_ENDPOINT, newStrategy);
      logResponse(response);
      return response.data.id; // Return ID for chaining tests
    } catch (error) {
      handleError(error);
      return null;
    }
  },

  // Update strategy return
  async updateStrategyReturn(id, currentReturn = 7.5) {
    try {
      console.log(`📡 Updating return for strategy ID ${id} to ${currentReturn}%...`);
      const response = await axios.put(`${STRATEGY_ENDPOINT}/${id}/return`, { currentReturn });
      logResponse(response);
    } catch (error) {
      handleError(error);
    }
  },

  // Vote on strategy
  async voteOnStrategy(id, voteYes = true, amount = '0.1') {
    try {
      console.log(`📡 Voting ${voteYes ? 'YES' : 'NO'} on strategy ID ${id} with ${amount} ETH...`);
      const response = await axios.post(`${STRATEGY_ENDPOINT}/${id}/vote`, { voteYes, amount });
      logResponse(response);
    } catch (error) {
      handleError(error);
    }
  },

  // Complete strategy
  async completeStrategy(id, successful = true) {
    try {
      console.log(`📡 Marking strategy ID ${id} as ${successful ? 'successful' : 'failed'}...`);
      const response = await axios.put(`${STRATEGY_ENDPOINT}/${id}/complete`, { successful });
      logResponse(response);
    } catch (error) {
      handleError(error);
    }
  },

  // Create and run through full strategy lifecycle
  async fullStrategyLifecycle() {
    // Create a strategy
    console.log('🔄 Starting full strategy lifecycle test...');
    const id = await this.createStrategy();
    
    if (!id) {
      console.error('❌ Failed to create strategy, aborting lifecycle test');
      return;
    }
    
    // Wait a bit between operations
    const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    
    // Update return
    await wait(1000);
    await this.updateStrategyReturn(id, 5.5);
    
    // Vote on it
    await wait(1000);
    await this.voteOnStrategy(id, true, '0.2');
    
    // Complete it
    await wait(1000);
    await this.completeStrategy(id, true);
    
    console.log('✅ Full strategy lifecycle test completed');
  }
};

// Parse command line arguments
const [,, testName, ...args] = process.argv;

// Run the specified test or show help
async function run() {
  if (tests[testName]) {
    await tests[testName](...args);
  } else {
    console.log('Available tests:');
    Object.keys(tests).forEach(name => {
      console.log(`- ${name}`);
    });
    console.log('\nUsage: node test-strategy-specific.js <testName> [args]');
    console.log('Example: node test-strategy-specific.js getStrategyById 1234');
  }
}

run();
