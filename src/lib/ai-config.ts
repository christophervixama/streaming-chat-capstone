/**
 * Central AI configuration for the streaming chat feature.
 *
 * This module keeps the model choice and system prompt in one place
 * so they can be easily reviewed, updated, or extended later (e.g. for FE-07).
 */

import { groq } from "@ai-sdk/groq";

/**
 * Model configuration
 * -------------------
 * We use Groq because it offers a free tier with very fast streaming,
 * which is ideal for demonstrating token-by-token responses.
 *
 * You can swap the model ID below without touching any other file.
 */
export const MODEL_CONFIG = {
  // Fast and capable free model on Groq
  model: groq("llama-3.3-70b-versatile"),

  // Slight creativity while staying focused
  temperature: 0.7,
} as const;

/**
 * System prompt
 * -------------
 * Guides the assistant to be professional, clear, and structured.
 * This is the single source of truth for the AI's personality and style.
 */
export const SYSTEM_PROMPT = `You are a helpful, professional AI assistant for a capstone application. 
Provide clear, structured, and informative responses. Use Markdown formatting when appropriate.`;