import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ModelsProvider } from './context/ModelsContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Categories from './pages/Categories';
import CategoryDetail from './pages/CategoryDetail';
import ModelDetail from './pages/ModelDetail';
import Professional from './pages/Professional';
import Dealers from './pages/Dealers';
import ColorFabric from './pages/ColorFabric';
import Contact from './pages/Contact';
import About from './pages/About';
import BoatShows from './pages/BoatShows';
import UpcomingModels from './pages/UpcomingModels';
import ModelCustomizer from './pages/ModelCustomizer';
import DraftCustomizer from './pages/DraftCustomizer';
import AdminDashboard from './pages/AdminDashboard';
import './styles/index.css';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';

function AppShell() {
  const { pathname } = useLocation();
  const hideFooter =
    /\/models\/[^/]+\/customize$/.test(pathname) || /^\/customizer-draft\//.test(pathname);

  return (
    <>
      <ScrollToTop />
      <div className="min-h-screen bg-white">
        <Navbar />
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/categories/:id" element={<CategoryDetail />} />
            <Route path="/models/upcoming" element={<UpcomingModels />} />
            <Route path="/models/:id" element={<ModelDetail />} />
            <Route path="/models/:id/customize" element={<ModelCustomizer />} />
            <Route path="/customizer-draft/:id" element={<DraftCustomizer />} />
            <Route path="/professional" element={<Professional />} />
            <Route path="/dealers" element={<Dealers />} />
            <Route path="/boat-shows" element={<BoatShows />} />
            <Route path="/color-fabric" element={<ColorFabric />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </AnimatePresence>
        {!hideFooter && <Footer />}
      </div>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <ModelsProvider>
        <Router>
          <AppShell />
        </Router>
      </ModelsProvider>
    </AuthProvider>
  );
}

export default App;
