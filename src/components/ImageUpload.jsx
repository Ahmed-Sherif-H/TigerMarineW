import { useState } from 'react';
import api from '../services/api';

const ImageUpload = ({ 
  label, 
  currentValue, 
  onUpload, 
  folder = 'images',
  modelName,
  partName = null,
  accept = 'image/*,video/*',
  multiple = false
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    try {
      setUploading(true);
      setError(null);
      setSuccess(null);

      if (multiple) {
        const result = await api.uploadMultipleFiles(files, folder, modelName, partName);
        setSuccess(`${result.files.length} files uploaded successfully!`);
        if (onUpload) {
          onUpload(result.files.map(f => f.filename));
        }
      } else {
        const result = await api.uploadFile(files[0], folder, modelName, partName);
        setSuccess('File uploaded successfully!');
        if (onUpload) {
          onUpload(result.filename);
        }
      }
    } catch (err) {
      setError(err.message);
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      
      {currentValue && (
        <div className="mb-2">
          <span className="text-sm text-gray-600">Current: {currentValue}</span>
        </div>
      )}

      <div className="flex items-center gap-4">
        <label className="cursor-pointer px-4 py-2 bg-smoked-saffron text-white rounded-lg hover:bg-smoked-saffron/90 transition inline-block">
          {uploading ? 'Uploading...' : multiple ? 'Upload Files' : 'Upload File'}
          <input
            type="file"
            className="hidden"
            accept={accept}
            multiple={multiple}
            onChange={handleFileChange}
            disabled={uploading || !modelName}
          />
        </label>
        
        {error && (
          <span className="text-sm text-red-600">{error}</span>
        )}
        
        {success && (
          <span className="text-sm text-green-600">{success}</span>
        )}
      </div>
      
      {!modelName && (
        <p className="text-xs text-gray-500 mt-1">Save model name first to enable upload</p>
      )}
    </div>
  );
};

export default ImageUpload;


