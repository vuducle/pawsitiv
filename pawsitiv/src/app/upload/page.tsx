"use client";
import React, { useRef, useState } from "react";
import { IoMdClose } from "react-icons/io";

export default function UploadPage() {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadState, setUploadState] = useState<"success" | "failed" | null>(
    null
  );
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setPreview(URL.createObjectURL(file));
      setUploadedFile(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setPreview(URL.createObjectURL(file));
      setUploadedFile(file);
    }
  };

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("picture", file);
    formData.append("catId", "3"); // cat selection should be shown first so the catId can be taken from the selection
    const backendUrl =
      process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:3669";
    console.log(backendUrl);
    const res = await fetch(`${backendUrl}/api/cats/upload`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      setUploadState("failed");
      return;
    }

    removeAttachment();
  };

  const removeAttachment = () => {
    setUploadState("success");
    setPreview(null);
    setUploadedFile(null);
  };

  return (
    <>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setDragActive(false);
        }}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 ease-out ${
          dragActive
            ? "border-blue-500 bg-blue-50 scale-110 border-dotted shadow-[0_0_20px_4px_rgba(59,130,246,0.3)]"
            : "border-gray-300"
        }`}
        onClick={() => inputRef.current?.click()}
        style={{ maxWidth: 400, margin: "2rem auto" }}
      >
        <input
          type="file"
          accept="image/*"
          ref={inputRef}
          style={{ display: "none" }}
          onChange={handleChange}
        />
        {preview ? (
          <>
            <IoMdClose
              className="text-4xl transition-all duration-300 hover:scale-125 hover:rotate-360 hover:text-red-500"
              onClick={(e) => {
                e.stopPropagation();
                removeAttachment();
              }}
            />
            {/* eslint-disable-next-line @next/next/no-img-element*/}
            <img
              src={preview}
              alt="Preview"
              className="mx-auto mb-4 max-h-48"
            />
          </>
        ) : (
          <p>Drag & drop an image here, or click to select</p>
        )}
      </div>

      <div className="text-center">
        <button
          className="glass-button px-8 py-4 rounded-full text-lg font-semibold shadow-glass hover:scale-105 transition-transform duration-200"
          onClick={() => (uploadedFile ? uploadFile(uploadedFile) : null)}
        >
          Submit
        </button>
        {uploadState !== null && (
          <p
            className={`${
              uploadState === "success" ? "text-green-400" : "text-red-500"
            }
          font-semibold mt-5 text-2xl  
          `}
          >
            {uploadState === "success"
              ? "File uploaded successfully"
              : "File Upload failed. Please try again now or later"}
          </p>
        )}
      </div>
    </>
  );
}
