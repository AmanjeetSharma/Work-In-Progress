import { ChatGroq } from '@langchain/groq';
import { initializeAgentExecutorWithOptions } from 'langchain/agents';
import { DynamicTool } from 'langchain/tools';
import dotenv from 'dotenv';
import Product from '../models/product.model.js';

dotenv.config();

const mongoTool = new DynamicTool({
  name: 'queryMongo',
  description: 'Query MongoDB. Input must be a valid MongoDB query as JSON string.',
  func: async (input) => {
    try {
      const query = JSON.parse(input);

      // Use Mongoose Product model
      const results = await Product.find(query).limit(5);
      return JSON.stringify(results);
    } catch (err) {
      return `❌ Error: ${err.message}`;
    }
  },
});

const llm = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: 'llama3-70b-8192',
  temperature: 0,
});

export const setupAgent = async () => {
  const executor = await initializeAgentExecutorWithOptions(
    [mongoTool],
    llm,
    {
      agentType: 'zero-shot-react-description',
      verbose: true,
    }
  );
  return executor;
};
