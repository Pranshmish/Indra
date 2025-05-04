import React, { useState } from 'react';
import './ChatBot.css';

const ChatBot = ({ getWeatherSummary }) => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi! Ask me about the weather in any city.' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);

    const lowerInput = input.toLowerCase();

    // Try to extract city from input (naive way)
    const cityMatch = lowerInput.match(/weather in ([a-zA-Z\s]+)/);
    const city = cityMatch ? cityMatch[1].trim() : null;

    let botResponse;

    if (city) {
      try {
        const summary = await getWeatherSummary(city);
        botResponse = { sender: 'bot', text: summary };
      } catch (error) {
        botResponse = { sender: 'bot', text: "Sorry, I couldn't fetch the weather. Please try again." };
      }
    } else {
      botResponse = {
        sender: 'bot',
        text: "I can tell you the weather. Try asking: 'What's the weather in London?'"
      };
    }

    setMessages(prev => [...prev, botResponse]);
    setInput('');
  };

  return (
    <div className="chatbot-container">
      <div className="chat-window">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about the weather..."
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default ChatBot;
