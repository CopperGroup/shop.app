import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import StickyCart from "@/components/shared/StickyCart";
import Provider from "../Provider";
import { AppWrapper } from "./context";
import CartPage from "@/components/shared/CartPage";
import { SpeedInsights } from "@vercel/speed-insights/next"
import BannerHero from "@/components/banner/BannerHero";
import { getSession } from "@/lib/getServerSession";
import { fetchUserByEmail } from "@/lib/actions/user.actions";
import { FacebookPixel } from "@/components/pixel";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Santehvan shop",
  description: "Your's best bathroom advisor",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const email = await getSession();

  const user = await fetchUserByEmail(email);
  return (
      <html lang="en">
        <body className={inter.className}>
          <FacebookPixel />
          <Provider>
              <Header email={email} user={JSON.stringify(user)}/>
              <AppWrapper>
                <main className = "main-container">
                  <div className = "w-full max-w-[1680px] px-5">
                    {children}
                 </div>
                </main>
                <StickyCart/>
            </AppWrapper>
          <Footer/>
          </Provider>
          <SpeedInsights/>
        </body>
      </html>
  );
}