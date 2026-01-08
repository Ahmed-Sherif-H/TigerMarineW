/**
 * API Service - Handles all backend API calls
 */

// Get API URL from environment or use fallback
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Always log the API URL being used (helps debug)
console.log('[API] Backend URL:', API_BASE_URL);
console.log('[API] VITE_API_URL env var:', import.meta.env.VITE_API_URL || 'NOT SET');
console.log('[API] Environment:', import.meta.env.MODE || 'unknown');

// Warn if using localhost in production
if (import.meta.env.PROD && API_BASE_URL.includes('localhost')) {
  console.error('[API] ⚠️ CRITICAL: Using localhost in production!');
  console.error('[API] Set VITE_API_URL in Netlify environment variables and redeploy!');
  console.error('[API] Expected: https://tigermarinewbackend.onrender.com/api');
}

// Keep-alive ping for Render free tier (prevents sleeping)
if (import.meta.env.PROD && API_BASE_URL.includes('onrender.com')) {
  // Ping backend every 10 minutes to keep it awake
  setInterval(async () => {
    try {
      await api.healthCheck();
      console.log('[Keep-Alive] ✅ Backend pinged successfully');
    } catch (error) {
      console.warn('[Keep-Alive] ⚠️ Ping failed (backend might be sleeping):', error.message);
    }
  }, 10 * 60 * 1000); // Every 10 minutes
  
  // Initial ping after 30 seconds (give time for page to load)
  setTimeout(async () => {
    try {
      await api.healthCheck();
      console.log('[Keep-Alive] ✅ Initial backend ping successful');
    } catch (error) {
      console.warn('[Keep-Alive] ⚠️ Initial ping failed:', error.message);
    }
  }, 30000); // 30 seconds
}

class ApiService {
  // Health check - test if backend is awake
  async healthCheck() {
    try {
      const healthUrl = `${API_BASE_URL}/health`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(healthUrl, {
        method: 'GET',
        signal: controller.signal,
        credentials: 'include'
      });
      
      clearTimeout(timeoutId);
      return response.ok;
    } catch (error) {
      console.warn('[API] Backend health check failed:', error.message);
      return false;
    }
  }
  
  // Alias for backward compatibility
  async checkBackendHealth() {
    return this.healthCheck();
  }

