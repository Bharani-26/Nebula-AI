import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";

import { IntroSequence } from "@/components/nebula/IntroSequence";
import { NebulaWorkspace } from "@/components/nebula/NebulaWorkspace";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nebula AI — Your Cosmic Conversation Companion" },
      {
        name: "description",
        content:
          "Nebula AI is a space-themed AI chat experience: cinematic intro, living cosmic backdrops, and a calm interface for exploring big questions.",
      },
      { property: "og:title", content: "Nebula AI — Your Cosmic Conversation Companion" },
      {
        property: "og:description",
        content:
          "Step through the portal into Nebula AI: a deep-space chat interface built for curious explorers.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [entered, setEntered] = useState(false);

  return (
    <AnimatePresence mode="wait">
      {entered ? (
        <NebulaWorkspace key="workspace" />
      ) : (
        <IntroSequence key="intro" onEnter={() => setEntered(true)} />
      )}
    </AnimatePresence>
  );
}
