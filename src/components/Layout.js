import React, { useState } from 'react';
import Header from './Header';
import DragDrop from './DragDrop';
import Chat from './Chat';

function Layout({ user, setUser }) {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [pdfName, setPdfName] = useState('');

  const addUploadedFile = (title) => {
    setUploadedFiles((prevFiles) => [...prevFiles, title]);
    setPdfName(title);
  };

  return (
    <div>
      <DragDrop user={user} onFileUploaded={addUploadedFile} />
      <Chat user={user} pdfName={pdfName} />
    </div>
  );
}

export default Layout;



