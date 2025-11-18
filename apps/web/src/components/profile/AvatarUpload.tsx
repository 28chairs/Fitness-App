'use client';

import { useState, useRef } from 'react';
import { useAuthStore } from '@/lib/store/auth-store';
import { usersApi } from '@/lib/api/users';

interface AvatarUploadProps {
  currentAvatarUrl?: string;
}

export function AvatarUpload({ currentAvatarUrl }: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentAvatarUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, setUser } = useAuthStore();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    setUploading(true);
    try {
      // TODO: Implement actual file upload to S3
      // For now, we'll just update the user with a placeholder
      const formData = new FormData();
      formData.append('avatar', file);

      // This would typically upload to S3 and return a URL
      // For MVP, we'll simulate this
      const avatarUrl = URL.createObjectURL(file);
      const updatedUser = await usersApi.updateMe({ avatarUrl });
      setUser(updatedUser);
    } catch (error) {
      console.error('Failed to upload avatar:', error);
      alert('Failed to upload avatar. Please try again.');
      setPreview(currentAvatarUrl || null);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <div className="relative">
        <div className="h-20 w-20 rounded-full overflow-hidden bg-gray-200">
          {preview ? (
            <img src={preview} alt="Avatar" className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-gray-400">
              <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          )}
        </div>
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        )}
      </div>
      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
        >
          {uploading ? 'Uploading...' : 'Change Avatar'}
        </button>
        <p className="mt-1 text-xs text-gray-500">JPG, PNG or GIF. Max 5MB.</p>
      </div>
    </div>
  );
}

