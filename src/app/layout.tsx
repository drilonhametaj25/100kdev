// Root layout minimale - il vero layout è in [lang]/layout.tsx
// Necessario per Next.js ma i contenuti principali sono nel layout localizzato

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
