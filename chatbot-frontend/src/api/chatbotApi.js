import axios from 'axios';

const API_URL = 'http://localhost:3000/chatbot/message';

export const sendMessage = async (message) => {
  try {
    const response = await axios.post(API_URL, {
      message,
      userId: 'user123'
    });
    return response.data.response;
  } catch (error) {
    console.error('API Error:', error);
    return "Sorry, I'm having trouble connecting.";
  }
};
