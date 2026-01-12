import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useModels } from '../context/ModelsContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { 
  normalizeModelDataForSave, 
  normalizeModelDataForEdit,
  normalizeCategoryDataForSave,
  normalizeCategoryDataForEdit,
  extractFilename,
  extractUploadUrl
} from '../utils/backendConfig';
import { isYouTubeUrl } from '../utils/youtubeUtils';

const AdminDashboard = () => {
  const { models, categories, loading, refreshData } = useModels();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('models');
  const [selectedModelId, setSelectedModelId] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [selectedEventId, setSelectedEventId] = useState('');
  const [events, setEvents] = useState([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const [editedData, setEditedData] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingModel, setIsLoadingModel] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  // Load model data when selection changes
  useEffect(() => {
    if (selectedModelId && activeTab === 'models') {
      console.log('Loading model with ID:', selectedModelId); // Debug log
      loadModelData(selectedModelId);
    } else if (!selectedModelId && activeTab === 'models') {
      setEditedData(null);
    }
  }, [selectedModelId, activeTab]);

  // Load category data when selection changes
  useEffect(() => {
    if (selectedCategoryId && activeTab === 'categories') {
      loadCategoryData(selectedCategoryId);
    }
  }, [selectedCategoryId, activeTab]);

  // Load events when events tab is active
  useEffect(() => {
    if (activeTab === 'events') {
      loadEvents();
    }
  }, [activeTab]);

  // Load event data when selection changes
  useEffect(() => {
    if (selectedEventId && activeTab === 'events') {
      loadEventData(selectedEventId);
    } else if (!selectedEventId && activeTab === 'events') {
      setEditedData(null);
    }
  }, [selectedEventId, activeTab]);

  const loadModelData = async (id) => {
    setIsLoadingModel(true);
    setMessage({ type: '', text: '' });
    try {
      console.log('[AdminDashboard] Attempting to load model with ID:', id);
      const modelData = await api.getModelById(id);
      console.log('[AdminDashboard] Loaded raw model data:', modelData);
      
      // Handle API response structure - could be { data: {...} } or direct object
      const actualData = modelData?.data || modelData;
      
      if (actualData && (actualData.id || actualData.name)) {
        // Normalize data: extract filenames from paths
        const normalizedData = normalizeModelDataForEdit(actualData);
        console.log('[AdminDashboard] Normalized model data:', normalizedData);
        console.log('[AdminDashboard] Gallery files after normalization:', normalizedData.galleryFiles);
        console.log('[AdminDashboard] Interior main image after normalization:', normalizedData.interiorMainImage);
        console.log('[AdminDashboard] Interior files after normalization:', normalizedData.interiorFiles);
        
        setEditedData(normalizedData);
        console.log('[AdminDashboard] Model data loaded and set successfully');
        setMessage({ type: 'success', text: `Model "${actualData.name || 'Unknown'}" loaded successfully!` });
        setTimeout(() => setMessage({ type: '', text: '' }), 2000);
      } else {
        console.error('[AdminDashboard] Invalid model data:', modelData);
        setMessage({ type: 'error', text: 'Invalid model data received. Please try selecting the model again.' });
        setEditedData(null);
      }
    } catch (error) {
      console.error('[AdminDashboard] Error loading model:', error);
      const errorMessage = error.message || 'Unknown error occurred';
      setMessage({ type: 'error', text: `Failed to load model data: ${errorMessage}. Please check your connection and try again.` });
      setEditedData(null);
    } finally {
      setIsLoadingModel(false);
    }
  };

  const loadCategoryData = async (id) => {
    try {
      const category = categories.find(c => c.id === parseInt(id));
      if (category) {
        console.log('[AdminDashboard] Raw category data from context:', category);
        // Normalize category data: extract filenames from paths
        const normalizedData = normalizeCategoryDataForEdit({
          id: category.id,
          name: category.name,
          description: category.description || '',
          image: category.image || '',
          heroImage: category.heroImage || '',
          mainGroup: category.mainGroup || 'inflatableBoats',
        });
        console.log('[AdminDashboard] Loaded category data:', normalizedData);
        console.log('[AdminDashboard] Category image after normalization:', normalizedData.image);
        console.log('[AdminDashboard] Category heroImage after normalization:', normalizedData.heroImage);
        setEditedData(normalizedData);
      }
    } catch (error) {
      console.error('[AdminDashboard] Error loading category:', error);
      setMessage({ type: 'error', text: 'Failed to load category data: ' + error.message });
    }
  };

  const handleModelChange = (e) => {
    setSelectedModelId(e.target.value);
    setEditedData(null);
    setMessage({ type: '', text: '' });
  };

  const handleCategoryChange = (e) => {
    setSelectedCategoryId(e.target.value);
    setEditedData(null);
    setMessage({ type: '', text: '' });
  };

  const loadEvents = async () => {
    setIsLoadingEvents(true);
    try {
      const eventsData = await api.getAllEvents();
      setEvents(eventsData);
    } catch (error) {
      console.error('[AdminDashboard] Error loading events:', error);
      setMessage({ type: 'error', text: 'Failed to load events: ' + error.message });
    } finally {
      setIsLoadingEvents(false);
    }
  };

  const loadEventData = async (id) => {
    try {
      const eventData = await api.getEventById(id);
      // Format dates for input fields (YYYY-MM-DDTHH:mm)
      const formattedData = {
        ...eventData,
        startDate: eventData.startDate ? new Date(eventData.startDate).toISOString().slice(0, 16) : '',
        endDate: eventData.endDate ? new Date(eventData.endDate).toISOString().slice(0, 16) : '',
        image: eventData.image ? extractFilename(eventData.image) : ''
      };
      setEditedData(formattedData);
    } catch (error) {
      console.error('[AdminDashboard] Error loading event:', error);
      setMessage({ type: 'error', text: 'Failed to load event data: ' + error.message });
    }
  };

  const handleEventChange = (e) => {
    setSelectedEventId(e.target.value);
    setEditedData(null);
    setMessage({ type: '', text: '' });
  };

  const handleSaveEvent = async () => {
    if (!editedData) return;
    
    setIsSaving(true);
    try {
      const dataToSave = {
        name: editedData.name,
        location: editedData.location,
        startDate: editedData.startDate,
        endDate: editedData.endDate || null,
        description: editedData.description || '',
        // Preserve Cloudinary URLs, extract filename only for legacy paths
        image: editedData.image || '',
        website: editedData.website || '',
        status: editedData.status || 'upcoming',
        order: parseInt(editedData.order) || 0
      };

      if (editedData.id) {
        // Update existing event
        await api.updateEvent(editedData.id, dataToSave);
        setMessage({ type: 'success', text: 'Event updated successfully!' });
      } else {
        // Create new event
        await api.createEvent(dataToSave);
        setMessage({ type: 'success', text: 'Event created successfully!' });
      }
      
      await loadEvents();
      setSelectedEventId('');
      setEditedData(null);
      setTimeout(() => setMessage({ type: '', text: '' }), 2000);
    } catch (error) {
      console.error('[AdminDashboard] Error saving event:', error);
      setMessage({ type: 'error', text: 'Failed to save event: ' + error.message });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteEvent = async () => {
    if (!editedData || !editedData.id) return;
    
    if (!window.confirm(`Are you sure you want to delete "${editedData.name}"?`)) {
      return;
    }
    
    try {
      await api.deleteEvent(editedData.id);
      setMessage({ type: 'success', text: 'Event deleted successfully!' });
      await loadEvents();
      setSelectedEventId('');
      setEditedData(null);
      setTimeout(() => setMessage({ type: '', text: '' }), 2000);
    } catch (error) {
      console.error('[AdminDashboard] Error deleting event:', error);
      setMessage({ type: 'error', text: 'Failed to delete event: ' + error.message });
    }
  };

  const handleNewEvent = () => {
    setSelectedEventId('');
    setEditedData({
      name: '',
      location: '',
      startDate: '',
      endDate: '',
      description: '',
      image: '',
      website: '',
      status: 'upcoming',
      order: 0
    });
  };

  const handleInputChange = (field, value) => {
    // For image file fields, preserve Cloudinary URLs, extract filenames only for legacy paths
    // extractFilename() already handles this - it preserves Cloudinary URLs and full URLs
    if (field === 'imageFile' || field === 'heroImageFile' || field === 'contentImageFile' ||
        field === 'image' || field === 'heroImage' || field === 'interiorMainImage') {
      // extractFilename preserves Cloudinary URLs, so this is safe
      value = extractFilename(value);
    }
    
    // Debug logging for interiorMainImage
    if (field === 'interiorMainImage') {
      console.log('[AdminDashboard] handleInputChange - interiorMainImage:', {
        originalValue: value,
        extractedValue: extractFilename(value),
        field: field
      });
    }
    
    setEditedData(prev => {
      const updated = {
        ...prev,
        [field]: value
      };
      
      // Debug logging for interiorMainImage after update
      if (field === 'interiorMainImage') {
        console.log('[AdminDashboard] handleInputChange - Updated editedData.interiorMainImage:', updated.interiorMainImage);
      }
      
      return updated;
    });
  };

  const handleSpecChange = (specId, field, value) => {
    setEditedData(prev => ({
      ...prev,
      specs: prev.specs.map(spec =>
        spec.id === specId ? { ...spec, [field]: value } : spec
      )
    }));
  };

  const handleFeatureChange = (index, value) => {
    setEditedData(prev => ({
      ...prev,
      features: prev.features.map((feature, idx) => {
        if (idx === index) {
          // If it's already an object with id, update the feature field
          if (typeof feature === 'object' && feature.id) {
            return { ...feature, feature: value };
          }
          // If it's a string or new feature, convert to object format
          return value; // Keep as string for now, backend will handle conversion
        }
        return feature;
      })
    }));
  };

  const handleOptionalFeatureChange = (optId, field, value) => {
    setEditedData(prev => ({
      ...prev,
      optionalFeatures: prev.optionalFeatures.map(opt =>
        opt.id === optId ? { ...opt, [field]: value } : opt
      )
    }));
  };

  const handleSaveModel = async () => {
    if (!editedData) return;

    setIsSaving(true);
    setMessage({ type: '', text: '' });

    try {
      // Debug: Check editedData before normalization
      console.log('[AdminDashboard] Before normalization - editedData.interiorMainImage:', editedData.interiorMainImage);
      console.log('[AdminDashboard] Before normalization - editedData keys:', Object.keys(editedData || {}));
      
      // Normalize data: ensure all image fields contain only filenames
      const dataToSave = normalizeModelDataForSave(editedData);
      
      console.log('[AdminDashboard] After normalization - dataToSave.interiorMainImage:', dataToSave.interiorMainImage);
      
      console.log('[AdminDashboard] Saving model data:', {
        id: dataToSave.id,
        name: dataToSave.name,
        imageFile: dataToSave.imageFile,
        heroImageFile: dataToSave.heroImageFile,
        contentImageFile: dataToSave.contentImageFile,
        galleryFiles: dataToSave.galleryFiles,
        galleryFilesCount: dataToSave.galleryFiles?.length || 0,
        interiorMainImage: dataToSave.interiorMainImage,
        interiorMainImageType: typeof dataToSave.interiorMainImage,
        interiorMainImageLength: dataToSave.interiorMainImage?.length || 0,
        interiorFiles: dataToSave.interiorFiles,
        interiorFilesCount: dataToSave.interiorFiles?.length || 0,
        videoFiles: dataToSave.videoFiles,
        videoFilesCount: dataToSave.videoFiles?.length || 0,
      });
      
      const response = await api.updateModel(editedData.id, dataToSave);
      console.log('[AdminDashboard] Update response:', response);
      
      // Handle both response formats: { success: true, data: {...} } or direct model data
      // Check if response indicates success (has id/name or success: true)
      const hasModelData = response && (response.id || response.name || response.data?.id || response.data?.name);
      const hasSuccessFlag = response && response.success === true;
      const isSuccess = hasSuccessFlag || hasModelData;
      
      if (isSuccess) {
        setMessage({ type: 'success', text: 'Model updated successfully!' });
        
        // Refresh models list if function exists
        if (refreshData && typeof refreshData === 'function') {
          try {
            await refreshData();
          } catch (refreshError) {
            console.warn('[AdminDashboard] Error refreshing models:', refreshError);
          }
        }
        
        // Reload the specific model to get the updated version from database
        // This ensures we have the latest data with proper filenames
        try {
          await loadModelData(editedData.id);
        } catch (loadError) {
          console.warn('[AdminDashboard] Error reloading model:', loadError);
        }
        
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        const errorMessage = (response && (response.message || response.error)) || 'Failed to update model';
        setMessage({ type: 'error', text: errorMessage });
        console.error('[AdminDashboard] Update failed:', response);
      }
    } catch (error) {
      console.error('[AdminDashboard] Save error:', error);
      setMessage({ type: 'error', text: 'Failed to update model: ' + error.message });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveCategory = async () => {
    if (!editedData) return;

    setIsSaving(true);
    setMessage({ type: '', text: '' });

    try {
      // Normalize data: ensure all image fields contain only filenames
      const dataToSave = normalizeCategoryDataForSave(editedData);
      
      console.log('[AdminDashboard] Saving category data:', {
        id: dataToSave.id,
        name: dataToSave.name,
        image: dataToSave.image,
        heroImage: dataToSave.heroImage,
      });
      
      const response = await api.updateCategory(editedData.id, dataToSave);
      
      // Check if update was successful (backend returns {success: true, data: category} or just category)
      const hasCategoryData = response && (response.id || response.name || response.data?.id || response.data?.name);
      const hasSuccessFlag = response && response.success === true;
      
      if (hasSuccessFlag || hasCategoryData) {
        setMessage({ type: 'success', text: 'Category updated successfully!' });
        
        // Refresh categories list
        await refreshData();
        
        // Reload the specific category to get the updated version from database
        await loadCategoryData(editedData.id);
        
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        setMessage({ type: 'error', text: response.message || response.error || 'Failed to update category' });
      }
    } catch (error) {
      console.error('[AdminDashboard] Save category error:', error);
      setMessage({ type: 'error', text: 'Failed to update category: ' + error.message });
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = () => {
    const data = {
      models: models,
      categories: categories,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tiger-marine-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClearAllImages = async () => {
    if (!showClearConfirm) {
      setShowClearConfirm(true);
      return;
    }

    setIsClearing(true);
    setMessage({ type: '', text: '' });
    setShowClearConfirm(false);

    try {
      let successCount = 0;
      let errorCount = 0;
      const totalModels = models.length;

      // Clear images for each model
      for (const model of models) {
        try {
          const clearedData = {
            ...model,
            imageFile: '',
            heroImageFile: '',
            contentImageFile: '',
            galleryFiles: [],
            interiorMainImage: '',
            interiorFiles: [],
            videoFiles: [],
          };

          // Normalize before saving
          const dataToSave = normalizeModelDataForSave(clearedData);
          await api.updateModel(model.id, dataToSave);
          successCount++;
        } catch (error) {
          console.error(`[AdminDashboard] Error clearing images for model ${model.name}:`, error);
          errorCount++;
        }
      }

      // Refresh data
      await refreshData();

      if (errorCount === 0) {
        setMessage({ 
          type: 'success', 
          text: `✅ Successfully cleared all images from ${successCount} model(s)!` 
        });
      } else {
        setMessage({ 
          type: 'error', 
          text: `⚠️ Cleared images from ${successCount} model(s), but ${errorCount} failed. Check console for details.` 
        });
      }

      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    } catch (error) {
      console.error('[AdminDashboard] Error clearing all images:', error);
      setMessage({ type: 'error', text: 'Failed to clear images: ' + error.message });
    } finally {
      setIsClearing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <span className="text-blue-600">⚙️</span>
                Admin Dashboard
              </h1>
              <p className="mt-2 text-gray-600">Manage models, categories, and export data</p>
            </div>
            <div className="flex items-center gap-4">
              {editedData && (
                <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Editing: <span className="font-semibold text-gray-700">{editedData.name}</span>
                </div>
              )}
              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Message Alert */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-xl shadow-sm border ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-800 border-green-200' 
              : 'bg-red-50 text-red-800 border-red-200'
          }`}>
            <div className="flex items-center gap-2">
              <span className="text-xl">{message.type === 'success' ? '✅' : '❌'}</span>
              <span>{message.text}</span>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6 bg-white rounded-xl shadow-sm p-2 border border-gray-200">
          <nav className="flex space-x-2">
            {['models', 'categories', 'events', 'export'].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setSelectedModelId('');
                  setSelectedCategoryId('');
                  setSelectedEventId('');
                  setEditedData(null);
                  setMessage({ type: '', text: '' });
                }}
                className={`flex-1 py-3 px-4 rounded-lg font-medium text-sm capitalize transition-all duration-200 ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                {tab === 'models' && '📦 '}
                {tab === 'categories' && '📁 '}
                {tab === 'events' && '📅 '}
                {tab === 'export' && '📤 '}
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Models Tab */}
        {activeTab === 'models' && (
          <div className="space-y-6">
            {/* Clear All Images Button - Dangerous Action */}
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-red-900 flex items-center gap-2">
                    <span>🗑️</span>
                    Clear All Model Images
                  </h3>
                  <p className="text-sm text-red-700 mt-1">
                    This will remove all images (thumbnails, hero, content, gallery, interior, videos) from ALL models.
                    The client can then upload their preferred images.
                  </p>
                </div>
                {!showClearConfirm ? (
                  <button
                    onClick={handleClearAllImages}
                    disabled={isClearing || models.length === 0}
                    className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isClearing ? '⏳ Clearing...' : '🗑️ Clear All Images'}
                  </button>
                ) : (
                  <div className="flex gap-3">
                    <button
                      onClick={handleClearAllImages}
                      disabled={isClearing}
                      className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isClearing ? '⏳ Clearing...' : '✅ Confirm Clear All'}
                    </button>
                    <button
                      onClick={() => setShowClearConfirm(false)}
                      disabled={isClearing}
                      className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
              {showClearConfirm && (
                <div className="mt-4 p-4 bg-red-100 border border-red-300 rounded-lg">
                  <p className="text-red-900 font-semibold">
                    ⚠️ WARNING: This action cannot be undone!
                  </p>
                  <p className="text-red-800 text-sm mt-2">
                    This will clear images from <strong>{models.length} model(s)</strong>. 
                    All image fields (thumbnail, hero, content, gallery, interior, videos) will be emptied.
                    The image files themselves will remain on the server, but they won't be linked to any models.
                  </p>
                </div>
              )}
            </div>

            {/* Model Selector Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <span>🔍</span>
                Select Model to Edit
              </label>
              {loading ? (
                <div className="text-gray-500 text-sm">Loading models...</div>
              ) : models.length === 0 ? (
                <div className="text-red-500 text-sm">
                  ⚠️ No models found. Please check your backend connection.
                </div>
              ) : (
                <select
                  value={selectedModelId}
                  onChange={handleModelChange}
                  className="w-full max-w-md px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 font-medium transition-all"
                >
                  <option value="">-- Choose a model --</option>
                  {models.map((model) => (
                    <option key={model.id} value={String(model.id)}>
                      {model.name}
                    </option>
                  ))}
                </select>
              )}
              {models.length > 0 && (
                <p className="mt-2 text-xs text-gray-500">
                  {models.length} model{models.length !== 1 ? 's' : ''} available
                </p>
              )}
            </div>

            {isLoadingModel && (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-200">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600 font-medium">Loading model data...</p>
              </div>
            )}

            {!isLoadingModel && editedData && (
              <div className="space-y-6">
                {/* Debug Info - Collapsible */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <details className="cursor-pointer">
                    <summary className="text-xs font-semibold text-gray-600 hover:text-gray-900">
                      🔧 Debug: View Raw Data
                    </summary>
                    <pre className="mt-2 overflow-auto max-h-40 bg-white p-3 rounded text-xs border border-gray-200">
                      {JSON.stringify(editedData, null, 2)}
                    </pre>
                  </details>
                </div>

                {/* Basic Info Card */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                    <span className="text-2xl">📝</span>
                    <h2 className="text-xl font-bold text-gray-900">Basic Information</h2>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <span>🏷️</span>
                        Model Name
                      </label>
                      <input
                        type="text"
                        value={editedData.name || ''}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                        placeholder="Enter model name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <span>📄</span>
                        Short Description
                      </label>
                      <textarea
                        value={editedData.shortDescription || ''}
                        onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white resize-none"
                        placeholder="Brief description..."
                      />
                    </div>
                    <div className="lg:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <span>📖</span>
                        Full Description
                      </label>
                      <textarea
                        value={editedData.description || ''}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        rows={4}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white resize-none"
                        placeholder="Detailed description..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <span>📑</span>
                        Section 2 Title
                      </label>
                      <input
                        type="text"
                        value={editedData.section2Title || ''}
                        onChange={(e) => handleInputChange('section2Title', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                        placeholder="Section title"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <span>📝</span>
                        Section 2 Description
                      </label>
                      <textarea
                        value={editedData.section2Description || ''}
                        onChange={(e) => handleInputChange('section2Description', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white resize-none"
                        placeholder="Section description"
                      />
                    </div>
                  </div>
                </div>

                {/* Images Card */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                    <span className="text-2xl">🖼️</span>
                    <h2 className="text-xl font-bold text-gray-900">Images</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <span>🖼️</span>
                        Thumbnail Image
                      </label>
                      <p className="text-xs text-gray-500 mb-2">Used in: Model cards, category listings, and thumbnails</p>
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={editedData.imageFile || ''}
                          onChange={(e) => handleInputChange('imageFile', e.target.value)}
                          className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white text-sm"
                          placeholder="thumbnail-image.jpg"
                        />
                        <label className="block w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer text-center font-medium transition-all shadow-sm hover:shadow-md">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files[0];
                              if (!file) return;
                              if (!editedData.name) {
                                setMessage({ type: 'error', text: 'Please select a model first' });
                                e.target.value = '';
                                return;
                              }
                              try {
                                const result = await api.uploadFile(file, 'images', editedData.name);
                                console.log('[AdminDashboard] Upload result:', result);
                                // Extract URL from upload response (handles both old and new format)
                                const url = extractUploadUrl(result);
                                console.log('[AdminDashboard] Extracted URL:', url);
                                handleInputChange('imageFile', url);
                                setMessage({ type: 'success', text: 'Thumbnail image uploaded successfully!' });
                              } catch (error) {
                                setMessage({ type: 'error', text: 'Failed to upload thumbnail image: ' + error.message });
                              }
                              e.target.value = '';
                            }}
                          />
                          📤 Upload Thumbnail
                        </label>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <span>🎯</span>
                        Hero Image
                      </label>
                      <p className="text-xs text-gray-500 mb-2">Used in: Top banner on model detail page</p>
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={editedData.heroImageFile || ''}
                          onChange={(e) => handleInputChange('heroImageFile', e.target.value)}
                          className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white text-sm"
                          placeholder="hero-banner-image.jpg"
                        />
                        <label className="block w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer text-center font-medium transition-all shadow-sm hover:shadow-md">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files[0];
                              if (!file) return;
                              if (!editedData.name) {
                                setMessage({ type: 'error', text: 'Please select a model first' });
                                e.target.value = '';
                                return;
                              }
                              try {
                                const result = await api.uploadFile(file, 'images', editedData.name);
                                // Extract URL from upload response (handles both old and new format)
                                const url = extractUploadUrl(result);
                                handleInputChange('heroImageFile', url);
                                setMessage({ type: 'success', text: 'Hero banner image uploaded successfully!' });
                              } catch (error) {
                                setMessage({ type: 'error', text: 'Failed to upload hero image: ' + error.message });
                              }
                              e.target.value = '';
                            }}
                          />
                          📤 Upload Hero Banner
                        </label>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <span>📷</span>
                        Content Image
                      </label>
                      <p className="text-xs text-gray-500 mb-2">Used in: Content sections on model detail page</p>
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={editedData.contentImageFile || ''}
                          onChange={(e) => handleInputChange('contentImageFile', e.target.value)}
                          className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white text-sm"
                          placeholder="content-section-image.jpg"
                        />
                        <label className="block w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer text-center font-medium transition-all shadow-sm hover:shadow-md">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files[0];
                              if (!file) return;
                              if (!editedData.name) {
                                setMessage({ type: 'error', text: 'Please select a model first' });
                                e.target.value = '';
                                return;
                              }
                              try {
                                const result = await api.uploadFile(file, 'images', editedData.name);
                                // Extract URL from upload response
                                const url = extractUploadUrl(result);
                                handleInputChange('contentImageFile', url);
                                setMessage({ type: 'success', text: 'Content section image uploaded successfully!' });
                              } catch (error) {
                                setMessage({ type: 'error', text: 'Failed to upload content image: ' + error.message });
                              }
                              e.target.value = '';
                            }}
                          />
                          📤 Upload Content Image
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Specs Card */}
                {editedData.specs && Object.keys(editedData.specs).length > 0 ? (
                  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                      <span className="text-2xl">⚙️</span>
                      <h2 className="text-xl font-bold text-gray-900">
                        Specifications ({Object.keys(editedData.specs).length})
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(editedData.specs).map(([key, value], index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                              {key}
                            </label>
                            <button
                              onClick={() => {
                                const newSpecs = { ...editedData.specs };
                                delete newSpecs[key];
                                setEditedData({ ...editedData, specs: newSpecs });
                              }}
                              className="text-red-500 hover:text-red-700 text-xs"
                            >
                              ✕
                            </button>
                          </div>
                          <input
                            type="text"
                            value={value || ''}
                            onChange={(e) => {
                              const newSpecs = { ...editedData.specs };
                              newSpecs[key] = e.target.value;
                              setEditedData({ ...editedData, specs: newSpecs });
                            }}
                            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                            placeholder="Value"
                          />
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => {
                        const newKey = prompt('Enter spec key:');
                        if (newKey) {
                          setEditedData({
                            ...editedData,
                            specs: { ...editedData.specs, [newKey]: '' }
                          });
                        }
                      }}
                      className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-all"
                    >
                      + Add Specification
                    </button>
                  </div>
                ) : (
                  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-2xl">⚙️</span>
                      <h2 className="text-xl font-bold text-gray-900">Specifications</h2>
                    </div>
                    <p className="text-gray-500 text-sm mb-4">No specifications found.</p>
                    <button
                      onClick={() => {
                        const newKey = prompt('Enter spec key:');
                        if (newKey) {
                          setEditedData({
                            ...editedData,
                            specs: { [newKey]: '' }
                          });
                        }
                      }}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-all"
                    >
                      + Add Specification
                    </button>
                  </div>
                )}

                {/* Features Card */}
                {editedData.features && Array.isArray(editedData.features) && editedData.features.length > 0 ? (
                  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                      <span className="text-2xl">✨</span>
                      <h2 className="text-xl font-bold text-gray-900">
                        Standard Features ({editedData.features.length})
                      </h2>
                    </div>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {editedData.features.map((feature, index) => (
                        <div key={feature.id || index} className="flex gap-2 items-center bg-gray-50 p-3 rounded-lg border border-gray-200">
                          <span className="text-gray-500 font-medium w-8">{index + 1}.</span>
                          <input
                            type="text"
                            value={typeof feature === 'string' ? feature : (feature.feature || '')}
                            onChange={(e) => handleFeatureChange(index, e.target.value)}
                            className="flex-1 px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                            placeholder="Enter feature description"
                          />
                          <button
                            onClick={() => {
                              const newFeatures = editedData.features.filter((_, i) => i !== index);
                              setEditedData({ ...editedData, features: newFeatures });
                            }}
                            className="px-4 py-2.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-medium transition-all"
                          >
                            ✕ Remove
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => {
                        setEditedData({
                          ...editedData,
                          features: [...(editedData.features || []), '']
                        });
                      }}
                      className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-all"
                    >
                      + Add Feature
                    </button>
                  </div>
                ) : (
                  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-2xl">✨</span>
                      <h2 className="text-xl font-bold text-gray-900">Standard Features</h2>
                    </div>
                    <p className="text-gray-500 text-sm mb-4">No features found.</p>
                    <button
                      onClick={() => {
                        setEditedData({
                          ...editedData,
                          features: ['']
                        });
                      }}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-all"
                    >
                      + Add Feature
                    </button>
                  </div>
                )}

                {/* Optional Features Card */}
                {editedData.optionalFeatures && Array.isArray(editedData.optionalFeatures) && editedData.optionalFeatures.length > 0 ? (
                  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                      <span className="text-2xl">⭐</span>
                      <h2 className="text-xl font-bold text-gray-900">
                        Optional Features ({editedData.optionalFeatures.length})
                      </h2>
                    </div>
                    <div className="space-y-4">
                      {editedData.optionalFeatures.map((opt, index) => (
                        <div key={opt.id || index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                            <div>
                              <label className="block text-xs font-semibold text-gray-500 mb-1">Name</label>
                              <input
                                type="text"
                                value={opt.name || ''}
                                onChange={(e) => handleOptionalFeatureChange(opt.id, 'name', e.target.value)}
                                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                                placeholder="Feature name"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-gray-500 mb-1">Description</label>
                              <input
                                type="text"
                                value={opt.description || ''}
                                onChange={(e) => handleOptionalFeatureChange(opt.id, 'description', e.target.value)}
                                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                                placeholder="Description"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-gray-500 mb-1">Category</label>
                              <input
                                type="text"
                                value={opt.category || ''}
                                onChange={(e) => handleOptionalFeatureChange(opt.id, 'category', e.target.value)}
                                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                                placeholder="Category"
                              />
                            </div>
                            <div className="flex gap-2">
                              <div className="flex-1">
                                <label className="block text-xs font-semibold text-gray-500 mb-1">Price</label>
                                <input
                                  type="text"
                                  value={opt.price || ''}
                                  onChange={(e) => handleOptionalFeatureChange(opt.id, 'price', e.target.value)}
                                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                                  placeholder="Price"
                                />
                              </div>
                              <button
                                onClick={() => {
                                  const newOpts = editedData.optionalFeatures.filter((_, i) => i !== index);
                                  setEditedData({ ...editedData, optionalFeatures: newOpts });
                                }}
                                className="mt-6 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-medium transition-all"
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => {
                        setEditedData({
                          ...editedData,
                          optionalFeatures: [...(editedData.optionalFeatures || []), { name: '', description: '', category: '', price: '' }]
                        });
                      }}
                      className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-all"
                    >
                      + Add Optional Feature
                    </button>
                  </div>
                ) : (
                  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-2xl">⭐</span>
                      <h2 className="text-xl font-bold text-gray-900">Optional Features</h2>
                    </div>
                    <p className="text-gray-500 text-sm mb-4">No optional features found.</p>
                    <button
                      onClick={() => {
                        setEditedData({
                          ...editedData,
                          optionalFeatures: [{ name: '', description: '', category: '', price: '' }]
                        });
                      }}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-all"
                    >
                      + Add Optional Feature
                    </button>
                  </div>
                )}

                {/* Gallery Images Card */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
                    <span className="text-2xl">🖼️</span>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        Gallery Images ({editedData.galleryFiles?.length || 0})
                      </h2>
                      <p className="text-xs text-gray-500 mt-1">Used in: Image gallery slider on model detail page</p>
                    </div>
                  </div>
                  <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
                    {editedData.galleryFiles && Array.isArray(editedData.galleryFiles) && editedData.galleryFiles.length > 0 ? (
                      editedData.galleryFiles.map((image, index) => (
                        <div key={index} className="flex gap-2 items-center bg-gray-50 p-3 rounded-lg border border-gray-200">
                          <span className="text-gray-500 font-medium w-8">{index + 1}.</span>
                          <input
                            type="text"
                            value={typeof image === 'string' ? image : image.filename || ''}
                            onChange={(e) => {
                              const newGallery = [...editedData.galleryFiles];
                              newGallery[index] = extractFilename(e.target.value);
                              setEditedData({ ...editedData, galleryFiles: newGallery });
                            }}
                            className="flex-1 px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                            placeholder="image.jpg"
                          />
                          <button
                            onClick={() => {
                              const newGallery = editedData.galleryFiles.filter((_, i) => i !== index);
                              setEditedData({ ...editedData, galleryFiles: newGallery });
                            }}
                            className="px-4 py-2.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-medium transition-all"
                          >
                            ✕ Remove
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm text-center py-4">No gallery images found.</p>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={async (e) => {
                        const files = Array.from(e.target.files);
                        if (!files.length) return;
                        
                        if (!editedData.name) {
                          setMessage({ type: 'error', text: 'Please select a model first' });
                          e.target.value = '';
                          return;
                        }
                        
                        try {
                          setMessage({ type: '', text: '' });
                          const uploadedFiles = [];
                          
                          for (const file of files) {
                            const result = await api.uploadFile(file, 'images', editedData.name);
                            console.log('[AdminDashboard] Gallery upload result:', result);
                            // Extract URL from upload response
                            const url = extractUploadUrl(result);
                            console.log('[AdminDashboard] Extracted gallery URL:', url);
                            uploadedFiles.push(url);
                          }
                          
                          const newGallery = [...(editedData.galleryFiles || []), ...uploadedFiles];
                          setEditedData({ ...editedData, galleryFiles: newGallery });
                          setMessage({ type: 'success', text: `${uploadedFiles.length} image(s) uploaded successfully!` });
                        } catch (error) {
                          setMessage({ type: 'error', text: 'Failed to upload image: ' + error.message });
                        }
                        e.target.value = '';
                      }}
                      className="hidden"
                      id="gallery-upload"
                    />
                    <label
                      htmlFor="gallery-upload"
                      className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer text-center font-medium transition-all shadow-sm hover:shadow-md"
                    >
                      📤 Upload Gallery Images
                    </label>
                    <button
                      onClick={() => {
                        const newGallery = [...(editedData.galleryFiles || []), ''];
                        setEditedData({ ...editedData, galleryFiles: newGallery });
                      }}
                      className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-all"
                    >
                      + Add Manually
                    </button>
                  </div>
                </div>

                {/* Left Interior Image Card */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
                    <span className="text-2xl">🖼️</span>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        Left Interior Image
                      </h2>
                      <p className="text-xs text-gray-500 mt-1">Used in: Left side of interior section (30% width)</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editedData.interiorMainImage || ''}
                      onChange={(e) => handleInputChange('interiorMainImage', e.target.value)}
                      className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white text-sm"
                      placeholder="interior-main.jpg"
                    />
                    <label className="block w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer text-center font-medium transition-all shadow-sm hover:shadow-md">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files[0];
                          if (!file) return;
                          if (!editedData.name) {
                            setMessage({ type: 'error', text: 'Please select a model first' });
                            e.target.value = '';
                            return;
                          }
                          try {
                            const result = await api.uploadFile(file, 'images', editedData.name, null, 'Interior');
                            console.log('[AdminDashboard] Upload result for interiorMainImage:', result);
                            // Extract URL from upload response
                            const url = extractUploadUrl(result);
                            console.log('[AdminDashboard] Extracted URL for interiorMainImage:', url);
                            
                            if (!url || url.trim() === '') {
                              console.error('[AdminDashboard] ❌ Extracted URL is empty!');
                              setMessage({ type: 'error', text: 'Failed to extract URL from upload result. Please try again.' });
                              return;
                            }
                            
                            // Store the URL in interiorMainImage field
                            console.log('[AdminDashboard] Calling handleInputChange with:', { field: 'interiorMainImage', value: url });
                            handleInputChange('interiorMainImage', url);
                            
                            // Verify it was set
                            setTimeout(() => {
                              console.log('[AdminDashboard] Verification - editedData.interiorMainImage after set:', editedData?.interiorMainImage);
                            }, 100);
                            
                            setMessage({ type: 'success', text: 'Left interior image uploaded successfully!' });
                          } catch (error) {
                            console.error('[AdminDashboard] Upload error for interiorMainImage:', error);
                            setMessage({ type: 'error', text: 'Failed to upload left interior image: ' + error.message });
                          }
                          e.target.value = '';
                        }}
                      />
                      📤 Upload Left Interior Image
                    </label>
                  </div>
                </div>

                {/* Interior Carousel Images Card */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
                    <span className="text-2xl">🏠</span>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        Interior Carousel Images ({editedData.interiorFiles?.length || 0})
                      </h2>
                      <p className="text-xs text-gray-500 mt-1">Used in: Right side carousel of interior section (70% width)</p>
                    </div>
                  </div>
                  <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
                    {editedData.interiorFiles && Array.isArray(editedData.interiorFiles) && editedData.interiorFiles.length > 0 ? (
                      editedData.interiorFiles.map((image, index) => (
                        <div key={index} className="flex gap-2 items-center bg-gray-50 p-3 rounded-lg border border-gray-200">
                          <span className="text-gray-500 font-medium w-8">{index + 1}.</span>
                          <input
                            type="text"
                            value={typeof image === 'string' ? image : image.filename || ''}
                            onChange={(e) => {
                              const newInterior = [...editedData.interiorFiles];
                              newInterior[index] = extractFilename(e.target.value);
                              setEditedData({ ...editedData, interiorFiles: newInterior });
                            }}
                            className="flex-1 px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                            placeholder="interior-image.jpg"
                          />
                          <button
                            onClick={() => {
                              const newInterior = editedData.interiorFiles.filter((_, i) => i !== index);
                              setEditedData({ ...editedData, interiorFiles: newInterior });
                            }}
                            className="px-4 py-2.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-medium transition-all"
                          >
                            ✕ Remove
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm text-center py-4">No interior images found.</p>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={async (e) => {
                        const files = Array.from(e.target.files);
                        if (!files.length) return;
                        
                        if (!editedData.name) {
                          setMessage({ type: 'error', text: 'Please select a model first' });
                          e.target.value = '';
                          return;
                        }
                        try {
                          setMessage({ type: '', text: '' });
                          const uploadedFiles = [];
                          
                          for (const file of files) {
                            const result = await api.uploadFile(file, 'images', editedData.name, null, 'Interior');
                            // Extract URL from upload response
                            const url = extractUploadUrl(result);
                            uploadedFiles.push(url);
                          }
                          
                          const newInterior = [...(editedData.interiorFiles || []), ...uploadedFiles];
                          setEditedData({ ...editedData, interiorFiles: newInterior });
                          setMessage({ type: 'success', text: `${uploadedFiles.length} interior image(s) uploaded successfully!` });
                        } catch (error) {
                          setMessage({ type: 'error', text: 'Failed to upload interior image: ' + error.message });
                        }
                        e.target.value = '';
                      }}
                      className="hidden"
                      id="interior-upload"
                    />
                    <label
                      htmlFor="interior-upload"
                      className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer text-center font-medium transition-all shadow-sm hover:shadow-md"
                    >
                      📤 Upload Interior Images
                    </label>
                    <button
                      onClick={() => {
                        const newInterior = [...(editedData.interiorFiles || []), ''];
                        setEditedData({ ...editedData, interiorFiles: newInterior });
                      }}
                      className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-all"
                    >
                      + Add Manually
                    </button>
                  </div>
                </div>

                {/* Video Files Card */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
                    <span className="text-2xl">🎥</span>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        Video Files ({editedData.videoFiles?.length || 0})
                      </h2>
                      <p className="text-xs text-gray-500 mt-1">
                        Used in: Video gallery on model detail page. 
                        Supports YouTube URLs (e.g., https://youtube.com/watch?v=...) or local video files.
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
                    {editedData.videoFiles && Array.isArray(editedData.videoFiles) && editedData.videoFiles.length > 0 ? (
                      editedData.videoFiles.map((video, index) => {
                        const videoValue = typeof video === 'string' ? video : video.filename || '';
                        const isYouTube = isYouTubeUrl(videoValue);
                        return (
                          <div key={index} className="flex gap-2 items-center bg-gray-50 p-3 rounded-lg border border-gray-200">
                            <span className="text-gray-500 font-medium w-8">{index + 1}.</span>
                            <div className="flex-1 relative">
                              <input
                                type="text"
                                value={videoValue}
                                onChange={(e) => {
                                  const newVideos = [...editedData.videoFiles];
                                  const inputValue = e.target.value;
                                  // If it's a YouTube URL, keep it as-is. Otherwise, extract filename for local files
                                  if (isYouTubeUrl(inputValue)) {
                                    newVideos[index] = inputValue;
                                  } else {
                                    newVideos[index] = extractFilename(inputValue);
                                  }
                                  setEditedData({ ...editedData, videoFiles: newVideos });
                                }}
                                className={`w-full px-4 py-2.5 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white ${
                                  isYouTube ? 'border-green-300 bg-green-50' : 'border-gray-300'
                                }`}
                                placeholder="video.mp4 or https://youtube.com/watch?v=..."
                              />
                              {isYouTube && (
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 text-green-600 text-xs font-medium">
                                  <span>▶️</span>
                                  <span>YouTube</span>
                                </div>
                              )}
                            </div>
                            <button
                              onClick={() => {
                                const newVideos = editedData.videoFiles.filter((_, i) => i !== index);
                                setEditedData({ ...editedData, videoFiles: newVideos });
                              }}
                              className="px-4 py-2.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-medium transition-all"
                            >
                              ✕ Remove
                            </button>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-gray-500 text-sm text-center py-4">No video files found.</p>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <input
                      type="file"
                      accept="video/*"
                      multiple
                      onChange={async (e) => {
                        const files = Array.from(e.target.files);
                        if (!files.length) return;
                        
                        if (!editedData.name) {
                          setMessage({ type: 'error', text: 'Please select a model first' });
                          e.target.value = '';
                          return;
                        }
                        
                        try {
                          setMessage({ type: '', text: '' });
                          const uploadedFiles = [];
                          
                          for (const file of files) {
                            const result = await api.uploadFile(file, 'images', editedData.name);
                            // Extract URL from upload response
                            const url = extractUploadUrl(result);
                            uploadedFiles.push(url);
                          }
                          
                          const newVideos = [...(editedData.videoFiles || []), ...uploadedFiles];
                          setEditedData({ ...editedData, videoFiles: newVideos });
                          setMessage({ type: 'success', text: `${uploadedFiles.length} video(s) uploaded successfully!` });
                        } catch (error) {
                          setMessage({ type: 'error', text: 'Failed to upload video: ' + error.message });
                        }
                        e.target.value = '';
                      }}
                      className="hidden"
                      id="video-upload"
                    />
                    <label
                      htmlFor="video-upload"
                      className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer text-center font-medium transition-all shadow-sm hover:shadow-md"
                    >
                      📤 Upload Videos
                    </label>
                    <button
                      onClick={() => {
                        const newVideos = [...(editedData.videoFiles || []), ''];
                        setEditedData({ ...editedData, videoFiles: newVideos });
                      }}
                      className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-all"
                    >
                      + Add Manually
                    </button>
                  </div>
                </div>

                {/* Save Button - Sticky Footer */}
                <div className="sticky bottom-0 bg-white rounded-xl shadow-lg p-6 border-2 border-blue-500 mt-6">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      <span className="font-semibold">Ready to save?</span>
                      <span className="ml-2">All changes will be saved to the database.</span>
                    </div>
                    <button
                      onClick={handleSaveModel}
                      disabled={isSaving}
                      className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg shadow-md hover:shadow-lg transition-all"
                    >
                      {isSaving ? (
                        <>
                          <span className="inline-block animate-spin mr-2">⏳</span>
                          Saving...
                        </>
                      ) : (
                        <>
                          <span className="mr-2">💾</span>
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            {/* Category Selector Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <span>🔍</span>
                Select Category to Edit
              </label>
              <select
                value={selectedCategoryId}
                onChange={handleCategoryChange}
                className="w-full max-w-md px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 font-medium transition-all"
              >
                <option value="">-- Choose a category --</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {editedData && (
              <div className="space-y-6">
                {/* Category Info Card */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                    <span className="text-2xl">📁</span>
                    <h2 className="text-xl font-bold text-gray-900">Category Information</h2>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <span>🏷️</span>
                        Category Name
                      </label>
                      <input
                        type="text"
                        value={editedData.name || ''}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                        placeholder="Category name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <span>📂</span>
                        Main Group
                      </label>
                      <select
                        value={editedData.mainGroup || 'inflatableBoats'}
                        onChange={(e) => handleInputChange('mainGroup', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                      >
                        <option value="inflatableBoats">Inflatable Boats</option>
                        <option value="boats">Boats</option>
                      </select>
                      <p className="text-xs text-gray-500 mt-1">Determines which main menu section this category appears in</p>
                    </div>
                    
                    {/* About Category Section */}
                    <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200 mb-6 col-span-2">
                      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <span>📝</span>
                        About Category Section
                      </h3>
                      <p className="text-xs text-gray-600 mb-4">
                        These fields control the "About {editedData.name || 'Category'}" section on the category detail page.
                      </p>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                            <span>📖</span>
                            About Description
                          </label>
                          <p className="text-xs text-gray-500 mb-2">This text appears in the "About {editedData.name || 'Category'}" section on the category detail page.</p>
                          <textarea
                            value={editedData.description || ''}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            rows={5}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white resize-none"
                            placeholder="Enter the description for the 'About' section..."
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <span>🖼️</span>
                            About Section Image
                          </label>
                          <p className="text-xs text-gray-500 mb-2">This image appears on the right side of the "About" section on the category detail page.</p>
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={editedData.image || ''}
                              onChange={(e) => handleInputChange('image', e.target.value)}
                              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white text-sm"
                              placeholder="about-category-image.jpg"
                            />
                            <label className="block w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer text-center font-medium transition-all shadow-sm hover:shadow-md">
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={async (e) => {
                                  const file = e.target.files[0];
                                  if (!file) return;
                                  if (!editedData.name) {
                                    setMessage({ type: 'error', text: 'Please select a category first' });
                                    e.target.value = '';
                                    return;
                                  }
                                  try {
                                    const result = await api.uploadFile(file, 'categories', null, null, null, editedData.name);
                                    // Extract URL from upload response
                                    const url = extractUploadUrl(result);
                                    // Store the full Cloudinary URL
                                    handleInputChange('image', url);
                                    setMessage({ type: 'success', text: 'About section image uploaded successfully!' });
                                  } catch (error) {
                                    setMessage({ type: 'error', text: 'Failed to upload about section image: ' + error.message });
                                  }
                                  e.target.value = '';
                                }}
                              />
                              📤 Upload About Image
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                    
                  {/* Category Images Section */}
                  <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200 mb-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <span>🖼️</span>
                        Category Images
                      </h3>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <span>🖼️</span>
                            Category Thumbnail Image
                          </label>
                          <p className="text-xs text-gray-500 mb-2">Used in: Category cards and listings</p>
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={editedData.image || ''}
                          onChange={(e) => handleInputChange('image', e.target.value)}
                          className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white text-sm"
                          placeholder="category-thumbnail.jpg"
                        />
                        <label className="block w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer text-center font-medium transition-all shadow-sm hover:shadow-md">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files[0];
                              if (!file) return;
                              if (!editedData.name) {
                                setMessage({ type: 'error', text: 'Please select a category first' });
                                e.target.value = '';
                                return;
                              }
                              try {
                                const result = await api.uploadFile(file, 'categories', null, null, null, editedData.name);
                                // Extract URL from upload response
                                const url = extractUploadUrl(result);
                                // Store the full Cloudinary URL
                                handleInputChange('image', url);
                                setMessage({ type: 'success', text: 'Category thumbnail uploaded successfully!' });
                              } catch (error) {
                                setMessage({ type: 'error', text: 'Failed to upload category image: ' + error.message });
                              }
                              e.target.value = '';
                            }}
                          />
                          📤 Upload Thumbnail
                        </label>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <span>🎯</span>
                        Category Hero Image
                      </label>
                      <p className="text-xs text-gray-500 mb-2">Used in: Top banner on category page</p>
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={editedData.heroImage || ''}
                          onChange={(e) => handleInputChange('heroImage', e.target.value)}
                          className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white text-sm"
                          placeholder="category-hero-banner.jpg"
                        />
                        <label className="block w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer text-center font-medium transition-all shadow-sm hover:shadow-md">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files[0];
                              if (!file) return;
                              if (!editedData.name) {
                                setMessage({ type: 'error', text: 'Please select a category first' });
                                e.target.value = '';
                                return;
                              }
                              try {
                                const result = await api.uploadFile(file, 'categories', null, null, null, editedData.name);
                                // Extract URL from upload response
                                const url = extractUploadUrl(result);
                                handleInputChange('heroImage', url);
                                setMessage({ type: 'success', text: 'Category hero banner uploaded successfully!' });
                              } catch (error) {
                                setMessage({ type: 'error', text: 'Failed to upload category hero image: ' + error.message });
                              }
                              e.target.value = '';
                            }}
                          />
                          📤 Upload Hero Banner
                        </label>
                      </div>
                    </div>
                  </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="sticky bottom-0 bg-white rounded-xl shadow-lg p-6 border-2 border-blue-500">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      <span className="font-semibold">Ready to save?</span>
                      <span className="ml-2">All changes will be saved to the database.</span>
                    </div>
                    <button
                      onClick={handleSaveCategory}
                      disabled={isSaving}
                      className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg shadow-md hover:shadow-lg transition-all"
                    >
                      {isSaving ? (
                        <>
                          <span className="inline-block animate-spin mr-2">⏳</span>
                          Saving...
                        </>
                      ) : (
                        <>
                          <span className="mr-2">💾</span>
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Export Tab */}
        {activeTab === 'events' && (
          <div className="space-y-6">
            {/* Event Selector Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <span>🔍</span>
                  Select Event to Edit
                </label>
                <button
                  onClick={handleNewEvent}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all text-sm font-medium"
                >
                  ➕ New Event
                </button>
              </div>
              {isLoadingEvents ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-sm text-gray-500 mt-2">Loading events...</p>
                </div>
              ) : (
                <select
                  value={selectedEventId}
                  onChange={handleEventChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                >
                  <option value="">-- Select an event --</option>
                  {events.map((event) => (
                    <option key={event.id} value={event.id}>
                      {event.name} - {event.location} ({new Date(event.startDate).toLocaleDateString()})
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Event Editor Card */}
            {editedData && (
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <span>📅</span>
                    {editedData.id ? 'Edit Event' : 'Create New Event'}
                  </h2>
                  {editedData.id && (
                    <button
                      onClick={handleDeleteEvent}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all text-sm font-medium"
                    >
                      🗑️ Delete
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Event Name *</label>
                    <input
                      type="text"
                      value={editedData.name || ''}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                      placeholder="Monaco boat Show"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Location *</label>
                    <input
                      type="text"
                      value={editedData.location || ''}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                      placeholder="Monaco"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date *</label>
                    <input
                      type="datetime-local"
                      value={editedData.startDate || ''}
                      onChange={(e) => handleInputChange('startDate', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">End Date</label>
                    <input
                      type="datetime-local"
                      value={editedData.endDate || ''}
                      onChange={(e) => handleInputChange('endDate', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                    <select
                      value={editedData.status || 'upcoming'}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                    >
                      <option value="upcoming">Upcoming</option>
                      <option value="ongoing">Ongoing</option>
                      <option value="past">Past</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Order (Display Priority)</label>
                    <input
                      type="number"
                      value={editedData.order || 0}
                      onChange={(e) => handleInputChange('order', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                      placeholder="0"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Website URL</label>
                    <input
                      type="url"
                      value={editedData.website || ''}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                      placeholder="https://example.com"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                    <textarea
                      value={editedData.description || ''}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white resize-none"
                      placeholder="Event description..."
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Event Image</label>
                    <input
                      type="text"
                      value={editedData.image || ''}
                      onChange={(e) => handleInputChange('image', e.target.value)}
                      className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white text-sm mb-2"
                      placeholder="event-image.jpg"
                    />
                    <label className="block w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer text-center font-medium transition-all shadow-sm hover:shadow-md">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files[0];
                          if (!file) return;
                          try {
                            // Upload to a general events folder
                            const result = await api.uploadFile(file, 'images', 'Events', null, null, null);
                            const url = extractUploadUrl(result);
                            // Store the full Cloudinary URL
                            handleInputChange('image', url);
                            setMessage({ type: 'success', text: 'Event image uploaded successfully!' });
                          } catch (error) {
                            setMessage({ type: 'error', text: 'Failed to upload image: ' + error.message });
                          }
                          e.target.value = '';
                        }}
                      />
                      📤 Upload Event Image
                    </label>
                  </div>
                </div>

                <div className="flex gap-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={handleSaveEvent}
                    disabled={isSaving || !editedData.name || !editedData.location || !editedData.startDate}
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all font-medium shadow-sm hover:shadow-md"
                  >
                    {isSaving ? '💾 Saving...' : '💾 Save Event'}
                  </button>
                  <button
                    onClick={() => {
                      setSelectedEventId('');
                      setEditedData(null);
                    }}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'export' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Export Data</h2>
            <p className="text-gray-600 mb-6">
              Export all models and categories data as a JSON file for backup or migration.
            </p>
            <button
              onClick={handleExport}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Export to JSON
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
