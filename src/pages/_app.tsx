import { Navbar } from "@/components/layout/navbar";
import { Toaster } from "@/components/ui/toaster";
import "@/styles/globals.css";
import { Provider } from "react-redux";
import type { AppProps } from "next/app";
import { store } from "@/store/store";
import { ThemeProvider } from "@/components/theme-provider";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main>
      <Provider store={store}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
              <Component {...pageProps} />
            </main>
          </div>
          <Toaster />
        </ThemeProvider>
      </Provider>
    </main>
  );
}
