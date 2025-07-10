import { setupAgent } from '../utils/agent.js';

export const askAI = async (req, res) => {
  console.log("🔍 AI Request Received:", req.body);
  const { input } = req.body;
  console.log("📥 User Input in backend:", input);

  if (!input) return res.status(400).json({ error: 'Input is required' });

  try {
    const executor = await setupAgent();
    const result = await executor.invoke({ input });

    const finalReply = result.output;
    console.log("🧠 AI Response:", finalReply);

    res.json({ response: finalReply });

  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
