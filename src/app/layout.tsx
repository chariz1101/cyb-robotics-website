import type { Metadata } from "next";
import { Bebas_Neue, Montserrat } from "next/font/google";
import "./globals.css";

/**
 * Bebas Neue is published in a single weight (400). There is no Bold cut,
 * so `font-bold` on a Bebas heading would only ask the browser to
 * synthesise one, which smears the letterforms. Headings carry weight
 * through size and the face's own condensed density instead.
 */
const bebasNeue = Bebas_Neue({
  variable: "--font-bebas",
  weight: "400",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Cyb Robotics Organization",
    template: "%s · Cyb Robotics",
  },
  description:
    "The robotics organization of the College of Information and Communications Technology, West Visayas State University.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${bebasNeue.variable} ${montserrat.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-canvas">{children}</body>
    </html>
  );
}
