# Parsing Information

### Resume
Due to default text chunking methods being too naive, it was unable to properly gather sufficient context to answer questions related to specific sections of the resume, for example, it might not chunk the "Work Experience" header together with the content, causing the disembodied work experience content to appear labelless, making it more difficult for the bot to recognise work experience as such. Therefore, since the resume was so short, I simply directly vectorised each section manually in PineconeDB.

#### LinkedIn

# RAG Bot

### Vector DB
PineconeDB

### Inference API
HuggingFace Inference API offers a free tier. I used llama-3.1-8b-Instruct