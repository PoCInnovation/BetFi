import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {ethers} from 'ethers';
import { provider } from 'starknet';

@Injectable()
export class BlockchainService {
  private contract: ethers.Contract;
  private provider: ethers.JsonRpcProvider;

  private contractAbi = [
    {
      "inputs": [{"internalType": "address", "name": "_ausd", "type": "address"}],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {"indexed": true, "internalType": "address", "name": "trader", "type": "address"},
        {"indexed": false, "internalType": "address", "name": "strategyBet", "type": "address"},
        {"indexed": false, "internalType": "address[]", "name": "vaults", "type": "address[]"},
        {"indexed": false, "internalType": "uint256[]", "name": "amounts", "type": "uint256[]"},
        {"indexed": false, "internalType": "address[]", "name": "tokens", "type": "address[]"}
      ],
      "name": "StrategyProposed",
      "type": "event"
    },
    {
      "inputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
      "name": "allStrategies",
      "outputs": [{"internalType": "address", "name": "", "type": "address"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "ausd",
      "outputs": [{"internalType": "address", "name": "", "type": "address"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getAllStrategies",
      "outputs": [{"internalType": "address[]", "name": "", "type": "address[]"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {"internalType": "address[]", "name": "vaults", "type": "address[]"},
        {"internalType": "uint256[]", "name": "amounts", "type": "uint256[]"},
        {"internalType": "address[]", "name": "tokens", "type": "address[]"},
        {"internalType": "uint256", "name": "objectivePercent", "type": "uint256"},
        {"internalType": "uint256", "name": "duration", "type": "uint256"},
        {"internalType": "uint256", "name": "commission", "type": "uint256"}
      ],
      "name": "proposeStrategy",
      "outputs": [{"internalType": "address", "name": "", "type": "address"}],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];

  constructor(private configService: ConfigService) {
    this.initializeBlockchain();
  }

  
  private initializeBlockchain() {
      try {
        this.provider = new ethers.JsonRpcProvider("https://rpc.katana.network/");
      const contractAddress = "0xC93BEDC364B170c332CEFE65023906A06165511f";

      this.contract = new ethers.Contract(contractAddress, this.contractAbi, this.provider);

        if (!this.provider || !contractAddress) {
          throw new Error('Missing RPC_URL or CONTRACT_ADDRESS in environment variables');
        }

      console.log('Blockchain connection initialized successfully');
    } catch (error) {
      console.error('Failed to initialize blockchain connection:', error);
      throw error; // Rethrow to ensure we don't continue if blockchain connection fails
    }
  }

  async getAllStrategies(): Promise<string[]> {
    try {
      console.log('Calling getAllStrategies on contract...');
      // Utiliser la méthode call pour appeler une fonction du contrat
      console.log(this.contract);
      const result = await this.contract.getAllStrategies();
      console.log('Raw contract result:', JSON.stringify(result, null, 2));
      
      // Le format de retour dépend du contrat, normalement c'est un tableau
      if (Array.isArray(result) && result.length > 0) {
        if (Array.isArray(result[0])) {
          return result.map((addr: any) => addr.toString());
        } else {
          return [result[0].toString()];
        }
      } else {
        console.log('No strategies found or unexpected result format:', result);
        return [];
      }
    } catch (error) {
      console.error('Error fetching strategies:', error);
      throw error; // Rethrow to ensure errors are properly handled
    }
  }

//   async getStrategyAtIndex(index: number): Promise<string> {
//     try {
//       console.log(`Calling allStrategies for index ${index}...`);
//       // Utiliser la méthode call pour appeler une fonction du contrat avec un paramètre
//       const result = await this.contract.
//       console.log('Raw contract result:', JSON.stringify(result, null, 2));
      
//       // Convert the result to string
//       return result[0].toString();
//     } catch (error) {
//       console.error(`Error fetching strategy at index ${index}:`, error);
//       throw error; // Rethrow to ensure errors are properly handled
//     }
//   }

  async getAusdAddress(): Promise<string> {
    try {
      console.log('Calling ausd on contract...');
      // Utiliser la méthode call pour appeler une fonction du contrat
      const result = await this.contract.call("ausd");
      console.log('Raw contract result:', JSON.stringify(result, null, 2));
      
      // Convert the result to string
      return result[0].toString();
    } catch (error) {
      console.error('Error fetching AUSD address:', error);
      throw error; // Rethrow to ensure errors are properly handled
    }
  }
}
