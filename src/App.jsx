import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Categories from './pages/Categories';
import CategoryDetail from './pages/CategoryDetail';
import Models from './pages/Models';
import ModelDetail from './pages/ModelDetail';
import Professional from './pages/Professional';
import Dealers from './pages/Dealers';
import ColorFabric from './pages/ColorFabric';
import Contact from './pages/Contact';
import About from './pages/About';
import BoatShows from './pages/BoatShows';
import './styles/index.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Navbar />
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/categories/:id" element={<CategoryDetail />} />
            <Route path="/models" element={<Models />} />
            <Route path="/models/:id" element={<ModelDetail />} />
            <Route path="/professional" element={<Professional />} />
            <Route path="/dealers" element={<Dealers />} />
            <Route path="/boat-shows" element={<BoatShows />} />
            <Route path="/color-fabric" element={<ColorFabric />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </AnimatePresence>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
