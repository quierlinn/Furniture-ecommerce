import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {Header} from './components/layout/Header';
import {HomePage} from './pages/HomePage';
import {CatalogPage} from './pages/CatalogPage';
import {ProductPage} from './pages/ProductPage';
import {AuthPage} from './pages/AuthPage';
import {CartPage} from './pages/CartPage';
import {ProfilePage} from './pages/ProfilePage';
import {AdminDashboard} from './pages/admin/Dashboard';
import {useAuth} from './hooks/useAuth';
import {AuthProvider} from './hooks/useAuth';
import {CartProvider} from './hooks/useCart';
import {ProductsAdmin} from './pages/admin/ProductsAdmin';
import {OrdersAdmin} from './pages/admin/OrdersAdmin';
import { AboutPage } from './pages/AboutPage';
import { DeliveryPage } from './pages/DeliveryPage';
import { ContactsPage } from './pages/ContactsPage';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000,
            retry: 1,
        },
    },
});

const ProtectedRoute = ({children}: { children: React.ReactNode }) => {
    const {isAuthenticated, isLoading} = useAuth();
    if (isLoading) return <div className="p-8 text-center">Загрузка...</div>;
    if (!isAuthenticated) return <Navigate to="/auth" replace/>;
    return <>{children}</>;
};

const AdminRoute = ({children}: { children: React.ReactNode }) => {
    const {user, isAuthenticated, isLoading} = useAuth();
    if (isLoading) return <div className="p-8 text-center">Загрузка...</div>;
    if (!isAuthenticated || user?.role !== 'ADMIN') return <Navigate to="/" replace/>;
    return <>{children}</>;
};

function AppRoutes() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header/>

            <main className="flex-1 container mx-auto px-4 py-6">
                <Routes>
                    <Route path="/" element={<HomePage/>}/>
                    <Route path="/catalog" element={<CatalogPage/>}/>
                    <Route path="/product/:id" element={<ProductPage/>}/>
                    <Route path="/auth" element={<AuthPage/>}/>

                    <Route path="/cart" element={
                        <ProtectedRoute><CartPage/></ProtectedRoute>
                    }/>

                    <Route path="/profile" element={
                        <ProtectedRoute><ProfilePage/></ProtectedRoute>
                    }/>

                    <Route path="/admin" element={
                        <AdminRoute><AdminDashboard/></AdminRoute>
                    }/>

                    <Route path="/admin/products" element={
                        <AdminRoute><ProductsAdmin/></AdminRoute>
                    }/>
                    <Route path="/admin/orders" element={
                        <AdminRoute><OrdersAdmin/></AdminRoute>
                    }/>
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/delivery" element={<DeliveryPage />} />
                    <Route path="/contacts" element={<ContactsPage />} />

                    <Route path="*" element={<div className="text-center py-20">🔍 Страница не найдена</div>}/>
                </Routes>
            </main>

            <footer className="bg-gray-900 text-white py-8 mt-auto">
                <div className="container mx-auto px-4 text-center text-sm text-gray-400">
                    © 2026 FurnitureStore. Все права защищены.
                </div>
            </footer>
        </div>
    );
}

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <CartProvider>
                    <BrowserRouter>
                        <AppRoutes/>
                    </BrowserRouter>
                </CartProvider>
            </AuthProvider>
        </QueryClientProvider>
    );
}
