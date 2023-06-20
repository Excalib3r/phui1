// src/components/Header.js

import React, { useState } from 'react';
import {
  Box,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Button,
  List,
  ListItem,
  VStack,
  Text,
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import appwrite from '../appwrite';

function Header({ user, setUser, uploadedFiles }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleSignIn = async () => {
    try {
      const loggedInUser = await appwrite.account.createOAuth2Session('google');
      setUser(loggedInUser);
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await appwrite.account.deleteSession('current');
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" p={4}>
      <IconButton
        icon={<HamburgerIcon />}
        onClick={onOpen}
        aria-label="Open menu"
      />
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay>
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Uploaded Files</DrawerHeader>
            <DrawerBody>
              <List spacing={3}>
                {uploadedFiles.map((fileTitle, index) => (
                  <ListItem key={index}>{fileTitle}</ListItem>
                ))}
              </List>
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
      {user ? (
        <Button onClick={handleSignOut}>Sign Out</Button>
      ) : (
        <Button onClick={handleSignIn}>Sign In with Google</Button>
      )}
    </Box>
  );
}

export default Header;
