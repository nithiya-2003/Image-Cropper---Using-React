import React from 'react';
import ImageCropper from './components/ImageCropper';
import { Crop } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Crop className="w-8 h-8 text-indigo-600" />
            <h1 className="text-4xl font-bold text-gray-800">
              Professional Image Cropper
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload, crop, and download your images with our easy-to-use professional image cropping tool
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <ImageCropper />
        </div>
      </div>
    </div>
  );
}

export default App;