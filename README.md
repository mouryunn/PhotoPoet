
# PhotoPoet

**PhotoPoet** is an elegant, AI-powered web application that turns your photos into unique, beautiful poems. Built with Next.js, React, and Tailwind CSS, the application leverages local AI infrastructure using Google's Genkit framework and the lightweight [Ollama](https://ollama.com/) `gemma3:4b` model to examine photo uploads and magically craft poetry that captures the image's essence, emotions, and key elements.

## Features
- **Local AI Inference**: Powered by Ollama (`gemma3:4b`) running entirely locally for complete privacy and cost-free execution.
- **Image-to-Poetry Generation**: Upload any image and watch the AI interpret the visual data to construct a creative poem.
- **Customizable Mood and Language**: Request poems in specific languages and tone/moods that reflect your artistic vision.
- **Beautiful UI/UX**: Responsive, modern interface built utilizing `shadcn/ui` components and Tailwind CSS styling.
- **Export & Share**: Easily copy the generated poem, download it as a stylish image tile, or share it using your device's native sharing capabilities.

## Tech Stack
- **Frontend**: Next.js 15 (Turbopack), React 18
- **Styling**: Tailwind CSS, Shadcn UI, Radix Primitives
- **AI Framework**: Google Genkit (`genkitx-ollama`)
- **LLM**: Local Ollama (`gemma3:4b`)

## Getting Started

### Prerequisites
1. **Node.js**: (Version 20 or higher recommended)
2. **Ollama**: You must have [Ollama](https://ollama.com/) installed and running locally.
3. **Model**: Pull the `gemma3:4b` model into your local instance:
   ```bash
   ollama run gemma3:4b
   ```

### Installation
1. Clone this repository:
   ```bash
   git clone https://github.com/mouryunn/PhotoPoet.git
   cd PhotoPoet
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the App
1. Start your local Ollama server if it isn't running automatically (usually runs in the background).
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open your browser and navigate to `http://localhost:3000`.

## Usage
- Click the upload area or drag and drop a beautiful photo.
- Adjust the desired poem language and mood from the options provided.
- Click **"Generate Poem"**.
- View, copy, share, or download your newly generated poem tile!
