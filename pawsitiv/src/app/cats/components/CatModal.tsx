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
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50 bg-[radial-gradient(circle_at_top_left,_#ffe7f0,_#fff5ff_30%)]">
      <div className="relative p-8 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl bg-gradient-to-br from-white via-pink-50 to-purple-50 border border-pink-200">
        {/* Decorative cat ears */}
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

        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-extrabold leading-tight text-gray-900">
              {cat.name}'s Profile <span className="ml-1">🐱</span>
            </h2>
            <p className="text-sm text-pink-600/90 mt-1">Sweet kitty details</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-pink-50 rounded-lg transition-colors text-pink-600"
            aria-label="Close dialog"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="p-6 rounded-2xl bg-white/70 border border-pink-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Basic Information
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <FiMapPin className="w-5 h-5 text-pink-500" />
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium text-gray-900">{cat.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FiCalendar className="w-5 h-5 text-pink-500" />
                <div>
                  <p className="text-sm text-gray-500">Added</p>
                  <p className="font-medium text-gray-900">
                    {new Date(cat.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Appearance */}
          <div className="p-6 rounded-2xl bg-white/70 border border-pink-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
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
            <div className="p-6 rounded-2xl bg-white/70 border border-pink-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FiTag className="w-5 h-5 text-pink-500" />
                Personality
              </h3>
              <div className="flex flex-wrap gap-2">
                {cat.personalityTags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gradient-to-r from-white to-pink-50 text-pink-800 rounded-full text-sm border border-pink-100 shadow-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Images */}
          <div className="p-6 rounded-2xl bg-white/70 border border-pink-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Images</h3>
            {cat.images?.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {cat.images?.map((image, index) => (
                  <div
                    key={index}
                    className="aspect-square bg-pink-50 rounded-xl border border-pink-100 shadow-sm overflow-hidden"
                  >
                    <img
                      src={image}
                      alt={`${cat.name} image ${index + 1}`}
                      className="w-full h-full object-cover"
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
              <div className="text-center py-8 text-pink-600/70">
                <p>No images available yet</p>
              </div>
            )}
          </div>

          {/* Close Button */}
          <div className="flex justify-end pt-4">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:scale-105 transition-transform shadow-md"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
