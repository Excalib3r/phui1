import React, { useRef, useState } from 'react';
import { Box, Text, Button, VStack } from '@chakra-ui/react';
import { signInWithGoogle, uploadFile } from '../appwrite'; // Update the import statement

function DragDrop({ user, onFileUploaded }) {
  const fileInputRef = useRef(null);
  const [uploadedFileName, setUploadedFileName] = useState('');

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e) => {
    e.preventDefault();

    if (!user) {
      // Show the sign-in popup if the user is not logged in
      signInWithGoogle();
      return;
    }

    const files = e.dataTransfer.files;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type === 'application/pdf') {
        const fileURL = await uploadFile(file, `pdfs/${user.uid}/${file.name}`, user); // Update the function call
        console.log('File uploaded:', fileURL);
        setUploadedFileName(file.name);
      }
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileURL = await uploadFile(file, `pdfs/${user.uid}/${file.name}`, user); // Update the function call
      console.log('File uploaded:', fileURL);
      onFileUploaded(file.name); // Call the callback with the file title
      setUploadedFileName(file.name);
    }
  };

  const handleClick = () => {
    if (!user) {
      // Show the sign-in popup if the user is not logged in
      signInWithGoogle();
      return;
    }

    fileInputRef.current.click();
  };

  return (
    <VStack spacing={4}>
      <Box
        w="100%"
        h="50vh"
        border="2px dashed"
        borderColor="gray.200"
        borderRadius="md"
        display="flex"
        alignItems="center"
        justifyContent="center"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <Text>Drag and drop PDF files here</Text>
      </Box>
      {uploadedFileName && (
        <Text>Uploaded file: {uploadedFileName}</Text>
      )}
      <input
        type="file"
        accept=".pdf"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileUpload}
      />
      <Button onClick={handleClick}>Upload PDF</Button>
    </VStack>
  );
}

export default DragDrop;






