import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { Package, Tag, Users, UserCheck, ShoppingCart, LogOut, LayoutDashboard, Image } from 'lucide-react';

const navItems = [
  { to: '/admin/prodotti', icon: Package, label: 'Prodotti' },
  { to: '/admin/categorie', icon: Tag, label: 'Categorie' },
  { to: '/admin/hero', icon: Image, label: 'Hero Slider' },
  { to: '/admin/clienti', icon: UserCheck, label: 'Clienti' },
  { to: '/admin/vendite', icon: ShoppingCart, label: 'Vendite' },
  { to: '/admin/utenti', icon: Users, label: 'Utenti' },
];

const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth();

  return (
    <div className="flex h-screen bg-gray-50/50">
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col shrink-0">
        <div className="px-6 py-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center">
              <LayoutDashboard className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-heading text-lg font-semibold text-foreground">Nicole</span>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest -mt-0.5">Admin</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-foreground text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-gray-100">
          <div className="flex items-center justify-between px-3 py-2">
            <span className="text-xs text-gray-500 truncate max-w-[120px]">
              {user?.name || user?.email || 'Admin'}
            </span>
            <button
              onClick={() => logout()}
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200"
              title="Esci"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden min-h-0">
        <header className="bg-white border-b border-gray-100 px-8 py-4 shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-medium text-gray-900">Pannello di Amministrazione</h2>
              <p className="text-xs text-gray-400 mt-0.5">Gestisci il tuo negozio</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <span className="text-xs font-medium text-gray-600">
                  {(user?.name || 'A').charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto min-h-0">
          <div className="admin-page">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
