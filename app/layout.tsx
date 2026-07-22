import "./globals.css";
export const metadata = { title: "Weather Dashboard Pro", description: "Real-time weather with forecasts and analytics" };
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="en"><body className="font-sans antialiased">{children}</body></html>; }