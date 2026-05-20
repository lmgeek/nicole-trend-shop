'use client';

import { useState, useRef } from 'react';
import { Image as ImageIcon, Upload, X, Plus } from 'lucide-react';

interface ImageUploaderProps {
  value: string;
  onChange: (base64: string) => void;
  aspectRatio?: string;
  label?: string;
}

export default function ImageUploader({ value, onChange, aspectRatio = 'aspect-[16/9]', label }: ImageUploaderProps) {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      onChange(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div>
      {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>}
      {value ? (
        <div className="relative group">
          <div className={`${aspectRatio} rounded-lg overflow-hidden bg-gray-100 border border-gray-200`}>
            <img src={value} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button type="button" onClick={() => inputRef.current?.click()} className="p-2 rounded-full bg-white/90 text-gray-700 hover:bg-white transition-colors">
              <Upload className="w-4 h-4" />
            </button>
            <button type="button" onClick={() => onChange('')} className="p-2 rounded-full bg-white/90 text-red-600 hover:bg-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`${aspectRatio} rounded-lg border-2 border-dashed cursor-pointer flex flex-col items-center justify-center transition-colors ${
            dragOver ? 'border-foreground bg-foreground/5' : 'border-gray-200 hover:border-gray-300 bg-gray-50'
          }`}
        >
          <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
          <span className="text-xs text-gray-500">Click o arrastra una imagen</span>
        </div>
      )}
      <input ref={inputRef} type="file" accept="image/*" onChange={handleInputChange} className="hidden" />
    </div>
  );
}

interface MultiImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  aspectRatio?: string;
  label?: string;
}

export function MultiImageUploader({ images, onChange, aspectRatio = 'aspect-[16/9]', label }: MultiImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      onChange([...images, e.target?.result as string]);
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div>
      {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>}
      <div className="grid grid-cols-4 gap-3">
        {images.map((img, i) => (
          <div key={i} className="relative group">
            <div className={`${aspectRatio} rounded-lg overflow-hidden bg-gray-100 border border-gray-200`}>
              <img src={img} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button type="button" onClick={() => removeImage(i)} className="p-1.5 rounded-full bg-white/90 text-red-600 hover:bg-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        <div
          onClick={() => inputRef.current?.click()}
          className={`${aspectRatio} rounded-lg border-2 border-dashed border-gray-200 hover:border-gray-300 bg-gray-50 cursor-pointer flex flex-col items-center justify-center transition-colors`}
        >
          <Plus className="w-6 h-6 text-gray-400" />
        </div>
      </div>
      <input ref={inputRef} type="file" accept="image/*" onChange={handleInputChange} className="hidden" />
    </div>
  );
}
