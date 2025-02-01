// src/components/subscription/BillUploader.jsx
import React, { useState } from 'react';
import { processBillImage } from '../../services/ocr/textExtraction';
import { useLighthouse } from '../../hooks/useLighthouse';
import LoadingSpinner from '../common/LoadingSpinner';

const BillUploader = ({ onProcessed }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { uploadFile } = useLighthouse();

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      setError(null);

      // Extract dates from bill
      const dates = await processBillImage(file);

      // Upload bill to IPFS
      const uploadResponse = await uploadFile(file);

      onProcessed({
        dates,
        cid: uploadResponse.cid
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload Subscription Bill
        </label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
          <div className="space-y-1 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="flex text-sm text-gray-600">
              <label className="relative cursor-pointer bg-white rounded-md px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                <span>Upload a file</span>
                <input
                  type="file"
                  className="sr-only"
                  accept="image/*,.pdf"
                  onChange={handleFileUpload}
                  disabled={loading}
                />
              </label>
              <p className="pl-1 text-sm text-gray-500">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500">PNG, JPG, or PDF up to 10MB</p>
          </div>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center">
          <LoadingSpinner />
          <span className="ml-2 text-sm text-gray-600">Processing bill...</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}
    </div>
  );
};

export default BillUploader;