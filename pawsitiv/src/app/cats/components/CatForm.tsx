"use client";

import { useState, useEffect } from "react";
import { FiX, FiUpload, FiTag } from "react-icons/fi";

interface Cat {
  id: string;
  name: string;
  location: string;
  images: string[];
  personalityTags: string[];
  appearance: {
    furColor: string;
    furPattern: string;
    breed: string;
    hairLength: "kurz" | "mittel" | "lang";
    chonkiness: "schlank" | "normal" | "mollig" | "übergewichtig";
  };
  createdAt: string;
}

interface CatFormProps {
  cat?: Cat | null;
  onSubmit: (catData: Partial<Cat>) => void;
  onClose: () => void;
}

export default function CatForm({ cat, onSubmit, onClose }: CatFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    images: [] as string[],
    personalityTags: [] as string[],
    appearance: {
      furColor: "",
      furPattern: "",
      breed: "",
      hairLength: "mittel" as "kurz" | "mittel" | "lang",
      chonkiness: "normal" as "schlank" | "normal" | "mollig" | "übergewichtig",
    },
  });
  const [newTag, setNewTag] = useState("");
  const [loading, setLoading] = useState(false);

  // Reusable input styles for readable K-pop pastel theme
  const inputClass =
    "w-full px-4 py-3 border rounded-lg bg-white text-gray-900 border-pink-200 shadow-sm focus:outline-none focus:ring-3 focus:ring-pink-300 focus:border-transparent placeholder:text-pink-300";

  useEffect(() => {
    if (cat) {
      setFormData({
        name: cat.name,
        location: cat.location,
        images: cat.images,
        personalityTags: cat.personalityTags,
        appearance: cat.appearance,
      });
    }
  }, [cat]);

  const handleInputChange = (field: string, value: any) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev as any)[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.personalityTags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        personalityTags: [...prev.personalityTags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      personalityTags: prev.personalityTags.filter(
        (tag) => tag !== tagToRemove
      ),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSubmit(formData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50 bg-[radial-gradient(circle_at_top_left,_#ffe7f0,_#fff5ff_30%)]">
      <div className="relative p-8 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl bg-gradient-to-br from-white via-pink-50 to-purple-50 border border-pink-200">
        {/* Decorative cat ears / badge */}
        <svg
          aria-hidden
          className="absolute -top-7 left-6 w-16 h-10"
          viewBox="0 0 64 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M10 26 L22 6 L34 26 Z" fill="#FFD1E8" />
          <path d="M36 26 L48 6 L60 26 Z" fill="#E7C5FF" />
          <circle cx="52" cy="6" r="3" fill="#FFC1E6" />
        </svg>
        {/* Subtle paw watermark behind content */}
        <svg
          aria-hidden
          className="absolute inset-0 m-auto opacity-5 w-72 h-72 pointer-events-none"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g fill="#f9cde6">
            <ellipse cx="50" cy="60" rx="14" ry="10" />
            <ellipse cx="36" cy="46" rx="5" ry="7" />
            <ellipse cx="64" cy="46" rx="5" ry="7" />
            <ellipse cx="44" cy="36" rx="4" ry="6" />
            <ellipse cx="56" cy="36" rx="4" ry="6" />
          </g>
        </svg>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-extrabold leading-tight text-gray-900">
              {cat ? "Edit Cat" : "Add New Cat"}{" "}
              <span className="ml-1">🐱</span>
            </h2>
            <p className="text-sm text-pink-600/90 mt-1">
              K‑Pop Cat Vibes — bright, cute and readable
            </p>
          </div>

          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="p-2 hover:bg-pink-50 rounded-lg transition-colors text-pink-600"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Cat Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={inputClass}
                placeholder="Enter cat's name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Location *
              </label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                className={inputClass}
                placeholder="e.g., Kreuzberg, Berlin"
              />
            </div>
          </div>

          {/* Appearance */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Appearance</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Breed *
                </label>
                <input
                  type="text"
                  required
                  value={formData.appearance.breed}
                  onChange={(e) =>
                    handleInputChange("appearance.breed", e.target.value)
                  }
                  className={inputClass}
                  placeholder="e.g., Domestic Shorthair"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Fur Color *
                </label>
                <input
                  type="text"
                  required
                  value={formData.appearance.furColor}
                  onChange={(e) =>
                    handleInputChange("appearance.furColor", e.target.value)
                  }
                  className={inputClass}
                  placeholder="e.g., Orange, Black, White"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Fur Pattern *
                </label>
                <input
                  type="text"
                  required
                  value={formData.appearance.furPattern}
                  onChange={(e) =>
                    handleInputChange("appearance.furPattern", e.target.value)
                  }
                  className={inputClass}
                  placeholder="e.g., Tabby, Solid, Calico"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Hair Length *
                </label>
                <select
                  required
                  value={formData.appearance.hairLength}
                  onChange={(e) =>
                    handleInputChange("appearance.hairLength", e.target.value)
                  }
                  className={inputClass}
                >
                  <option value="kurz">Short</option>
                  <option value="mittel">Medium</option>
                  <option value="lang">Long</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Body Type *
                </label>
                <select
                  required
                  value={formData.appearance.chonkiness}
                  onChange={(e) =>
                    handleInputChange("appearance.chonkiness", e.target.value)
                  }
                  className={inputClass}
                >
                  <option value="schlank">Slim</option>
                  <option value="normal">Normal</option>
                  <option value="mollig">Chubby</option>
                  <option value="übergewichtig">Overweight</option>
                </select>
              </div>
            </div>
          </div>

          {/* Personality Tags */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Personality Tags
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), handleAddTag())
                }
                className={"flex-1 " + inputClass}
                placeholder="Add personality tag..."
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full hover:scale-105 transition-transform flex items-center gap-2 shadow-md"
              >
                <FiTag className="w-4 h-4" />
                Add
              </button>
            </div>
            {formData.personalityTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.personalityTags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gradient-to-r from-white to-pink-50 text-pink-800 rounded-full text-sm flex items-center gap-2 border border-pink-100 shadow-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-pink-900"
                    >
                      <FiX className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Images */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Images</h3>
            <div className="border-2 border-dashed border-pink-200 rounded-lg p-4 bg-white/70">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FiUpload className="w-6 h-6 text-pink-500" />
                  <p className="text-sm text-gray-700">
                    Image upload coming soon
                  </p>
                </div>
                <p className="text-sm text-pink-600">
                  Showing {formData.images?.length}
                </p>
              </div>
              <div className="flex gap-3 flex-wrap">
                {/* simple rounded placeholders to suggest images */}
                {Array.from({
                  length: Math.max(3, formData.images?.length),
                }).map((_, i) => (
                  <div
                    key={i}
                    className="w-20 h-20 bg-pink-50 rounded-xl border border-pink-100 flex items-center justify-center text-pink-300 text-xs shadow-sm"
                  >
                    {formData.images[i] ? "IMG" : "placeholder"}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-pink-200 bg-white text-pink-700 rounded-lg hover:bg-pink-50 transition-colors shadow-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:scale-105 transition-transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              {loading ? "Saving..." : cat ? "Update Cat" : "Create Cat"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
