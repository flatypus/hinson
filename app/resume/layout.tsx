import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hinson_Chan_Resume",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
