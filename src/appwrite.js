import { Client } from 'appwrite';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';
import { getStorage, ref, listAll, deleteObject, uploadBytes, getDownloadURL } from 'firebase/storage';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/storage';


const appwrite = new Client();
appwrite
  .setEndpoint('http://localhost/v1')
  .setProject('644605b9d9be8c64297e');

const firebaseConfig = {
    apiKey: "AIzaSyAARokq76YXk5583gZLzlrC3o9lm8l4Hpc",
    authDomain: "pdfchat-fde96.firebaseapp.com",
    projectId: "pdfchat-fde96",
    storageBucket: "pdfchat-fde96.appspot.com",
    messagingSenderId: "200113146086",
    appId: "1:200113146086:web:a311566c07dfbc1c851327",
    measurementId: "G-X1LDDJV3ZW"
};

firebase.initializeApp(firebaseConfig);

const auth = getAuth();
const provider = new GoogleAuthProvider();
const storage = getStorage();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error(error);
  }
};

export async function uploadFile(file, path, user) {
  // Delete any existing PDF for the user
  const existingFileRef = ref(storage, `pdfs/${user.uid}`);
  try {
    const existingFiles = await listAll(existingFileRef);
    for (const existingFile of existingFiles.items) {
      await deleteObject(existingFile);
    }
  } catch (error) {
    console.error('Error deleting existing file(s):', error);
  }

  // Upload the new PDF
  const fileRef = ref(storage, path);
  await uploadBytes(fileRef, file);
  return await getDownloadURL(fileRef);
}

export default appwrite;


