import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'منصة المراسلات المؤسسية الذكية | ASAAS AI Enterprise',
  description:
    'المنصة الداخلية الذكية لإنشاء وإدارة وإرسال المراسلات الرسمية بالذكاء الاصطناعي وفق الهوية البصرية لشركة أساس.',
  icons: {
    icon: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className="h-full">
      <body className="h-full bg-[#f8f6f0] text-[#221f1f] antialiased overflow-hidden">
        {children}
      </body>
    </html>
  );
}
