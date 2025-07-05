// Mock API server for testing strategies
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Create the Express app
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Define the mock service here instead of importing
class MockStrategyService {
  constructor() {
    this.strategies = [
      {
        id: '1',
        trader: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
        objective: 15,
        deadline: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60,
        currentReturn: 5,
        totalBets: 3,
        votesYes: 2,
        votesNo: 1,
        status: 'active'
      },
      {
        id: '2',
        trader: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
        objective: 10,
        deadline: Math.floor(Date.now() / 1000) + 15 * 24 * 60 * 60,
        currentReturn: 12,
        totalBets: 5,
        votesYes: 4,
        votesNo: 1,
        status: 'active'
      },
      {
        id: '3',
        trader: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
        objective: 20,
        deadline: Math.floor(Date.now() / 1000) - 5 * 24 * 60 * 60,
        currentReturn: 18,
        totalBets: 10,
        votesYes: 7,
        votesNo: 3,
        status: 'completed'
      }
    ];
    this.nextId = this.strategies.length + 1;
  }

  async findAll() {
    return [...this.strategies];
  }

  async findOne(id) {
    const strategy = this.strategies.find(s => s.id === id);
    if (!strategy) {
      throw new Error(`Strategy with ID ${id} not found`);
    }
    return { ...strategy };
  }

  async findByTrader(trader) {
    return this.strategies.filter(s => s.trader.toLowerCase() === trader.toLowerCase());
  }

  async findByStatus(status) {
    return this.strategies.filter(s => s.status === status);
  }

  async create(createStrategyDto) {
    const id = this.nextId.toString();
    this.nextId++;
    
    const newStrategy = {
      id,
      trader: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', // Mock address
      objective: createStrategyDto.objective,
      deadline: Math.floor(Date.now() / 1000) + createStrategyDto.duration,
      currentReturn: 0,
      totalBets: 0,
      votesYes: 0,
      votesNo: 0,
      status: 'active'
    };
    
    this.strategies.push(newStrategy);
    return { ...newStrategy };
  }

  async updateReturn(id, currentReturn) {
    const index = this.strategies.findIndex(s => s.id === id);
    
    if (index === -1) {
      throw new Error(`Strategy with ID ${id} not found`);
    }
    
    this.strategies[index].currentReturn = currentReturn;
    return { ...this.strategies[index] };
  }

  async completeStrategy(id, successful) {
    const index = this.strategies.findIndex(s => s.id === id);
    
    if (index === -1) {
      throw new Error(`Strategy with ID ${id} not found`);
    }
    
    this.strategies[index].status = successful ? 'completed' : 'failed';
    return { ...this.strategies[index] };
  }

  async vote(id, voteYes, amount) {
    const index = this.strategies.findIndex(s => s.id === id);
    
    if (index === -1) {
      throw new Error(`Strategy with ID ${id} not found`);
    }
    
    if (voteYes) {
      this.strategies[index].votesYes += 1;
    } else {
      this.strategies[index].votesNo += 1;
    }
    
    this.strategies[index].totalBets += 1;
    return { ...this.strategies[index] };
  }
}
const mockService = new MockStrategyService();

// Root endpoint
app.get('/api', (req, res) => {
  res.json({ message: 'BetFi Mock API Server' });
});

// GET /strategies - Get all strategies
app.get('/api/strategies', async (req, res) => {
  try {
    const { status } = req.query;
    let strategies;
    
    if (status) {
      strategies = await mockService.findByStatus(status);
    } else {
      strategies = await mockService.findAll();
    }
    
    res.json(strategies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /strategies/:id - Get strategy by ID
app.get('/api/strategies/:id', async (req, res) => {
  try {
    const strategy = await mockService.findOne(req.params.id);
    res.json(strategy);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// GET /strategies/trader/:address - Get trader strategies
app.get('/api/strategies/trader/:address', async (req, res) => {
  try {
    const strategies = await mockService.findByTrader(req.params.address);
    res.json(strategies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /strategies - Create new strategy
app.post('/api/strategies', async (req, res) => {
  try {
    const newStrategy = await mockService.create(req.body);
    res.status(201).json(newStrategy);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /strategies/:id/return - Update strategy return
app.put('/api/strategies/:id/return', async (req, res) => {
  try {
    const { currentReturn } = req.body;
    const strategy = await mockService.updateReturn(req.params.id, currentReturn);
    res.json(strategy);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /strategies/:id/complete - Complete strategy
app.put('/api/strategies/:id/complete', async (req, res) => {
  try {
    const { successful } = req.body;
    const strategy = await mockService.completeStrategy(req.params.id, successful);
    res.json(strategy);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /strategies/:id/vote - Vote on strategy
app.post('/api/strategies/:id/vote', async (req, res) => {
  try {
    const { voteYes, amount } = req.body;
    const strategy = await mockService.vote(req.params.id, voteYes, amount);
    res.json(strategy);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Start the server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Mock API Server running on http://localhost:${PORT}/api`);
});
