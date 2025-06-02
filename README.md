# 🤖 ChatBot for Natural Language Generation (NLG)

This project is a chatbot interface powered by an NLG backend (running models like **BLIP** and **TinyLlama**). It supports both **text and image input**, and generates human-like blog/story responses.

---

## 🚀 Getting Started

### 1. Run the Backend

Open `FinalProject.ipynb` in **Google Colab** and run all cells.

This will:
- Load the required models
- Launch the backend using **Flask**
- Create a public endpoint using **ngrok**

> 🔐 **Important:** Before starting ngrok, you must set your **ngrok auth token**.

#### Set ngrok Token

1. Sign up at [https://ngrok.com](https://ngrok.com) to get your auth token.
2. In a Colab cell, run:

   ```python
   !ngrok config add-authtoken YOUR_NGROK_AUTH_TOKEN
   ```

   Replace `YOUR_NGROK_AUTH_TOKEN` with your actual key.

After setup, ngrok will generate a public URL like:

```
 * Running on http://127.0.0.1:5000
 * Ngrok Tunnel: https://abc123.ngrok.io
```

---

### 2. Configure the Frontend

In your frontend project, create or update the `.env` file:

```env
VITE_BACKEND_URL=https://abc123.ngrok.io
```

Replace the URL with the actual one from your Colab output.

---

## 📦 Features

- Chat interface with story/blog generation
- Image + text input support
- React + Vite frontend
- Flask + ngrok backend

---

## 🧠 Models Used

- **BLIP**: For image captioning
- **TinyLlama**: For story/blog-style generation

---

## 📂 Project Structure

```
/frontend     # React app using Vite
/backend      # Jupyter Notebook running Flask via Colab
```

---
\