  // Generic fetch method
  async fetch(endpoint, options = {}) {
    // Ensure endpoint starts with / if it doesn't already
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${API_BASE_URL}${cleanEndpoint}`;
    console.log('[API] Fetching:', url);
    console.log('[API] Full URL:', url);
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
      credentials: 'include', // Include credentials for CORS
    };
    
    // Only add signal if not already provided
    let timeoutId = null;
    if (!config.signal) {
      const controller = new AbortController();
      timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
      config.signal = controller.signal;
    }

    // Add body if present
    if (options.body && typeof options.body === 'object') {
      config.body = JSON.stringify(options.body);
    }

    try {
      const response = await fetch(url, config);
      if (timeoutId) clearTimeout(timeoutId); // Clear timeout if request succeeds
      
      // Check if response is JSON before parsing
      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.error('[API] Non-JSON response:', text);
        throw new Error(`Invalid response format: ${response.status}`);
      }

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      if (timeoutId) clearTimeout(timeoutId); // Clear timeout on error
      
      console.error('[API] Error details:');
      console.error('  URL:', url);
      console.error('  Error:', error.message);
      console.error('  Type:', error.name);
      
      // Provide helpful error message
      if (error.message.includes('Failed to fetch') || error.message.includes('ERR_CONNECTION_REFUSED') || error.name === 'TypeError') {
        const helpfulError = new Error(
          `Cannot connect to backend. Check that the backend is running at: ${API_BASE_URL}`
        );
        console.error('[API]', helpfulError.message);
        throw helpfulError;
      }
      
      // Handle timeout
      if (error.name === 'AbortError' || error.message.includes('aborted')) {
        const timeoutError = new Error(`Request timed out. Please try again.`);
        console.error('[API]', timeoutError.message);
        throw timeoutError;
      }
      
      throw error;
    }
  }

  // Health check
  async healthCheck() {
    return this.fetch('/health');
  }

  // ========== MODELS ==========
  async getAllModels() {
    const response = await this.fetch('/models');
    return response.data || [];
  }

  async getModelById(id) {
    const response = await this.fetch(`/models/${id}`);
    console.log('API Response:', response);
    return response.data || response; // Handle both formats
  }

  async createModel(modelData) {
    const response = await this.fetch('/models', {
      method: 'POST',
      body: modelData,
    });
    return response.data;
  }

  async updateModel(id, modelData) {
    const response = await this.fetch(`/models/${id}`, {
      method: 'PUT',
      body: modelData,
    });
    // Backend may return { success: true, data: {...} } or direct model data
    // Return the full response so frontend can check both formats
    return response.data || response;
  }

  async deleteModel(id) {
    const response = await this.fetch(`/models/${id}`, {
      method: 'DELETE',
    });
    return response;
  }

  // ========== CATEGORIES ==========
  async getAllCategories() {
    const response = await this.fetch('/categories');
    return response.data || [];
  }

  async updateCategory(id, data) {
    return this.fetch(`/categories/${id}`, {
      method: 'PUT',
      body: data,
    });
  }

  // ========== EVENTS ==========
  async getAllEvents() {
    console.log('[API] Fetching all events');
    return this.fetch('/events');
  }

  async getEventById(id) {
    console.log('[API] Fetching event by ID:', id);
    return this.fetch(`/events/${id}`);
  }

  async createEvent(eventData) {
    console.log('[API] Creating event');
    return this.fetch('/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData)
    });
  }

  async updateEvent(id, eventData) {
    console.log('[API] Updating event:', id);
    return this.fetch(`/events/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData)
    });
  }

  async deleteEvent(id) {
    console.log('[API] Deleting event:', id);
    return this.fetch(`/events/${id}`, {
      method: 'DELETE'
    });
  }

  // ========== INQUIRIES ==========
  async submitContactForm(data) {
    // Use longer timeout for form submissions (backend might be sleeping + email sending)
    const url = `${API_BASE_URL}/inquiries/contact`;
    console.log('[API] Submitting contact form to:', url);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 90000); // 90 second timeout for forms
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include',
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      const contentType = response.headers.get('content-type');
      let responseData;
      
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        const text = await response.text();
        throw new Error(`Invalid response: ${response.status} - ${text}`);
      }
      
      if (!response.ok) {
        throw new Error(responseData.error || `HTTP error! status: ${response.status}`);
      }
      
      return responseData;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError' || error.message.includes('aborted')) {
        throw new Error(
          'Request timed out. The backend might be waking up (can take 30-60 seconds on Render free tier). ' +
          'Please wait a moment and try again.'
        );
      }
      
      if (error.message.includes('Failed to fetch') || error.name === 'TypeError') {
        throw new Error(
          'Cannot connect to backend. The backend might be sleeping. ' +
          'Please wait a moment and try again.'
        );
      }
      
      throw error;
    }
  }

  async submitCustomizerInquiry(data) {
    // Use longer timeout for form submissions (backend might be sleeping + email sending)
    const url = `${API_BASE_URL}/inquiries/customizer`;
    console.log('[API] Submitting customizer inquiry to:', url);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 90000); // 90 second timeout for forms
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include',
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      const contentType = response.headers.get('content-type');
      let responseData;
      
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        const text = await response.text();
        throw new Error(`Invalid response: ${response.status} - ${text}`);
      }
      
      if (!response.ok) {
        throw new Error(responseData.error || `HTTP error! status: ${response.status}`);
      }
      
      return responseData;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError' || error.message.includes('aborted')) {
        throw new Error(
          'Request timed out. The backend might be waking up (can take 30-60 seconds on Render free tier). ' +
          'Please wait a moment and try again.'
        );
      }
      
      if (error.message.includes('Failed to fetch') || error.name === 'TypeError') {
        throw new Error(
          'Cannot connect to backend. The backend might be sleeping. ' +
          'Please wait a moment and try again.'
        );
      }
      
      throw error;
    }
  }

  async getCategoryById(id) {
    const response = await this.fetch(`/categories/${id}`);
    return response.data;
  }

  async createCategory(categoryData) {
    const response = await this.fetch('/categories', {
      method: 'POST',
      body: categoryData,
    });
    return response.data;
  }

  async updateCategory(id, categoryData) {
    const response = await this.fetch(`/categories/${id}`, {
      method: 'PUT',
      body: categoryData,
    });
    return response.data;
  }

  async deleteCategory(id) {
    const response = await this.fetch(`/categories/${id}`, {
      method: 'DELETE',
    });
    return response;
  }

  // ========== UPLOAD ==========
  async uploadFile(file, folder, modelName = null, partName = null, subfolder = null, categoryName = null) {
    // Validate required fields based on folder type
    if (folder === 'images' && !modelName) {
      throw new Error('modelName is required for image uploads');
    }
    if (folder === 'categories' && !categoryName) {
      throw new Error('categoryName is required for category uploads');
    }
    if (folder === 'customizer' && (!modelName || !partName)) {
      throw new Error('modelName and partName are required for customizer uploads');
    }
    
    // Validate folder is provided
    if (!folder) {
      throw new Error('Folder is required for upload');
    }
    
    // Map model name to folder name (e.g., SL480 -> SportLine480)
    // This ensures uploads go to the correct folder that matches the actual folder structure
    let mappedModelName = modelName;
    if (modelName && folder === 'images') {
      const MODEL_FOLDER_MAP = {
        'TL950': 'TopLine950',
        'TL850': 'TopLine850',
        'TL750': 'TopLine750',
        'TL650': 'TopLine650',
        'PL620': 'ProLine620',
        'PL550': 'ProLine550',
        'SL520': 'SportLine520',
        'SL480': 'SportLine480',
        'OP850': 'Open850',
        'OP750': 'Open750',
        'OP650': 'Open650',
        'ML38': 'MaxLine 38',
        'Infinity 280': 'Infinity 280'
      };
      mappedModelName = MODEL_FOLDER_MAP[modelName] || modelName;
      if (mappedModelName !== modelName) {
        console.log(`[API] Mapping model name: ${modelName} -> ${mappedModelName}`);
      }
    }
    
    const formData = new FormData();
    // IMPORTANT: Append fields BEFORE file to ensure they're parsed first
    formData.append('folder', String(folder)); // Must be first!
    if (mappedModelName) {
      formData.append('modelName', String(mappedModelName));
    }
    if (categoryName) {
      formData.append('categoryName', String(categoryName));
    }
    if (partName) {
      formData.append('partName', String(partName));
    }
    if (subfolder) {
      formData.append('subfolder', String(subfolder));
    }
    // Append file LAST
    formData.append('file', file);
    
    const url = `${API_BASE_URL}/upload/single`;
    console.log('[API] Uploading file to:', url);
    console.log('[API] File:', file.name, 'Size:', file.size);
    console.log('[API] FormData fields:', {
      folder,
      modelName: modelName || 'none',
      categoryName: categoryName || 'none',
      subfolder: subfolder || 'none'
    });
    
    // Debug: Log FormData entries (for development)
    if (import.meta.env.DEV) {
      for (const [key, value] of formData.entries()) {
        console.log(`  FormData[${key}]:`, value instanceof File ? `File: ${value.name}` : value);
      }
    }
    
    try {
      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout for uploads
      
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
        // Don't set Content-Type header - browser will set it with boundary
        credentials: 'include', // Include credentials for CORS
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId); // Clear timeout on success

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.error('[API] Upload non-JSON response:', text);
        throw new Error(`Invalid response format: ${response.status} - ${text}`);
      }

      if (!response.ok) {
        console.error('[API] Upload failed:', data);
        throw new Error(data.error || `Upload failed: ${response.status}`);
      }

      console.log('[API] Upload successful:', data);
      return data;
    } catch (error) {
      if (timeoutId) clearTimeout(timeoutId); // Clear timeout on error
      
      console.error('[API] Upload error details:', {
        url,
        error: error.message,
        name: error.name
      });
      
      // Provide helpful error message
      if (error.name === 'AbortError' || error.message.includes('timeout') || error.message.includes('aborted')) {
        throw new Error('Upload timed out. Please try again.');
      }
      
      if (error.message.includes('Failed to fetch') || error.name === 'TypeError') {
        throw new Error('Cannot connect to backend. Check that the backend is running.');
      }
      
      throw error;
    }
  }

  async uploadMultipleFiles(files, folder, modelName, partName = null) {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    formData.append('folder', folder);
    formData.append('modelName', modelName);
    if (partName) {
      formData.append('partName', partName);
    }

    const url = `${API_BASE_URL}/upload/multiple`;
    console.log('[API] Uploading multiple files to:', url);
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
        credentials: 'include', // Include credentials for CORS
      });

      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        throw new Error(`Invalid response format: ${response.status} - ${text}`);
      }

      if (!response.ok) {
        throw new Error(data.error || `Upload failed: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('[API] Multiple upload error:', error);
      throw error;
    }
  }

  async listFiles(folder, modelName, partName = null) {
    const params = new URLSearchParams({ folder, modelName });
    if (partName) {
      params.append('partName', partName);
    }
    const response = await this.fetch(`/upload/list?${params}`);
    return response.files || [];
  }

  async deleteFile(filePath) {
    const response = await this.fetch('/upload/delete', {
      method: 'DELETE',
      body: { filePath },
    });
    return response;
  }
}

export default new ApiService();

