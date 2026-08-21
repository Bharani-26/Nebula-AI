# Nebula's Gateway

Build a standalone, visual-first space-themed web application for "Nebula AI" using React, Tailwind CSS, and Framer Motion. Focus purely on UI/UX, layouts, and animations using mock data for now.

### 1. Slow Cinematic 7-Second Intro

- Start with a full-screen, slow-motion space video or ultra-smooth particle cosmos animation with a gentle zoom-in (Ken Burns effect).

- Title overlay: "NEBULA AI" revealing slowly with a soft cosmic ambient glow.

- The 7-second countdown should feel dramatic and deliberate, accompanied by a subtle progress bar at the bottom and a small "Skip Intro" button.

- At the 7-second mark, smoothly fade in a glowing primary action button: "**ACCESS THE NEBULA AI**".

- Clicking the button triggers a slow 1.5-second portal-style warp/fade transition into the main interface.

### 2. Auto-Rotating Cosmic Background

- The background of the main chat page automatically cycles through high-res deep-space imagery (nebulae, star clusters, galaxies) every 10 seconds with a long, elegant 2-second cross-fade.

- Apply a dark gradient overlay (black/deep indigo with subtle blur) over the background so text and chat elements remain crisp and legible.

### 3. Gemini-Style Layout & Structure

- **Left Navigation Drawer:** Collapsible sidebar featuring a "New Chat" button, a list of dummy past chats, and user profile controls at the bottom.

- **Hero State (New Chat):** Central greeting ("Where to next, explorer?") alongside 4 interactive prompt suggestion cards with cosmic hover borders.

- **Chat Feed:** User messages right-aligned, Nebula AI responses left-aligned with a glowing starlight icon.

- **Floating Input Bar:** Bottom-anchored rounded input container with attachment, voice, and send action buttons.

### 4. Interactive UI Mock Logic

- Simulate message sending: when a user sends a message, trigger a brief "Nebula is thinking..." starlight loading animation before rendering a mock AI response.

- Keep all state localized in a React hook (`useChatStore.ts`) so an API connection can be plugged in seamlessly later.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/fc61f6d6-7327-49df-a0b2-fe6e87a5f255).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
