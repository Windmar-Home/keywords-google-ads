export const metadata = {
  title: "Windmar · Ads Intelligence Dashboard",
  description: "Monitoreo semanal de calidad de keywords y anuncios",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body style={{ margin: 0, padding: 0, background: "#0F0F10" }}>{children}</body>
    </html>
  );
}
