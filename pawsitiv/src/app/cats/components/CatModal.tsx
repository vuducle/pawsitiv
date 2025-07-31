"use client";

import { FiX, FiMapPin, FiTag, FiCalendar } from "react-icons/fi";

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

interface CatModalProps {
  cat: Cat;
  onClose: () => void;
}

export default function CatModal({ cat, onClose }: CatModalProps) {
  const getHairLengthText = (length: string) => {
    switch (length) {
      case "kurz":
        return "Short";
      case "mittel":
        return "Medium";
      case "lang":
        return "Long";
      default:
        return length;
    }
  };

  const getChonkinessText = (chonk: string) => {
    switch (chonk) {
      case "schlank":
        return "Slim";
      case "normal":
        return "Normal";
      case "mollig":
        return "Chubby";
      case "übergewichtig":
        return "Overweight";
      default:
        return chonk;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="glass-card p-8 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {cat.name}'s Profile
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="glass-card p-6 rounded-2xl">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Basic Information
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <FiMapPin className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium">{cat.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FiCalendar className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-500">Added</p>
                  <p className="font-medium">
                    {new Date(cat.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Appearance */}
          <div className="glass-card p-6 rounded-2xl">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Appearance
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Breed</p>
                <p className="font-medium">{cat.appearance.breed}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Fur Color</p>
                <p className="font-medium">{cat.appearance.furColor}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Fur Pattern</p>
                <p className="font-medium">{cat.appearance.furPattern}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Hair Length</p>
                <p className="font-medium">
                  {getHairLengthText(cat.appearance.hairLength)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Body Type</p>
                <p className="font-medium">
                  {getChonkinessText(cat.appearance.chonkiness)}
                </p>
              </div>
            </div>
          </div>

          {/* Personality Tags */}
          {cat.personalityTags.length > 0 && (
            <div className="glass-card p-6 rounded-2xl">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FiTag className="w-5 h-5" />
                Personality
              </h3>
              <div className="flex flex-wrap gap-2">
                {cat.personalityTags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Images */}
          <div className="glass-card p-6 rounded-2xl">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Images</h3>
            {cat.images.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {cat.images.map((image, index) => (
                  <div
                    key={index}
                    className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center"
                  >
                    <img
                      src={image}
                      alt={`${cat.name} image ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                      onError={(e) => {
                        (
                          e.target as HTMLImageElement
                        ).src = `https://placekitten.com/200/200?image=${
                          index + 1
                        }`;
                      }}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No images available</p>
              </div>
            )}
          </div>

          {/* Close Button */}
          <div className="flex justify-end pt-4">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
