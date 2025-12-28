import React, { useState, useEffect } from 'react';
import { useModels } from '../context/ModelsContext';
import api from '../services/api';
import { 
  normalizeModelDataForSave, 
  normalizeModelDataForEdit,
  extractFilename 
} from '../utils/backendConfig';

const AdminDashboard = () => {
  const { models, categories, loading, refreshModels } = useModels();
  const [activeTab, setActiveTab] = useState('models');
  const [selectedModelId, setSelectedModelId] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [editedData, setEditedData] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingModel, setIsLoadingModel] = useState(false);

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

  const loadModelData = async (id) => {
    setIsLoadingModel(true);
    setMessage({ type: '', text: '' });
    try {
      const modelData = await api.getModelById(id);
      console.log('[AdminDashboard] Loaded raw model data:', modelData);
      
      if (modelData && (modelData.id || modelData.name)) {
        // Normalize data: extract filenames from paths
        const normalizedData = normalizeModelDataForEdit(modelData);
        console.log('[AdminDashboard] Normalized model data:', normalizedData);
        
        setEditedData(normalizedData);
        console.log('[AdminDashboard] Model data loaded and set successfully');
      } else {
        console.error('[AdminDashboard] Invalid model data:', modelData);
        setMessage({ type: 'error', text: 'Invalid model data received' });
        setEditedData(null);
      }
    } catch (error) {
      console.error('[AdminDashboard] Error loading model:', error);
      setMessage({ type: 'error', text: 'Failed to load model data: ' + error.message });
      setEditedData(null);
    } finally {
      setIsLoadingModel(false);
    }
  };

  const loadCategoryData = async (id) => {
    try {
      const category = categories.find(c => c.id === parseInt(id));
      if (category) {
        setEditedData({
          id: category.id,
          name: category.name,
          description: category.description || '',
          image: category.image || '',
          heroImage: category.heroImage || '',
        });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load category data' });
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

  const handleInputChange = (field, value) => {
    // For image file fields, extract just the filename (not the full path)
    if (field === 'imageFile' || field === 'heroImageFile' || field === 'contentImageFile') {
      value = extractFilename(value);
    }
    
    setEditedData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSpecChange = (specId, field, value) => {
    setEditedData(prev => ({
      ...prev,
      specs: prev.specs.map(spec =>
        spec.id === specId ? { ...spec, [field]: value } : spec
      )
    }));
  };

  const handleFeatureChange = (featureId, value) => {
    setEditedData(prev => ({
      ...prev,
      features: prev.features.map(feature =>
        feature.id === featureId ? { ...feature, feature: value } : feature
      )
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
      // Normalize data: ensure all image fields contain only filenames
      const dataToSave = normalizeModelDataForSave(editedData);
      
      console.log('[AdminDashboard] Saving model data:', {
        id: dataToSave.id,
        name: dataToSave.name,
        imageFile: dataToSave.imageFile,
        heroImageFile: dataToSave.heroImageFile,
        contentImageFile: dataToSave.contentImageFile,
        galleryFilesCount: dataToSave.galleryFiles?.length || 0,
        interiorFilesCount: dataToSave.interiorFiles?.length || 0,
        videoFilesCount: dataToSave.videoFiles?.length || 0,
      });
      
      const response = await api.updateModel(editedData.id, dataToSave);
      
      if (response.success) {
        setMessage({ type: 'success', text: 'Model updated successfully!' });
        
        // Refresh models list
        await refreshModels();
        
        // Reload the specific model to get the updated version from database
        // This ensures we have the latest data with proper filenames
        await loadModelData(editedData.id);
        
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        setMessage({ type: 'error', text: response.message || 'Failed to update model' });
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
      const response = await api.updateCategory(editedData.id, editedData);
      if (response.success) {
        setMessage({ type: 'success', text: 'Category updated successfully!' });
        await refreshModels();
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        setMessage({ type: 'error', text: response.message || 'Failed to update category' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update category' });
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">Manage models, categories, and export data</p>
        </div>

        {/* Message Alert */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message.text}
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {['models', 'categories', 'export'].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setSelectedModelId('');
                  setSelectedCategoryId('');
                  setEditedData(null);
                  setMessage({ type: '', text: '' });
                }}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Models Tab */}
        {activeTab === 'models' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Model
              </label>
              <select
                value={selectedModelId}
                onChange={handleModelChange}
                className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">-- Choose a model --</option>
                {models.map((model) => (
                  <option key={model.id} value={String(model.id)}>
                    {model.name}
                  </option>
                ))}
              </select>
            </div>

            {isLoadingModel && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading model data...</p>
              </div>
            )}

            {!isLoadingModel && editedData && (
              <div className="space-y-6">
                {/* Debug Info - Remove in production */}
                <div className="bg-gray-100 p-4 rounded-lg text-xs">
                  <details>
                    <summary className="cursor-pointer font-semibold text-gray-700">Debug: View Raw Data</summary>
                    <pre className="mt-2 overflow-auto max-h-40 bg-white p-2 rounded">
                      {JSON.stringify(editedData, null, 2)}
                    </pre>
                  </details>
                </div>

                {/* Basic Info */}
                <div className="border-b border-gray-200 pb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Model Name
                      </label>
                      <input
                        type="text"
                        value={editedData.name || ''}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        value={editedData.description || ''}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Short Description
                      </label>
                      <textarea
                        value={editedData.shortDescription || ''}
                        onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                        rows={2}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Section 2 Title
                        </label>
                        <input
                          type="text"
                          value={editedData.section2Title || ''}
                          onChange={(e) => handleInputChange('section2Title', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Section 2 Description
                        </label>
                        <textarea
                          value={editedData.section2Description || ''}
                          onChange={(e) => handleInputChange('section2Description', e.target.value)}
                          rows={2}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Image File (Thumbnail)
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={editedData.imageFile || ''}
                            onChange={(e) => handleInputChange('imageFile', e.target.value)}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Image filename"
                          />
                          <label className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer">
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
                                  handleInputChange('imageFile', result.filename);
                                  setMessage({ type: 'success', text: 'Image uploaded successfully!' });
                                } catch (error) {
                                  setMessage({ type: 'error', text: 'Failed to upload image: ' + error.message });
                                }
                                e.target.value = ''; // Reset input
                              }}
                            />
                            Upload
                          </label>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Hero Image
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={editedData.heroImageFile || ''}
                            onChange={(e) => handleInputChange('heroImageFile', e.target.value)}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Hero image filename"
                          />
                          <label className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer">
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={async (e) => {
                                const file = e.target.files[0];
                                if (!file) return;
                                try {
                                  if (!editedData.name) {
                                    setMessage({ type: 'error', text: 'Please select a model first' });
                                    e.target.value = '';
                                    return;
                                  }
                                  const result = await api.uploadFile(file, 'images', editedData.name);
                                  handleInputChange('heroImageFile', result.filename);
                                  setMessage({ type: 'success', text: 'Hero image uploaded successfully!' });
                                } catch (error) {
                                  setMessage({ type: 'error', text: 'Failed to upload hero image: ' + error.message });
                                }
                                e.target.value = '';
                              }}
                            />
                            Upload
                          </label>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Content Image
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={editedData.contentImageFile || ''}
                            onChange={(e) => handleInputChange('contentImageFile', e.target.value)}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Content image filename"
                          />
                          <label className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer">
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
                                  handleInputChange('contentImageFile', result.filename);
                                  setMessage({ type: 'success', text: 'Content image uploaded successfully!' });
                                } catch (error) {
                                  setMessage({ type: 'error', text: 'Failed to upload content image: ' + error.message });
                                }
                                e.target.value = '';
                              }}
                            />
                            Upload
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Specs */}
                {editedData.specs && Array.isArray(editedData.specs) && editedData.specs.length > 0 ? (
                  <div className="border-b border-gray-200 pb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Specifications ({editedData.specs.length})</h2>
                    <div className="space-y-3">
                      {editedData.specs.map((spec) => (
                        <div key={spec.id || spec.key} className="grid grid-cols-2 gap-4">
                          <input
                            type="text"
                            value={spec.key || ''}
                            onChange={(e) => handleSpecChange(spec.id, 'key', e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Spec Key"
                          />
                          <input
                            type="text"
                            value={spec.value || ''}
                            onChange={(e) => handleSpecChange(spec.id, 'value', e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Spec Value"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="border-b border-gray-200 pb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Specifications</h2>
                    <p className="text-gray-500 text-sm">No specifications found. Data may still be loading...</p>
                  </div>
                )}

                {/* Features */}
                {editedData.features && Array.isArray(editedData.features) && editedData.features.length > 0 ? (
                  <div className="border-b border-gray-200 pb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Features ({editedData.features.length})</h2>
                    <div className="space-y-3">
                      {editedData.features.map((feature) => (
                        <input
                          key={feature.id || feature.feature}
                          type="text"
                          value={feature.feature || ''}
                          onChange={(e) => handleFeatureChange(feature.id, e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Feature description"
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="border-b border-gray-200 pb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Features</h2>
                    <p className="text-gray-500 text-sm">No features found. Data may still be loading...</p>
                  </div>
                )}

                {/* Optional Features */}
                {editedData.optionalFeatures && Array.isArray(editedData.optionalFeatures) && editedData.optionalFeatures.length > 0 ? (
                  <div className="border-b border-gray-200 pb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Optional Features ({editedData.optionalFeatures.length})</h2>
                    <div className="space-y-4">
                      {editedData.optionalFeatures.map((opt) => (
                        <div key={opt.id || opt.name} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <input
                            type="text"
                            value={opt.name || ''}
                            onChange={(e) => handleOptionalFeatureChange(opt.id, 'name', e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Name"
                          />
                          <input
                            type="text"
                            value={opt.description || ''}
                            onChange={(e) => handleOptionalFeatureChange(opt.id, 'description', e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Description"
                          />
                          <input
                            type="text"
                            value={opt.category || ''}
                            onChange={(e) => handleOptionalFeatureChange(opt.id, 'category', e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Category"
                          />
                          <input
                            type="text"
                            value={opt.price || ''}
                            onChange={(e) => handleOptionalFeatureChange(opt.id, 'price', e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Price"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="border-b border-gray-200 pb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Optional Features</h2>
                    <p className="text-gray-500 text-sm">No optional features found. Data may still be loading...</p>
                  </div>
                )}

                {/* Gallery Images */}
                <div className="border-b border-gray-200 pb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Gallery Images ({editedData.galleryFiles?.length || 0})
                  </h2>
                  <div className="space-y-3 mb-4">
                    {editedData.galleryFiles && Array.isArray(editedData.galleryFiles) && editedData.galleryFiles.length > 0 ? (
                      editedData.galleryFiles.map((image, index) => (
                        <div key={index} className="flex gap-2 items-center">
                          <input
                            type="text"
                            value={typeof image === 'string' ? image : image.filename || ''}
                            onChange={(e) => {
                              const newGallery = [...editedData.galleryFiles];
                              // Extract filename from user input (in case they enter a full path)
                              newGallery[index] = extractFilename(e.target.value);
                              setEditedData({ ...editedData, galleryFiles: newGallery });
                            }}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Image filename"
                          />
                          <button
                            onClick={() => {
                              const newGallery = editedData.galleryFiles.filter((_, i) => i !== index);
                              setEditedData({ ...editedData, galleryFiles: newGallery });
                            }}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                          >
                            Remove
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">No gallery images found.</p>
                    )}
                  </div>
                  <div className="flex gap-2">
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
                            // Extract filename to ensure we store just the filename, not a path
                            uploadedFiles.push(extractFilename(result.filename));
                          }
                          
                          const newGallery = [...(editedData.galleryFiles || []), ...uploadedFiles];
                          setEditedData({ ...editedData, galleryFiles: newGallery });
                          setMessage({ type: 'success', text: `${uploadedFiles.length} image(s) uploaded successfully!` });
                        } catch (error) {
                          setMessage({ type: 'error', text: 'Failed to upload image: ' + error.message });
                        }
                        e.target.value = ''; // Reset input
                      }}
                      className="hidden"
                      id="gallery-upload"
                    />
                    <label
                      htmlFor="gallery-upload"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
                    >
                      Upload Gallery Image
                    </label>
                    <button
                      onClick={() => {
                        const newGallery = [...(editedData.galleryFiles || []), ''];
                        setEditedData({ ...editedData, galleryFiles: newGallery });
                      }}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                    >
                      Add Manually
                    </button>
                  </div>
                </div>

                {/* Interior Images */}
                <div className="border-b border-gray-200 pb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Interior Images ({editedData.interiorFiles?.length || 0})
                  </h2>
                  <div className="space-y-3 mb-4">
                    {editedData.interiorFiles && Array.isArray(editedData.interiorFiles) && editedData.interiorFiles.length > 0 ? (
                      editedData.interiorFiles.map((image, index) => (
                        <div key={index} className="flex gap-2 items-center">
                          <input
                            type="text"
                            value={typeof image === 'string' ? image : image.filename || ''}
                            onChange={(e) => {
                              const newInterior = [...editedData.interiorFiles];
                              // Extract filename from user input (in case they enter a full path)
                              newInterior[index] = extractFilename(e.target.value);
                              setEditedData({ ...editedData, interiorFiles: newInterior });
                            }}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Interior image filename"
                          />
                          <button
                            onClick={() => {
                              const newInterior = editedData.interiorFiles.filter((_, i) => i !== index);
                              setEditedData({ ...editedData, interiorFiles: newInterior });
                            }}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                          >
                            Remove
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">No interior images found.</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={async (e) => {
                        const files = Array.from(e.target.files);
                        if (!files.length) return;
                        
                        try {
                          if (!editedData.name) {
                            setMessage({ type: 'error', text: 'Please select a model first' });
                            e.target.value = '';
                            return;
                          }
                          setMessage({ type: '', text: '' });
                          const uploadedFiles = [];
                          
                          for (const file of files) {
                            // Upload to Interior subfolder
                            const result = await api.uploadFile(file, 'images', editedData.name, null, 'Interior');
                            // Extract filename to ensure we store just the filename, not a path
                            uploadedFiles.push(extractFilename(result.filename));
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
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
                    >
                      Upload Interior Image
                    </label>
                    <button
                      onClick={() => {
                        const newInterior = [...(editedData.interiorFiles || []), ''];
                        setEditedData({ ...editedData, interiorFiles: newInterior });
                      }}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                    >
                      Add Manually
                    </button>
                  </div>
                </div>

                {/* Video Files */}
                <div className="border-b border-gray-200 pb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Video Files ({editedData.videoFiles?.length || 0})
                  </h2>
                  <div className="space-y-3 mb-4">
                    {editedData.videoFiles && Array.isArray(editedData.videoFiles) && editedData.videoFiles.length > 0 ? (
                      editedData.videoFiles.map((video, index) => (
                        <div key={index} className="flex gap-2 items-center">
                          <input
                            type="text"
                            value={typeof video === 'string' ? video : video.filename || ''}
                            onChange={(e) => {
                              const newVideos = [...editedData.videoFiles];
                              // Extract filename from user input (in case they enter a full path)
                              newVideos[index] = extractFilename(e.target.value);
                              setEditedData({ ...editedData, videoFiles: newVideos });
                            }}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Video filename"
                          />
                          <button
                            onClick={() => {
                              const newVideos = editedData.videoFiles.filter((_, i) => i !== index);
                              setEditedData({ ...editedData, videoFiles: newVideos });
                            }}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                          >
                            Remove
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">No video files found.</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="file"
                      accept="video/*"
                      multiple
                      onChange={async (e) => {
                        const files = Array.from(e.target.files);
                        if (!files.length) return;
                        
                        try {
                          if (!editedData.name) {
                            setMessage({ type: 'error', text: 'Please select a model first' });
                            e.target.value = '';
                            return;
                          }
                          setMessage({ type: '', text: '' });
                          const uploadedFiles = [];
                          
                          for (const file of files) {
                            const result = await api.uploadFile(file, 'images', editedData.name);
                            // Extract filename to ensure we store just the filename, not a path
                            uploadedFiles.push(extractFilename(result.filename));
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
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
                    >
                      Upload Video
                    </label>
                    <button
                      onClick={() => {
                        const newVideos = [...(editedData.videoFiles || []), ''];
                        setEditedData({ ...editedData, videoFiles: newVideos });
                      }}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                    >
                      Add Manually
                    </button>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                  <button
                    onClick={handleSaveModel}
                    disabled={isSaving}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Category
              </label>
              <select
                value={selectedCategoryId}
                onChange={handleCategoryChange}
                className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                <div className="border-b border-gray-200 pb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Category Information</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category Name
                      </label>
                      <input
                        type="text"
                        value={editedData.name || ''}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        value={editedData.description || ''}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Category Image
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={editedData.image || ''}
                            onChange={(e) => handleInputChange('image', e.target.value)}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Image filename"
                          />
                          <label className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer">
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={async (e) => {
                                const file = e.target.files[0];
                                if (!file) return;
                                try {
                                  const result = await api.uploadFile(file, 'categories', null, null, null, editedData.name);
                                  handleInputChange('image', result.filename);
                                  setMessage({ type: 'success', text: 'Category image uploaded successfully!' });
                                } catch (error) {
                                  setMessage({ type: 'error', text: 'Failed to upload image: ' + error.message });
                                }
                                e.target.value = '';
                              }}
                            />
                            Upload
                          </label>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Hero Image
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={editedData.heroImage || ''}
                            onChange={(e) => handleInputChange('heroImage', e.target.value)}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Hero image filename"
                          />
                          <label className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer">
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={async (e) => {
                                const file = e.target.files[0];
                                if (!file) return;
                                try {
                                  const result = await api.uploadFile(file, 'categories', null, null, null, editedData.name);
                                  handleInputChange('heroImage', result.filename);
                                  setMessage({ type: 'success', text: 'Hero image uploaded successfully!' });
                                } catch (error) {
                                  setMessage({ type: 'error', text: 'Failed to upload hero image: ' + error.message });
                                }
                                e.target.value = '';
                              }}
                            />
                            Upload
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleSaveCategory}
                    disabled={isSaving}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Export Tab */}
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
