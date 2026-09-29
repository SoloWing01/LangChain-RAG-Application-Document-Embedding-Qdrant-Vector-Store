from app.rag.vectorstore import create_vector_store
from qdrant_client.models import Filter, FieldCondition, MatchValue

def get_retriever(session_id:str):
    vectorstore=create_vector_store()
    session_filter = Filter(
        must=[FieldCondition(key="metadata.session_id",
                match=MatchValue(value=session_id))]
                )
    retriever=vectorstore.as_retriever(search_type='mmr',search_kwargs={'k':4,'fetch_k':10,'lambda_mult':.5,"filter":session_filter})
    return retriever