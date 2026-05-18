import { Navigate, Outlet, useLocation, Routes, Route } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import AdminLayout from './AdminLayout';
import ProductList from './pages/ProductList';
import ProductForm from './pages/ProductForm';
import UserList from './pages/UserList';
import UserForm from './pages/UserForm';
import ClientesList from './pages/ClientesList';
import VentasList from './pages/VentasList';
import CategoryList from './pages/CategoryList';
import CategoryForm from './pages/CategoryForm';
import HeroSlideList from './pages/HeroSlideList';
import HeroSlideForm from './pages/HeroSlideForm';

const RequireAuth = ({ children }) => {
  const { isAuthenticated, isLoadingAuth } = useAuth();
  const location = useLocation();

  if (isLoadingAuth) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-200 border-t-foreground/30 rounded-full animate-spin mx-auto" />
          <p className="text-sm text-gray-400 mt-3">Caricamento...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

const AdminRoutes = () => {
  return (
    <RequireAuth>
      <AdminLayout>
        <Routes>
          <Route index element={<Navigate to="/admin/prodotti" replace />} />
          <Route path="prodotti" element={<ProductList />} />
          <Route path="prodotti/nuovo" element={<ProductForm />} />
          <Route path="prodotti/:id/modifica" element={<ProductForm />} />
          <Route path="categorie" element={<CategoryList />} />
          <Route path="categorie/nuovo" element={<CategoryForm />} />
          <Route path="categorie/:id/modifica" element={<CategoryForm />} />
          <Route path="hero" element={<HeroSlideList />} />
          <Route path="hero/nuovo" element={<HeroSlideForm />} />
          <Route path="hero/:id/modifica" element={<HeroSlideForm />} />
          <Route path="utenti" element={<UserList />} />
          <Route path="utenti/nuovo" element={<UserForm />} />
          <Route path="utenti/:id/modifica" element={<UserForm />} />
          <Route path="clienti" element={<ClientesList />} />
          <Route path="clienti/nuovo" element={<div>Modulo Cliente (da implementare)</div>} />
          <Route path="clienti/:id/modifica" element={<div>Modulo Cliente (da implementare)</div>} />
          <Route path="vendite" element={<VentasList />} />
          <Route path="vendite/nuovo" element={<div>Modulo Vendita (da implementare)</div>} />
          <Route path="vendite/:id/modifica" element={<div>Modulo Vendita (da implementare)</div>} />
        </Routes>
      </AdminLayout>
    </RequireAuth>
  );
};

export default AdminRoutes;
