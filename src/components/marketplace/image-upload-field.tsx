"use client";

import { useRef, useState } from "react";
import { Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ImageUploadFieldProps {
  value: string;
  onChange: (url: string) => void;
}

export default function ImageUploadField({ value, onChange }: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json().catch(() => ({}));
    setUploading(false);

    if (!res.ok) {
      setError(data.error || "Upload failed.");
      return;
    }

    onChange(data.url);
  }

  return (
    <div className="space-y-3">
      <Label>Product image</Label>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          capture="environment"
          className="hidden"
          onChange={handleFileChange}
        />
        <Button
          type="button"
          variant="outline"
          className="h-11 w-full gap-2 sm:w-auto"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          <Upload className="h-4 w-4 shrink-0" />
          {uploading ? "Uploading..." : "Upload image"}
        </Button>
        {value && (
          <img
            src={value}
            alt="Product preview"
            className="h-24 w-full max-w-[120px] rounded-md border object-cover sm:h-20 sm:w-20"
          />
        )}
      </div>

      <Input
        placeholder="Or paste an image URL"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full"
      />

      <p className="text-xs text-muted-foreground">
        JPG, PNG, WEBP, or GIF up to 5MB. Production uploads require Supabase Storage.
      </p>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
