"use client";

import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: "#2D1B4E", // brand-plum
          color: "#FAF7F0", // brand-bone
          border: "2px solid #D4AF37", // brand-gold
          padding: "16px",
          fontFamily: "var(--font-space-grotesk)",
          fontWeight: "600",
        },
        success: {
          iconTheme: {
            primary: "#D4AF37", // brand-gold
            secondary: "#FAF7F0", // brand-bone
          },
        },
        error: {
          iconTheme: {
            primary: "#EF4444", // red
            secondary: "#FAF7F0", // brand-bone
          },
        },
      }}
    />
  );
}
