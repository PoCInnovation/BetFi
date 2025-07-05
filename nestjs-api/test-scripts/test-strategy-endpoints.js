const axios = require('axios');

// Configuration
const API_URL = 'http://localhost:3001';
const API_PREFIX = '/api';
const STRATEGY_ENDPOINT = `${API_URL}${API_PREFIX}/strategies`;

// Helper function to log the response
const logResponse = (endpoint, response) => {
  console.log(`\n===== Response from ${endpoint} =====`);
  console.log('Status:', response.status);
  console.log('Data:', JSON.stringify(response.data, null, 2));
  console.log('=====================================\n');
};

// Helper function to handle errors
const handleError = (endpoint, error) => {
  console.error(`\n❌ Error with ${endpoint}`);
  if (error.response) {
    console.error('Status:', error.response.status);
    console.error('Data:', error.response.data);
    
    // Log the full error stack if available
    if (error.response.data && error.response.data.stack) {
      console.error('Stack:', error.response.data.stack);
    }
  } else {
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
  }
  console.error('=====================================\n');
};

// Test function to run all tests
async function runTests() {
  try {
    console.log('🚀 Starting Strategy Endpoint Tests...\n');
    
    // Test 1: Get all strategies
    try {
      console.log('Test 1: GET /strategies - Fetch all strategies');
      const response = await axios.get(STRATEGY_ENDPOINT);
      logResponse('GET /strategies', response);
    } catch (error) {
      handleError('GET /strategies', error);
    }

    // Test 2: Get strategies by status
    try {
      console.log('Test 2: GET /strategies?status=active - Fetch active strategies');
      const response = await axios.get(`${STRATEGY_ENDPOINT}?status=active`);
      logResponse('GET /strategies?status=active', response);
    } catch (error) {
      handleError('GET /strategies?status=active', error);
    }

    // Test 3: Get a strategy by ID (assumes at least one strategy exists)
    try {
      console.log('Test 3: GET /strategies/:id - Fetch a strategy by ID');
      const allStrategies = await axios.get(STRATEGY_ENDPOINT);
      if (allStrategies.data && allStrategies.data.length > 0) {
        const firstStrategyId = allStrategies.data[0].id;
        const response = await axios.get(`${STRATEGY_ENDPOINT}/${firstStrategyId}`);
        logResponse(`GET /strategies/${firstStrategyId}`, response);
      } else {
        console.log('⚠️ No strategies found to test GET /strategies/:id endpoint');
      }
    } catch (error) {
      handleError('GET /strategies/:id', error);
    }

    // Test 4: Create a new strategy
    try {
      console.log('Test 4: POST /strategies - Create a new strategy');
      const newStrategy = {
        vaults: ['0x1234567890123456789012345678901234567890'],
        amounts: ['1000000000000000000'], // 1 ETH in wei
        tokens: ['0x0000000000000000000000000000000000000000'], // ETH
        objective: 15, // 15% return objective
        duration: 30 * 24 * 60 * 60, // 30 days in seconds
        commission: 10 // 10% commission
      };
      const response = await axios.post(STRATEGY_ENDPOINT, newStrategy);
      logResponse('POST /strategies', response);
      
      // Store the created strategy ID for further tests
      const createdStrategyId = response.data.id;

      // Test 5: Update the return of the created strategy
      if (createdStrategyId) {
        try {
          console.log(`Test 5: PUT /strategies/${createdStrategyId}/return - Update strategy return`);
          const updateData = {
            currentReturn: 7.5 // 7.5% current return
          };
          const updateResponse = await axios.put(`${STRATEGY_ENDPOINT}/${createdStrategyId}/return`, updateData);
          logResponse(`PUT /strategies/${createdStrategyId}/return`, updateResponse);
        } catch (error) {
          handleError(`PUT /strategies/${createdStrategyId}/return`, error);
        }

        // Test 6: Vote on the strategy
        try {
          console.log(`Test 6: POST /strategies/${createdStrategyId}/vote - Vote on strategy`);
          const voteData = {
            voteYes: true,
            amount: '0.1' // Vote with 0.1 ETH
          };
          const voteResponse = await axios.post(`${STRATEGY_ENDPOINT}/${createdStrategyId}/vote`, voteData);
          logResponse(`POST /strategies/${createdStrategyId}/vote`, voteResponse);
        } catch (error) {
          handleError(`POST /strategies/${createdStrategyId}/vote`, error);
        }

        // Test 7: Complete the strategy
        try {
          console.log(`Test 7: PUT /strategies/${createdStrategyId}/complete - Complete strategy`);
          const completeData = {
            successful: true
          };
          const completeResponse = await axios.put(`${STRATEGY_ENDPOINT}/${createdStrategyId}/complete`, completeData);
          logResponse(`PUT /strategies/${createdStrategyId}/complete`, completeResponse);
        } catch (error) {
          handleError(`PUT /strategies/${createdStrategyId}/complete`, error);
        }
      }

    } catch (error) {
      handleError('POST /strategies', error);
    }

    // Test 8: Get strategies by trader
    try {
      console.log('Test 8: GET /strategies/trader/:address - Get trader strategies');
      const traderAddress = '0x0000000000000000000000000000000000000000'; // Replace with real address if needed
      const response = await axios.get(`${STRATEGY_ENDPOINT}/trader/${traderAddress}`);
      logResponse(`GET /strategies/trader/${traderAddress}`, response);
    } catch (error) {
      handleError(`GET /strategies/trader/:address`, error);
    }

    console.log('\n✅ All tests completed!');
  } catch (error) {
    console.error('\n❌ Test execution failed:', error);
  }
}

// Run the tests
runTests();
