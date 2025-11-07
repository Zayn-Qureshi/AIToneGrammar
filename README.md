AI Writing Assistant
Overview
This is an AI-powered writing assistant application that provides real-time grammar checking and tone analysis. The application features a clean, distraction-free interface where users can input text and receive instant feedback on grammar errors and writing tone. Built with a modern stack featuring React on the frontend and Express on the backend, it integrates with external APIs (LanguageTool for grammar checking and Hugging Face for tone detection) to provide intelligent writing assistance.

Current Status: ✅ Fully functional and tested

Grammar checking with interactive error highlights and suggestions
Tone detection with visual confidence indicator
Copy corrected text to clipboard
Light/dark theme support
Real-time text statistics (words, characters, errors)
User Preferences
Preferred communication style: Simple, everyday language.

System Architecture
Frontend Architecture
Framework & Build System

React 18 with TypeScript for type-safe component development
Vite as the build tool and development server for fast HMR and optimized production builds
Wouter for lightweight client-side routing
UI Component System

shadcn/ui components built on Radix UI primitives for accessible, customizable interface elements
Tailwind CSS with custom design tokens for consistent styling following the "new-york" style
CSS variables for theming with light/dark mode support
Custom design system following productivity tool aesthetics (Notion, Grammarly, Linear-inspired)
State Management

TanStack Query (React Query) for server state management, caching, and API request handling
Local React state for UI-specific state (text input, error highlights, theme preferences)
Custom hooks for reusable logic (useToast, useIsMobile)
Key Frontend Features

Real-time grammar error highlighting with overlay technique (synchronized scrolling between textarea and error overlay)
Interactive error correction through popovers showing replacement suggestions
Tone analysis visualization with confidence bars and badge indicators
Text statistics (word count, character count, error count)
Copy-to-clipboard functionality for corrected text
Theme toggle with localStorage persistence
Backend Architecture
Server Framework

Express.js for HTTP server with middleware-based request handling
TypeScript for type safety across the stack
Custom logging middleware for API request monitoring
API Design

RESTful endpoint (POST /api/check) for text analysis
Zod schema validation for request/response type safety
Concurrent API calls using Promise.all for grammar and tone analysis
Centralized error handling with appropriate HTTP status codes
Data Processing

Grammar correction application logic that patches original text with suggested fixes
Response transformation to normalize external API data into consistent internal schemas
Database & Storage
Current Implementation

In-memory storage using Map-based implementation (MemStorage class)
User model with basic CRUD operations defined but not actively used
Storage interface designed for future database migration
Database Configuration

Drizzle ORM configured with PostgreSQL dialect
Schema definitions ready in shared/schema.ts
Database URL environment variable support
Migration system configured but not yet applied
Design Decision: The application currently uses in-memory storage as a lightweight solution. The architecture includes abstractions (IStorage interface) to enable seamless migration to persistent database storage when needed for user data, history, or preferences.

External Dependencies
Third-Party APIs

LanguageTool API (https://api.languagetool.org/v2/check): Free grammar and spell-checking service that analyzes text and returns corrections with context, categories, and replacement suggestions
Hugging Face API (j-hartmann/emotion-english-distilroberta-base): Sentiment/tone analysis model that classifies text into emotional tones with confidence scores. Gracefully falls back to "Neutral" tone when the API returns 410 (model loading) or if the HUGGINGFACE_API_KEY is not configured
UI Component Libraries

Radix UI: Headless accessible components (@radix-ui/react-*) for dialogs, popovers, dropdowns, tooltips, and other interactive elements
shadcn/ui: Pre-styled component compositions built on Radix UI following the new-york style variant
Utility Libraries

axios: HTTP client for external API requests with better error handling than fetch
clsx & tailwind-merge: Conditional className composition and Tailwind class conflict resolution
class-variance-authority (cva): Type-safe component variant styling
date-fns: Date manipulation utilities
nanoid: Unique ID generation
zod: Runtime type validation and schema definition
Development Tools

Replit-specific plugins: Vite plugins for cartographer, dev banner, and runtime error overlay
TypeScript: Full-stack type safety with path aliases (@/, @shared/, @assets/)
ESBuild: Fast production bundling for the server
Font Resources

Google Fonts: Inter (UI text) and JetBrains Mono (editor/code text) for professional typography
Database (Configured but Not Active)

@neondatabase/serverless: Serverless Postgres driver
Drizzle ORM: Type-safe SQL query builder and schema management
connect-pg-simple: PostgreSQL session store (for future authentication
