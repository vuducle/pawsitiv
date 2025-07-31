"use client";

import { useState, useEffect } from "react";
import { FiX, FiUpload, FiTag } from "react-icons/fi";

interface Cat {
  _id: string;
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="glass-card p-8 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {cat ? "Edit Cat" : "Add New Cat"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cat Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter cat's name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="e.g., Kreuzberg, Berlin"
              />
            </div>
          </div>

          {/* Appearance */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Appearance</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Breed *
                </label>
                <input
                  type="text"
                  required
                  value={formData.appearance.breed}
                  onChange={(e) =>
                    handleInputChange("appearance.breed", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., Domestic Shorthair"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fur Color *
                </label>
                <input
                  type="text"
                  required
                  value={formData.appearance.furColor}
                  onChange={(e) =>
                    handleInputChange("appearance.furColor", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., Orange, Black, White"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fur Pattern *
                </label>
                <input
                  type="text"
                  required
                  value={formData.appearance.furPattern}
                  onChange={(e) =>
                    handleInputChange("appearance.furPattern", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., Tabby, Solid, Calico"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hair Length *
                </label>
                <select
                  required
                  value={formData.appearance.hairLength}
                  onChange={(e) =>
                    handleInputChange("appearance.hairLength", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="kurz">Short</option>
                  <option value="mittel">Medium</option>
                  <option value="lang">Long</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Body Type *
                </label>
                <select
                  required
                  value={formData.appearance.chonkiness}
                  onChange={(e) =>
                    handleInputChange("appearance.chonkiness", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
            <h3 className="text-lg font-semibold text-gray-800">
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
                className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Add personality tag..."
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
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
                    className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm flex items-center gap-2"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-purple-900"
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
            <h3 className="text-lg font-semibold text-gray-800">Images</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <FiUpload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">
                Image upload functionality coming soon
              </p>
              <p className="text-sm text-gray-500">
                Currently showing {formData.images.length} images
              </p>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:scale-105 transition-transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : cat ? "Update Cat" : "Create Cat"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
