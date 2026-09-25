from langchain_community.document_loaders import PyPDFLoader,Docx2txtLoader

def load_document(filePath:str)->str:
    if filePath.endswith('.pdf'):
        loader=PyPDFLoader(filePath)
    elif filePath.endswith('.doc'):
        loader=Docx2txtLoader(filePath)
    elif filePath.endswith('.docx'):
        loader=Docx2txtLoader(filePath)
    else:
        raise ValueError('Unsupported file type')
    return loader.load()