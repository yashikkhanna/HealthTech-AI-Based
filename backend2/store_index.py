import os
import logging
from dotenv import load_dotenv
from pinecone.grpc import PineconeGRPC as Pinecone
from langchain_pinecone import PineconeVectorStore
from src.helper import load_pdf_file, text_split, download_hugging_face_embeddings

# Setup logging
logging.basicConfig(
    level=logging.INFO,  # INFO shows progress, DEBUG shows more details
    format="%(asctime)s - %(levelname)s - %(message)s"
)

# Load env vars
load_dotenv()
PINECONE_API_KEY = os.environ.get('PINECONE_API_KEY')

# Initialize Pinecone client
logging.info("🔑 Connecting to Pinecone...")
pc = Pinecone(api_key=PINECONE_API_KEY)

# Use the name of the new index you created in Pinecone UI
index_name = "medibot"  # 👈 update this!

# Load and split PDFs
logging.info("📂 Loading PDFs from Data/ folder...")
extracted_data = load_pdf_file(data='Data/')
logging.info(f"✅ Loaded {len(extracted_data)} documents.")

logging.info("✂️ Splitting documents into chunks...")
text_chunks = text_split(extracted_data)
logging.info(f"✅ Split into {len(text_chunks)} chunks.")

# Load multilingual embeddings
logging.info("🔍 Loading multilingual embedding model...")
embeddings = download_hugging_face_embeddings()
logging.info("✅ Embeddings model loaded.")

# Store documents in Pinecone
logging.info(f"🚀 Uploading chunks to Pinecone index: {index_name}...")
docsearch = PineconeVectorStore.from_documents(
    documents=text_chunks,
    index_name=index_name,
    embedding=embeddings
)
logging.info("✅ Upload complete! All vectors stored in Pinecone.")
