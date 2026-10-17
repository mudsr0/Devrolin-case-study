import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";

export const metadata = {
  title: {
    default: 'Mudassir H. | CRM Automation & AI Systems Expert',
    template: '%s | Mudassir H.',
  },
  description:
    'COO & Co-founder of DevRolin. I build custom AI SaaS platforms, CRM automations, and high-converting websites. 40+ systems deployed globally.',
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className="dark h-full antialiased"
    >
      <body className="min-h-full flex flex-col">
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
