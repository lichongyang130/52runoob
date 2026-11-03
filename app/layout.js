import "./globals.css";

export const metadata = {
  title: {
    default: "howcompass — How to do anything",
    template: "%s | howcompass",
  },
  description:
    "howcompass is the world's how-to manual. Learn how to cook, garden, play guitar, save money, train a puppy, and just about anything else — step by step, with pictures.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
