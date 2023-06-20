// src/App.js

import React, { useState, useEffect } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import Layout from './components/Layout';
import Header from './components/Header'; // Import the Header component

function App() {
  const [user, setUser] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <ChakraProvider>
      <Header
        user={user}
        setUser={setUser}
        uploadedFiles={uploadedFiles}
      />
      <Layout
        user={user}
        onFileUploaded={(fileName) =>
          setUploadedFiles((prevFiles) => [...prevFiles, fileName])
        }
      />
    </ChakraProvider>
  );
}

export default App;


