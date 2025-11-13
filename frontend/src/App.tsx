import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuthStore } from './store/authStore';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import InventoryManagement from './pages/InventoryManagement';
import PurchasesManagement from './pages/PurchasesManagement';
import AccountsManagement from './pages/AccountsManagement';
import Accounts from './pages/Accounts';
import Layout from './components/Layout';
import SalesManagement from './pages/SalesManagement';
import Products from './pages/Products';
import ProductCategories from './pages/ProductCategories';
import Warehouses from './pages/Warehouses';
import Customers from './pages/Customers';
import UnitsOfMeasure from './pages/UnitsOfMeasure';
import UnitsOfMeasureCategories from './pages/UnitsOfMeasure/categories';
import FoundationalAccounts from './pages/Accounts/Foundational';

function App() {
  const { isAuthenticated } = useAuthStore();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Wait for Zustand to hydrate from localStorage
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return <div>جاري التحميل...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}
        >
          <Route index element={<Dashboard />} />
          <Route path="inventory-management" element={<InventoryManagement />} />
          <Route path="purchases-management" element={<PurchasesManagement />} />
          <Route path="accounts-management" element={<AccountsManagement />} />
          <Route path="sales-management" element={<SalesManagement />} />
          <Route path="products" element={<Products />} />
          <Route path="product-categories" element={<ProductCategories />} />
          <Route path="units-of-measure" element={<UnitsOfMeasure />} />
          <Route path="units-of-measure/categories" element={<UnitsOfMeasureCategories />} />
          <Route path="warehouses" element={<Warehouses />} />
          <Route path="customers" element={<Customers />} />
          <Route path="accounts" element={<Accounts />} />
          <Route path="accounts/foundational" element={<FoundationalAccounts />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
