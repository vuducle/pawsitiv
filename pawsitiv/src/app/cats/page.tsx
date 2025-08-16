"use client";

import { useState, useEffect } from "react";
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiEye,
  FiSearch,
  FiFilter,
} from "react-icons/fi";
import { config } from "@/config/environment";
import CatForm from "./components/CatForm";
import CatModal from "./components/CatModal";

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

export default function CatsPage() {
  const [cats, setCats] = useState<Cat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingCat, setEditingCat] = useState<Cat | null>(null);
  const [selectedCat, setSelectedCat] = useState<Cat | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBreed, setFilterBreed] = useState("");

  // Add development login state
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const devLogin = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/api/cats/dev-login`, {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        setIsLoggedIn(true);
      }
    } catch (err) {
      setError("Failed to login");
    }
  };

  useEffect(() => {
    if (config.isDevelopment && !isLoggedIn) {
      devLogin();
    }
    fetchCats();
  }, []);

  const fetchCats = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${config.apiBaseUrl}/api/cats`);
      if (!response.ok) throw new Error("Failed to fetch cats");
      const data = await response.json();
      setCats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch cats");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this cat?")) return;

    try {
      const response = await fetch(`${config.apiBaseUrl}/api/cats/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to delete cat");

      setCats(cats.filter((cat) => cat.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete cat");
    }
  };

  const handleFormSubmit = async (catData: Partial<Cat>) => {
    try {
      const url = editingCat
        ? `${config.apiBaseUrl}/api/cats/${editingCat.id}`
        : `${config.apiBaseUrl}/api/cats`;
      console.log(editingCat);
      const response = await fetch(url, {
        method: editingCat ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(catData),
      });

      if (!response.ok) throw new Error("Failed to save cat");

      const savedCat = await response.json();

      if (editingCat) {
        setCats(cats.map((cat) => (cat.id === editingCat.id ? savedCat : cat)));
      } else {
        setCats([...cats, savedCat]);
      }

      setShowForm(false);
      setEditingCat(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save cat");
    }
  };

  const filteredCats = cats.filter((cat) => {
    const matchesSearch =
      cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBreed =
      !filterBreed ||
      cat.appearance.breed.toLowerCase().includes(filterBreed.toLowerCase());
    return matchesSearch && matchesBreed;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card p-8 rounded-3xl text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading cats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="glass-card p-8 rounded-3xl mb-8">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                Cat Management
              </h1>
              <p className="text-gray-600">
                Manage your feline friends collection
              </p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 lg:mt-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full font-semibold hover:scale-105 transition-transform duration-200 flex items-center gap-2"
            >
              <FiPlus className="w-5 h-5" />
              Add New Cat
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="glass-card p-6 rounded-2xl mb-8">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Filter by breed..."
                value={filterBreed}
                onChange={(e) => setFilterBreed(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="glass-card p-4 rounded-2xl mb-8 bg-red-50 border border-red-200">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Cats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCats.map((cat, index) => (
            <div
              key={index}
              className="glass-card p-6 rounded-2xl hover:scale-105 transition-transform duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800">{cat.name}</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedCat(cat)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <FiEye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setEditingCat(cat);
                      setShowForm(true);
                    }}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <FiEdit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <p>
                  <strong>Location:</strong> {cat.location}
                </p>
                <p>
                  <strong>Breed:</strong> {cat.appearance.breed}
                </p>
                <p>
                  <strong>Color:</strong> {cat.appearance.furColor}
                </p>
                <p>
                  <strong>Pattern:</strong> {cat.appearance.furPattern}
                </p>
                <p>
                  <strong>Hair Length:</strong> {cat.appearance.hairLength}
                </p>
                <p>
                  <strong>Body Type:</strong> {cat.appearance.chonkiness}
                </p>
              </div>

              {cat.personalityTags.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">
                    Personality:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {cat.personalityTags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {cat.images?.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">
                    Images: {cat.images.length}
                  </p>
                </div>
              )}

              <p className="text-xs text-gray-500 mt-4">
                Added: {new Date(cat.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>

        {filteredCats.length === 0 && !loading && (
          <div className="glass-card p-8 rounded-2xl text-center">
            <p className="text-gray-600 text-lg">
              No cats found matching your criteria.
            </p>
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <CatForm
          cat={editingCat}
          onSubmit={handleFormSubmit}
          onClose={() => {
            setShowForm(false);
            setEditingCat(null);
          }}
        />
      )}

      {/* View Modal */}
      {selectedCat && (
        <CatModal cat={selectedCat} onClose={() => setSelectedCat(null)} />
      )}
    </div>
  );
}
