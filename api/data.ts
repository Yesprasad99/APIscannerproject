export type Row = {
  id: string;
  name: string;
  category?: string;
  description?: string;
  website?: string;
};

export const APIS: Row[] = [
  // --- APIs ---
  { id: "openai", name: "OpenAI API", category: "AI", description: "Access GPT models for text, vision, and embeddings.", website: "https://platform.openai.com" },
  { id: "anthropic", name: "Anthropic Claude API", category: "AI", description: "Claude conversational AI models.", website: "https://www.anthropic.com" },
  { id: "stabilityai", name: "Stability AI API", category: "AI", description: "Text-to-image generation (Stable Diffusion).", website: "https://platform.stability.ai" },
  { id: "replicate", name: "Replicate API", category: "AI", description: "Run open-source AI models via API.", website: "https://replicate.com" },
  { id: "huggingface", name: "Hugging Face Inference", category: "AI", description: "Host and call ML models with REST API.", website: "https://huggingface.co/inference" },
  { id: "pinecone", name: "Pinecone", category: "Vector DB", description: "Vector database for semantic search and RAG.", website: "https://www.pinecone.io" },
  { id: "weaviate", name: "Weaviate", category: "Vector DB", description: "Open-source vector search engine.", website: "https://weaviate.io" },
  { id: "qdrant", name: "Qdrant", category: "Vector DB", description: "High-performance vector database.", website: "https://qdrant.tech" },
  { id: "cohere", name: "Cohere API", category: "AI", description: "Text generation and embeddings.", website: "https://cohere.com" },
  { id: "ai21", name: "AI21 Studio API", category: "AI", description: "Language models for text tasks.", website: "https://www.ai21.com/studio" },
  { id: "googleai", name: "Google Gemini API", category: "AI", description: "Google’s multimodal Gemini models.", website: "https://ai.google.dev" },
  { id: "mistral", name: "Mistral API", category: "AI", description: "Efficient open-weight LLMs with hosted API.", website: "https://mistral.ai" },
  { id: "groq", name: "Groq API", category: "AI Infra", description: "Ultra-fast inference on Groq hardware.", website: "https://groq.com" },
  { id: "assemblyai", name: "AssemblyAI API", category: "Speech", description: "Speech-to-text and audio AI.", website: "https://www.assemblyai.com" },
  { id: "deepgram", name: "Deepgram API", category: "Speech", description: "Speech recognition and transcription.", website: "https://deepgram.com" },
  { id: "elevenlabs", name: "ElevenLabs API", category: "Speech", description: "Text-to-speech voices.", website: "https://elevenlabs.io" },
  { id: "twilio", name: "Twilio API", category: "Comms", description: "SMS, voice, and WhatsApp APIs.", website: "https://www.twilio.com" },
  { id: "stripe", name: "Stripe API", category: "Payments", description: "Payments, billing, and checkout.", website: "https://stripe.com" },
  { id: "notion", name: "Notion API", category: "Productivity", description: "Integrate with Notion workspaces.", website: "https://developers.notion.com" },
  { id: "slack", name: "Slack API", category: "Productivity", description: "Build apps and bots for Slack.", website: "https://api.slack.com" },

  // --- Businesses ---
  { id: "openai_inc", name: "OpenAI", category: "AI Company", description: "Makers of ChatGPT and GPT models.", website: "https://openai.com" },
  { id: "anthropic_inc", name: "Anthropic", category: "AI Company", description: "Creators of Claude AI.", website: "https://www.anthropic.com" },
  { id: "stability_inc", name: "Stability AI", category: "AI Company", description: "Makers of Stable Diffusion.", website: "https://stability.ai" },
  { id: "huggingface_inc", name: "Hugging Face", category: "AI Company", description: "Community and platform for ML models.", website: "https://huggingface.co" },
  { id: "cohere_inc", name: "Cohere", category: "AI Company", description: "Language models for enterprise.", website: "https://cohere.com" },
  { id: "ai21_inc", name: "AI21 Labs", category: "AI Company", description: "NLP research and APIs.", website: "https://www.ai21.com" },
  { id: "googleai_inc", name: "Google DeepMind", category: "AI Company", description: "Pioneering AI research and Gemini.", website: "https://deepmind.google" },
  { id: "mistral_inc", name: "Mistral AI", category: "AI Company", description: "Open-weight models and APIs.", website: "https://mistral.ai" },
  { id: "perplexity_inc", name: "Perplexity AI", category: "AI Company", description: "AI-powered search engine.", website: "https://perplexity.ai" },
  { id: "runway_inc", name: "Runway", category: "AI Company", description: "Creative AI tools for video and image.", website: "https://runwayml.com" },
  { id: "midjourney_inc", name: "MidJourney", category: "AI Company", description: "Independent AI art lab.", website: "https://www.midjourney.com" },
  { id: "characterai_inc", name: "Character.AI", category: "AI Company", description: "AI chat characters platform.", website: "https://character.ai" },
  { id: "replit_inc", name: "Replit", category: "DevTools", description: "Collaborative coding + AI tools.", website: "https://replit.com" },
  { id: "databricks_inc", name: "Databricks", category: "Data + AI", description: "Data lakehouse with AI tooling.", website: "https://databricks.com" },
  { id: "snowflake_inc", name: "Snowflake", category: "Data + AI", description: "Cloud data warehouse + AI integrations.", website: "https://snowflake.com" },
  { id: "nvidia_inc", name: "NVIDIA", category: "AI Hardware", description: "GPUs powering AI workloads.", website: "https://nvidia.com" },
  { id: "intel_inc", name: "Intel", category: "AI Hardware", description: "AI accelerators and CPUs.", website: "https://intel.com" },
  { id: "meta_inc", name: "Meta AI", category: "AI Research", description: "Makers of LLaMA models.", website: "https://ai.meta.com" },
  { id: "microsoft_inc", name: "Microsoft AI", category: "AI Company", description: "Azure AI + Copilot integrations.", website: "https://azure.microsoft.com" },
  { id: "amazon_inc", name: "AWS AI", category: "AI Company", description: "AI and ML services on AWS.", website: "https://aws.amazon.com/ai" }
];
