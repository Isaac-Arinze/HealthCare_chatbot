import React, { useState, useEffect, useRef } from 'react';
import { sendMessage } from './api/chatbotApi'; // ✅ Corrected import path
import { 
  Box, TextField, Button, List, ListItem, 
  ListItemText, Typography, Paper, Container, Avatar 
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => scrollToBottom(), [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await sendMessage(input);
      const botMessage = { text: response, sender: 'bot' };
      setMessages(prev => [...prev, botMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Container maxWidth="md" sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h4" gutterBottom sx={{ py: 2, textAlign: 'center' }}>
        Healthcare Chatbot
      </Typography>
      
      <Paper elevation={3} sx={{ flexGrow: 1, overflow: 'auto', mb: 2 }}>
        <List sx={{ p: 2 }}>
          {messages.map((message, index) => (
            <ListItem key={index} sx={{ 
              justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
              alignItems: 'flex-start'
            }}>
              {message.sender === 'bot' && (
                <Avatar sx={{ bgcolor: 'primary.main', mr: 1 }}>B</Avatar>
              )}
              <Box sx={{ 
                maxWidth: '70%',
                bgcolor: message.sender === 'user' ? 'primary.main' : 'grey.100',
                color: message.sender === 'user' ? 'common.white' : 'text.primary',
                p: 1.5,
                borderRadius: 2,
                wordBreak: 'break-word'
              }}>
                <ListItemText 
                  primary={message.text} 
                  primaryTypographyProps={{ sx: { whiteSpace: 'pre-wrap' } }} 
                />
              </Box>
              {message.sender === 'user' && (
                <Avatar sx={{ bgcolor: 'secondary.main', ml: 1 }}>U</Avatar>
              )}
            </ListItem>
          ))}
          {isLoading && (
            <ListItem sx={{ justifyContent: 'flex-start' }}>
              <Avatar sx={{ bgcolor: 'primary.main', mr: 1 }}>B</Avatar>
              <Box sx={{ bgcolor: 'grey.100', p: 1.5, borderRadius: 2 }}>
                <ListItemText primary="Typing..." />
              </Box>
            </ListItem>
          )}
          <div ref={messagesEndRef} />
        </List>
      </Paper>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          multiline
          maxRows={4}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          disabled={isLoading}
        />
        <Button
          variant="contained"
          onClick={handleSendMessage}
          disabled={!input.trim() || isLoading}
          endIcon={<SendIcon />}
        >
          Send
        </Button>
      </Box>
    </Container>
  );
};

export default ChatInterface;
