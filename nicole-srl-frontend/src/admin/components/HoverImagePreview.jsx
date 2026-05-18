import React, { useState } from 'react';
import { ZoomIn } from 'lucide-react';

const HoverImagePreview = ({ src, alt, size = 'sm' }) => {
  const [showPreview, setShowPreview] = useState(false);

  if (!src) return null;

  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-12 h-12',
  };

  const previewSize = sizeClasses[size] || sizeClasses.sm;

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setShowPreview(true)}
      onMouseLeave={() => setShowPreview(false)}
    >
      <div className={`${previewSize} rounded-lg overflow-hidden bg-gray-100 cursor-pointer group`}>
        <img src={src} alt={alt} className="w-full h-full object-cover group-hover:opacity-80 transition-opacity" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="bg-black/40 rounded-full p-1">
            <ZoomIn className="w-3 h-3 text-white" />
          </div>
        </div>
      </div>

      {showPreview && (
        <div className="fixed z-50 pointer-events-none" style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}>
          <div className="relative">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-2xl" />
            <img
              src={src}
              alt={alt}
              className="relative max-w-[400px] max-h-[500px] object-contain rounded-2xl shadow-2xl"
              style={{
                animation: 'previewFadeIn 0.2s ease-out',
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default HoverImagePreview;
