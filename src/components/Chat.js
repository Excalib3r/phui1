import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  InputGroup,
  Input,
  InputRightAddon,
  VStack,
  Text,
  HStack,
} from '@chakra-ui/react';

function Chat({ pdfName, user }) {
  console.log('User object:', user);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (inputValue.trim()) {
      setMessages([...messages, { text: inputValue, type: 'user' }]);
      setInputValue('');
  
      // Send the query and PDF name to the back end
      const response = await fetch('https://YOUR_APPWRITE_ENDPOINT/v1/functions/644640904a4172005da0/tags/YOUR_TAG_ID/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Appwrite-Project': 'YOUR_PROJECT_ID',
          'X-Appwrite-Function-Secret': 'YOUR_FUNCTION_SECRET',
        },
        body: JSON.stringify({
          pdf_name: pdfName,
          user_id: user.uid,
          query: inputValue,
        }),
      });
  
      const data = await response.json();
  
      // Add the received response to the messages
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: data.result, type: 'chatgpt' },
      ]);
    }
  };

     

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <Box mt={4} h="40vh" w="100%" position="relative">
      <VStack
        spacing={2}
        align="stretch"
        overflowY="auto"
        h="100%"
        p={4}
        bg="gray.50"
        borderRadius="md"
        borderColor="gray.200"
        borderWidth={1}
      >
        {messages.map((message, index) => (
          <HStack
            key={index}
            alignSelf={message.type === 'user' ? 'flex-end' : 'flex-start'}
            borderRadius="md"
            p={2}
            bg={message.type === 'user' ? 'blue.500' : 'gray.300'}
            color={message.type === 'user' ? 'white' : 'black'}
            maxW="60%"
          >
            <Text>{message.text}</Text>
          </HStack>
        ))}
        <div ref={messagesEndRef} />
      </VStack>
      <InputGroup position="absolute" bottom={0} left={0} w="100%" p={4}>
        <Input
          borderRadius="md"
          placeholder="Type your message"
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleInputKeyPress}
        />
        <InputRightAddon
          as="button"
          borderRadius="md"
          children="Send"
          onClick={handleSendMessage}
        />
      </InputGroup>
    </Box>
  );
}

export default Chat;

