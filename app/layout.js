
import { Toaster } from "react-hot-toast";
import ConvexClientProvider from "./ConvexClientProvider";
import "./globals.css";
import Provider from "./provider";
import AppSideBar from "@/components/custom/AppSideBar";
import { SidebarProvider,SidebarTrigger } from "@/components/ui/sidebar";
import Header from "@/components/custom/Header";
import { Ubuntu } from "next/font/google"

const ubuntu = Ubuntu({
    subsets: ['latin'],
    weight: ['400', '500', '700'],
    variable: '--font-ubuntu',
    display: 'swap',
})

export const metadata = {
  title: {
    default: "AI WebGen – Generate Web Apps with AI",
    template: "%s | AI WebGen",
  },
  description:
    "AI WebGen is an AI-powered web application generator that helps developers build, customize, and export modern web apps instantly using natural language prompts.",
  applicationName: "AI WebGen",
  keywords: [
    "AI Web Generator",
    "AI Code Generator",
    "Web App Generator",
    "React App Generator",
    "Next.js AI Tool",
    "Developer Tools",
    "Code Automation",
    "AI SaaS Platform",
  ],
  authors: [{ name: "Xardent" }],
  creator: "Xardent Technologies Private Limited",
  publisher: "Xardent",
  icons: {
    icon: "/xardent_logo.jpeg",
    shortcut: "/xardent_logo.jpeg",
    apple: "/xardent_logo.jpeg",
  },
  metadataBase: new URL("https://aiwebgen.dp.xardent.com/"),
  openGraph: {
    title: "AI WebGen – Build Web Apps Using AI",
    description:
      "Generate production-ready web applications with AI. Prompt, build, preview, and export modern web apps in minutes.",
    url: "https://aiwebgen.dp.xardent.com/",
    siteName: "AI WebGen",
    images: [
      {
        url: "/xardent_logo.jpeg", // optional but recommended
        width: 1200,
        height: 630,
        alt: "AI WebGen – AI Powered Web Generator",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI WebGen – Generate Web Apps with AI",
    description:
      "Build and export modern web apps instantly using AI-powered prompts.",
    images: ["/xardent_logo.jpeg"],
  },
};


export default async function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`overflow-y-scroll ${ubuntu.className} [&::-webkit-scrollbar]:hidden`}>
        <ConvexClientProvider>
          <Provider>
            <SidebarProvider
              defaultOpen={false}
              style={{
                "--sidebar-width" : "18rem",
                "--sidebar-width-mobile": "20rem",
              }}
              
            
            >
              <div className="flex w-full">
                <AppSideBar/>
                <div className="flex flex-col w-full">
                  <Header/>
                  <main className="p-4 w-full">
                    {children}
                  </main>
                  <Toaster/>
                </div>
              </div>
            </SidebarProvider>
            <Toaster/>
          </Provider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
