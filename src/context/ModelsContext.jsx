import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { transformModels, transformCategory } from '../utils/transformModelData';

const ModelsContext = createContext();

export const useModels = () => {
  const context = useContext(ModelsContext);
  if (!context) {
    throw new Error('useModels must be used within ModelsProvider');
  }
  return context;
};

export const ModelsProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [modelsData, categoriesData] = await Promise.all([
        api.getAllModels(),
        api.getAllCategories()
      ]);
      
      // Transform models to include proper image paths
      const transformedModels = transformModels(modelsData);
      
      // Transform categories to include models with proper image paths
      const categoriesWithModels = categoriesData.map(category => 
        transformCategory(category, transformedModels)
      );
      
      setCategories(categoriesWithModels);
      setModels(transformedModels);
    } catch (err) {
      setError(err.message);
      console.error('Error loading models data:', err);
      // Fallback to static data if API fails
      try {
        const { inflatableBoats } = await import('../data/models');
        setCategories(inflatableBoats);
        const allModels = inflatableBoats.flatMap(cat => 
          cat.models.map(m => ({ ...m, categoryId: cat.id, categoryName: cat.name }))
        );
        setModels(allModels);
      } catch (fallbackErr) {
        console.error('Fallback also failed:', fallbackErr);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const refreshData = () => {
    loadData();
  };

  const value = {
    categories,
    models,
    loading,
    error,
    refreshData
  };

  return (
    <ModelsContext.Provider value={value}>
      {children}
    </ModelsContext.Provider>
  );
};

