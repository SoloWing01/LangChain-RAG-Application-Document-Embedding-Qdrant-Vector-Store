from langchain_text_splitters import RecursiveCharacterTextSplitter

def split_documents(docs:list,chunk_size:int,chunk_overlapping:int)->list:
    splitter=RecursiveCharacterTextSplitter(chunk_size=chunk_size,chunk_overlapping=chunk_overlapping)
    chunk=splitter.split_documents(docs)
    return chunk