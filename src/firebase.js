import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/storage';

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

const provider = new firebase.auth.GoogleAuthProvider();


export const signInWithGoogle = async () => {
  try {
    const result = await firebase.auth().signInWithPopup(provider);
    return result.user;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const signOut = async () => {
  try {
    await firebase.auth().signOut();
  } catch (error) {
    console.error(error);
  }
};

export async function uploadFile(file, path, user) {
  // Delete any existing PDF for the user
  const existingFileRef = storage.ref().child(`pdfs/${user.uid}`);
  try {
    const existingFiles = await existingFileRef.listAll();
    for (const existingFile of existingFiles.items) {
      await existingFile.delete();
    }
  } catch (error) {
    console.error('Error deleting existing file(s):', error);
  }

  // Upload the new PDF
  const fileRef = storage.ref().child(path);
  await fileRef.put(file);
  return await fileRef.getDownloadURL();
}


export const storage = firebase.storage();