import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuthStore } from './store/authStore';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import InventoryManagement from './pages/InventoryManagement';
import Suppliers from './pages/Suppliers';
import Customers from './pages/Customers';
import Warehouses from './pages/Warehouses';
import PurchasesManagement from './pages/PurchasesManagement';
import Purchases from './pages/Purchases';
import SalesManagement from './pages/SalesManagement';
import Accounts from './pages/Accounts';
import JournalEntries from './pages/JournalEntries';
import Reports from './pages/Reports';
import Layout from './components/Layout';

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
          <Route path="products" element={<InventoryManagement />} />
          <Route path="warehouses" element={<Warehouses />} />
          <Route path="suppliers" element={<Suppliers />} />
          <Route path="customers" element={<Customers />} />
          <Route path="purchases" element={<PurchasesManagement />} />
          <Route path="purchases-detail" element={<Purchases />} />
          <Route path="sales" element={<SalesManagement />} />
          <Route path="accounts" element={<Accounts />} />
          <Route path="journal-entries" element={<JournalEntries />} />
          <Route path="reports" element={<Reports />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
