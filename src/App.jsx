import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ModelsProvider } from './context/ModelsContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
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
import AdminDashboard from './pages/AdminDashboard';
import './styles/index.css';

function App() {
  return (
    <ModelsProvider>
      <Router>
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
            <Route path="/professional" element={<Professional />} />
            <Route path="/dealers" element={<Dealers />} />
            <Route path="/boat-shows" element={<BoatShows />} />
            <Route path="/color-fabric" element={<ColorFabric />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
          </AnimatePresence>
          <Footer />
        </div>
      </Router>
    </ModelsProvider>
  );
}

export default App;
