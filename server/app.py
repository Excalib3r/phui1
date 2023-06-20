import os
import firebase_admin
from firebase_admin import credentials, storage
from flask import Flask, request, jsonify
from langchain.document_loaders import UnstructuredPDFLoader, OnlinePDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores import Chroma, Pinecone
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.llms import OpenAI
from langchain.chains.question_answering import load_qa_chain
import pinecone
from flask_cors import CORS

# Initialize Firebase Admin SDK
cred = credentials.Certificate('./serviceAccountKey.json')
firebase_admin.initialize_app(cred, {
    'storageBucket': 'pdfchat-fde96.appspot.com'
})
bucket = storage.bucket()

app = Flask(__name__)
CORS(app) 

def download_pdf(user_id, pdf_name):
    pdf_path = f"pdfs/{user_id}/{pdf_name}"
    blob = bucket.blob(pdf_path)
    local_file_path = f"temp/{pdf_name}"
    blob.download_to_filename(local_file_path)
    return local_file_path

@app.route('/process_pdf', methods=['POST'])
def process_pdf():
    data = request.json
    print(data)
    pdf_name = data['pdf_name']
    user_id = data['user_id']  # Add this line to get the user_id from the request
    local_file_path = download_pdf(user_id, pdf_name)
    query = data['query']

    # Process the PDF
    loader = UnstructuredPDFLoader(local_file_path)
    data = loader.load()
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
    texts = text_splitter.split_documents(data)

    # Set up Pinecone
    OPENAI_API_KEY = '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'
    PINECONE_API_KEY = '0ceb9671-30dc-4eea-89c8-d0d6c5765fe4'
    PINECONE_API_ENV = 'us-central1-gcp'

    embeddings = OpenAIEmbeddings(openai_api_key=OPENAI_API_KEY)
    pinecone.init(api_key=PINECONE_API_KEY, environment=PINECONE_API_ENV)
    index_name = "id1"
    docsearch = Pinecone.from_texts([t.page_content for t in texts], embeddings, index_name=index_name)

    # Perform the search
    llm = OpenAI(temperature=0, openai_api_key=OPENAI_API_KEY, model="text-davinci-002")
    chain = load_qa_chain(llm, chain_type="stuff")
    docs = docsearch.similarity_search(query, include_metadata=True)
    result = chain.run(input_documents=docs, question=query)

    response = {
        'result': result,  # Replace with the actual result
    }

    # Clean up the local downloaded file
    os.remove(local_file_path)

    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True)
