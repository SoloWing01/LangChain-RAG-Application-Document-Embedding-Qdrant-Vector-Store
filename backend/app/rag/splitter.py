from langchain_text_splitters import RecursiveCharacterTextSplitter

def split_documents(docs:list,chunk_size:int,chunk_overlap:int)->list:
    splitter=RecursiveCharacterTextSplitter(chunk_size=chunk_size,chunk_overlap=chunk_overlap)
    chunk=splitter.split_documents(docs)
    return chunk