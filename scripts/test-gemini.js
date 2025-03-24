const { GoogleGenerativeAI } = require('@google/generative-ai');
const readline = require('readline'); // For reading user input
require('dotenv').config(); // Load environment variables from .env

const apiKey = process.env.GEMINI_API_KEY; // Get the API key from .env
if (!apiKey) {
  console.error('GEMINI_API_KEY is not set in the environment variables.');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

// Array to store conversation history
let conversationHistory = [];

// Create a readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function testGemini() {
  try {
    // Try with the updated model name
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    // Function to send a message to Gemini and get a response
    const sendMessage = async (message) => {
      // Add the user's message to the conversation history
      conversationHistory.push({
        role: 'user',
        parts: [{ text: message }],
      });

      // Send the entire conversation history to the model
      const result = await model.generateContent({
        contents: conversationHistory,
      });

      const response = await result.response;
      const text = response.text();

      // Add the model's response to the conversation history
      conversationHistory.push({
        role: 'model',
        parts: [{ text }],
      });

      return text;
    };

    // Function to start the conversation
    const startConversation = async () => {
      rl.question('You: ', async (userInput) => {
        if (userInput.toLowerCase() === 'exit') {
          console.log('Goodbye!');
          rl.close();
          return;
        }

        // Send the user's message to Gemini
        const response = await sendMessage(userInput);
        console.log('Gemini:', response);

        // Continue the conversation
        startConversation();
      });
    };

    // Start the conversation
    console.log('Type "exit" to end the conversation.');
    startConversation();
  } catch (error) {
    console.error('Error with gemini-1.5-pro:', error.message);

    // Try fallback to gemini-pro
    try {
      console.log('Trying fallback to gemini-pro...');
      const fallbackModel = genAI.getGenerativeModel({ model: 'gemini-pro' });

      // Reset conversation history for the fallback model
      conversationHistory = [];

      // Function to send a message to the fallback model
      const sendMessageFallback = async (message) => {
        conversationHistory.push({
          role: 'user',
          parts: [{ text: message }],
        });

        const result = await fallbackModel.generateContent({
          contents: conversationHistory,
        });

        const response = await result.response;
        const text = response.text();

        conversationHistory.push({
          role: 'model',
          parts: [{ text }],
        });

        return text;
      };

      // Function to start the fallback conversation
      const startFallbackConversation = async () => {
        rl.question('You: ', async (userInput) => {
          if (userInput.toLowerCase() === 'exit') {
            console.log('Goodbye!');
            rl.close();
            return;
          }

          // Send the user's message to the fallback model
          const response = await sendMessageFallback(userInput);
          console.log('Gemini (fallback):', response);

          // Continue the conversation
          startFallbackConversation();
        });
      };

      // Start the fallback conversation
      console.log('Type "exit" to end the conversation.');
      startFallbackConversation();
    } catch (fallbackError) {
      console.error('Fallback also failed:', fallbackError.message);
      console.error('Full error:', fallbackError);
      rl.close();
    }
  }
}

// Run the test function
testGemini();