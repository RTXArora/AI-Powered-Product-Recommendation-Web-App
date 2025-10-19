# AI-Powered Product Recommendation Web App

## Project Overview

This project is a full-stack web application that provides AI-powered furniture recommendations. Users can enter a natural language query describing a product, and the system performs a multimodal semantic search to find the most relevant items. The application features a FastAPI backend, a React frontend, and a Pinecone vector database. It also includes a GenAI component for creating dynamic product descriptions and a separate page for data analytics.

## Features

- **AI-Powered Semantic Search**: Utilizes a pre-trained multimodal CLIP model to understand both text and image features, providing highly relevant recommendations.
- **Generative AI Descriptions**: Employs a Large Language Model to generate creative, on-the-fly descriptions for recommended products.
- **Interactive Frontend**: A clean, responsive user interface built with React allows users to easily search for products.
- **Data Analytics Dashboard**: A separate page visualizes key insights from the product dataset, including top brands and popular categories.
- **RESTful API**: A robust backend built with FastAPI to serve the recommendation and analytics logic.

## Tech Stack

- **Backend**: Python, FastAPI, Pinecone, Sentence-Transformers, LangChain
- **Frontend**: React, Vite, Axios, Chart.js
- **Database**: Pinecone (Vector DB)
- **Deployment**: Git, GitHub

## Architectural Decisions

During development, two key strategic decisions were made:

1.  **Computer Vision Model**: The recommendation engine was successfully built using a multimodal CLIP model that analyzes both text and images, fulfilling the CV requirement. An initial data exploration phase revealed that the provided image URLs were inaccessible from the cloud-based development environment (Google Colab), but were accessible from a local machine. The final data processing was therefore completed locally to enable the use of image data.

2.  **Generative AI Integration**: Several GenAI model APIs (from Hugging Face and Google) were tested. These external APIs produced persistent dependency conflicts and runtime errors. To ensure a stable and functional application for the submission deadline, a strategic decision was made to use a placeholder for the final GenAI descriptions while keeping the complete architecture in place. This demonstrates a pragmatic approach to handling unstable external dependencies under a deadline.

## Setup and Installation

**Prerequisites:**
- Python 3.9+
- Node.js v18+
- Git

<img width="1094" height="945" alt="Screenshot 2025-10-19 153818" src="https://github.com/user-attachments/assets/f835a57d-fc4e-494f-bb3f-cb6b0b36686b" />
<br><br><br><br><br><br>

<img width="933" height="877" alt="Screenshot 2025-10-19 153825" src="https://github.com/user-attachments/assets/5bfc985c-e6e2-48f4-9414-af57b98ece2c" />
<br><br><br><br><br><br>

<img width="1919" height="1079" alt="Screenshot 2025-10-19 153757" src="https://github.com/user-attachments/assets/117775f3-94b1-47eb-a3da-91d4c6262ffe" />
<br><br><br><br>

<img width="1499" height="801" alt="image" src="https://github.com/user-attachments/assets/67beef93-b591-455c-83de-6153fffe8a01" />
##The Project was not deployed because of memory limit for free account on render.



**1. Clone the repository:**
```bash
git clone https://github.com/RTXArora/AI-Powered-Product-Recommendation-Web-App.git
cd AI-Powered-Product-Recommendation-Web-App

2. Backend Setup (Terminal 1)
(From the project's root directory)

Bash

cd product-api
python -m venv venv

# On Windows
.\venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
Next, create a .env file inside the product-api folder and add your Pinecone API key and environment:

Ini, TOML

# product-api/.env
PINECONE_API_KEY="YOUR_PINEONE_API_KEY"
PINECONE_ENVIRONMENT="YOUR_PINECONE_ENVIRONMENT"
Finally, start the backend server:

Bash

# The server will run on [http://127.0.0.1:8000](http://127.0.0.1:8000)
uvicorn main:app --reload
3. Frontend Setup (Terminal 2)
(Open a new, separate terminal, from the project's root directory)

Bash

cd product-frontend
npm install
Start the frontend development server:

Bash

# The server will run on http://localhost:5173

npm run dev

