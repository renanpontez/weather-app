import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppCrashFallback } from "@/components/common/AppCrashFallback";
import { App } from "@/app";
import "./styles/global.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppCrashFallback>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </AppCrashFallback>
  </StrictMode>
);
