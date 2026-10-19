// MES 화면. 직무마다 지정된 페이지만 열고, 관리자는 사원의 직무와 담당 설비를 정한다.
import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_KR } from "next/font/google";
import { AppShell } from "@/components/AppShell";
import { getMe } from "@/lib/api";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoSansKr = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "정밀가공 공장 MES",
  description: "부품/설비 가공 공장 MES 1단계 뼈대",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const user = await getMe();
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} ${notoSansKr.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <AppShell user={user}>{children}</AppShell>
      </body>
    </html>
  );
}
