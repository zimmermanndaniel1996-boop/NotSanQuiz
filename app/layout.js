import "./globals.css";
import { StudentProvider } from "../context/StudentContext";
import PalLink from "../components/PalLink";
import EcgBanner from "../components/EcgBanner";

export const metadata = {
  title: "NotSan Quiz-Trainer",
  description: "Quiz-Trainer für Notfallsanitäter-Auszubildende",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#050d1a",
};

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <body>
        <EcgBanner />
        <StudentProvider>{children}</StudentProvider>
        <PalLink />
      </body>
    </html>
  );
}
