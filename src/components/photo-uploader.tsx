"use client";

import { useRef, useState, type DragEvent } from 'react';
import { UploadCloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PhotoUploaderProps {
  onPhotoUpload: (file: File) => void;
  disabled?: boolean;
}

export function PhotoUploader({ onPhotoUpload, disabled }: PhotoUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onPhotoUpload(file);
    }
  };

  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if(!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if(disabled) return;
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      onPhotoUpload(file);
    }
  };

  return (
    <div
      className={cn(
        "border-2 border-dashed border-muted-foreground/30 rounded-lg p-12 text-center transition-all duration-300 bg-card/30",
        isDragging ? "border-primary bg-primary/10" : "hover:border-muted-foreground/50 hover:bg-card/50"
      )}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
      <p className="mb-4 text-muted-foreground">Drag & drop your photo here or</p>
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        disabled={disabled}
      />
      <Button onClick={handleButtonClick} disabled={disabled} size="lg">
        Select Photo
      </Button>
    </div>
  );
}
