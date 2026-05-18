import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider } from '@/lib/AuthContext';
import Home from './pages/Home';
import Collezione from './pages/Collezione';
import ChiSiamo from './pages/ChiSiamo';
import Contatti from './pages/Contatti';
import PrivacyPolicy from './pages/PrivacyPolicy';
import SpedizioniResi from './pages/SpedizioniResi';
import ModalitaPagamento from './pages/ModalitaPagamento';
import Login from './components/auth/Login';
import AdminRoutes from './admin/AdminRoutes';

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/collezione" element={<Collezione />} />
            <Route path="/chi-siamo" element={<ChiSiamo />} />
            <Route path="/contatti" element={<Contatti />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/spedizioni-resi" element={<SpedizioniResi />} />
            <Route path="/modalita-pagamento" element={<ModalitaPagamento />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin/*" element={<AdminRoutes />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App