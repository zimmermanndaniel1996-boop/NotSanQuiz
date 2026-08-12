import "./globals.css";
import { StudentProvider } from "../context/StudentContext";
import PalLink from "../components/PalLink";

export const metadata = {
  title: "NotSan Quiz-Trainer",
  description: "Quiz-Trainer für Notfallsanitäter-Auszubildende",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f7f8fa",
};

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <body>
        <StudentProvider>{children}</StudentProvider>
        <PalLink />
      </body>
    </html>
  );
}
