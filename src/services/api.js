/**
 * API Service - Handles all backend API calls
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiService {
  // Generic fetch method
  async fetch(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add body if present
    if (options.body && typeof options.body === 'object') {
      config.body = JSON.stringify(options.body);
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
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
    return response.data;
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

  // ========== INQUIRIES ==========
  async submitContactForm(data) {
    return this.fetch('/inquiries/contact', {
      method: 'POST',
      body: data,
    });
  }

  async submitCustomizerInquiry(data) {
    return this.fetch('/inquiries/customizer', {
      method: 'POST',
      body: data,
    });
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
  async uploadFile(file, folder, modelName, partName = null) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    formData.append('modelName', modelName);
    if (partName) {
      formData.append('partName', partName);
    }

    const url = `${API_BASE_URL}/upload/single`;
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      // Don't set Content-Type header - browser will set it with boundary
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || `Upload failed: ${response.status}`);
    }

    return data;
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
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || `Upload failed: ${response.status}`);
    }

    return data;
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

