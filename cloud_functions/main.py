import json
from appwrite.client import Client
from appwrite.services.storage import Storage
from PyPDF2 import PdfFileReader

# Initialize the Appwrite Client
client = Client()
client.set_endpoint('http://localhost/v1')
client.set_project('644605b9d9be8c64297e')
client.set_key('835d4d6aa354d8ee020765397e7aa9195fe370f89a1fc00241a72b55300043dd78baac0328860493b7c51f33c59a2b6eb7da07a01b85478e429e5e4c404865ecb6774b45dc599302fb20acaf22c3a1cc5a9eace8ebf1accdafe32635ad3401fc9833f161b6bb93453bc61beab8b03f86deee4b5c608caeecdc2299ed9868dd5c')

# Initialize the Appwrite Storage Service
storage = Storage(client)

def get_pdf_text(file_path):
    pdf_reader = PdfFileReader(file_path)
    text = ""
    for page_num in range(pdf_reader.getNumPages()):
        text += pdf_reader.getPage(page_num).extract_text()
    return text

def main(request):
    payload = json.loads(request.body)
    pdf_name = payload['pdf_name']
    user_id = payload['user_id']
    query = payload['query']

    # Get the PDF file from Appwrite Storage
    file_id = ''
    file_list = storage.list_files(user_id).get('files', [])
    for file in file_list:
        if file['name'] == pdf_name:
            file_id = file['$id']
            break

    if not file_id:
        return {
            'status': 404,
            'message': 'PDF not found'
        }

    # Download the PDF
    pdf_file = storage.get_file_preview(file_id)
    with open('/tmp/pdf_file.pdf', 'wb') as f:
        f.write(pdf_file)

    # Extract the text from the PDF
    text = get_pdf_text('/tmp/pdf_file.pdf')

    # Process the query and return the result
    result = 'Response to query "{}" for PDF "{}": {}'.format(query, pdf_name, text)

    return {
        'status': 200,
        'result': result
    }