import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import AppLayout from "@/components/AppLayout";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Dashboard from "./pages/app/Dashboard";
import Invoices from "./pages/app/Invoices";
import InvoiceEditor from "./pages/app/InvoiceEditor";
import Clients from "./pages/app/Clients";
import Expenses from "./pages/app/Expenses";
import Vat from "./pages/app/Vat";
import Bank from "./pages/app/Bank";
import Roadmap from "./pages/app/Roadmap";
import Settings from "./pages/app/Settings";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/app" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              <Route index element={<Dashboard />} />
              <Route path="facturen" element={<Invoices />} />
              <Route path="facturen/nieuw" element={<InvoiceEditor />} />
              <Route path="facturen/:id" element={<InvoiceEditor />} />
              <Route path="klanten" element={<Clients />} />
              <Route path="bonnetjes" element={<Expenses />} />
              <Route path="btw" element={<Vat />} />
              <Route path="bank" element={<Bank />} />
              <Route path="roadmap" element={<Roadmap />} />
              <Route path="instellingen" element={<Settings />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
