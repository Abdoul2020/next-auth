import "./globals.css";
import ClientProviders from "./providers/ClientProviders";

export const metadata = {
  title: "Front-End Task",
  description: "Next-Auth Front-End Kayseri",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
