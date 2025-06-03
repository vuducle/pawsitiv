// catCollection/page.tsx
"use client"
import { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';

interface Cat {
    id: number;
    name: string;
    age: number;
    gender: string;
    mood: string;
    color: string;
    breed: string;
    hungry: boolean;
    description: string;
    favoriteFood?: string;
    imageUrl: string;
    personality?: string;
}

const moodEmoji = (mood: string) => {
    switch(mood.toLowerCase()) {
        case 'happy': return '😊';
        case 'sad': return '😢';
        case 'magical': return '✨';
        default: return '😼';
    }
};

const CatCollectionPage: NextPage = () => {
    const [cats, setCats] = useState<Cat[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCats = async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:3669'}/api/cats/catCollection`
                );

                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }

                const data = await res.json();
                setCats(data.cats);
            } catch (error) {
                console.error("Failed to fetch cats:", error);
                setError(error instanceof Error ? error.message : 'Failed to fetch cats');
            } finally {
                setLoading(false);
            }
        };
        fetchCats();
    }, []);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-pulse text-2xl">Loading cat teasers...</div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-red-500 text-xl">Error: {error}</div>
        </div>
    );

    return (
        <>
            <Head>
                <title>Cat Teaser Collection | iykyk</title>
            </Head>

            <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl font-bold text-center mb-2 text-purple-900">Cat Teaser Collection</h1>
                    <p className="text-center text-purple-700 mb-12">Swipe right on your next feline friend 😻</p>

                    <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                        {cats.map((cat) => (
                            <div key={cat.id} className="group relative">
                                <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-200"></div>
                                <div className="relative h-full bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:-translate-y-2">
                                    <div className="h-48 overflow-hidden">
                                        <img
                                            src={cat.imageUrl}
                                            alt={cat.name}
                                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = `https://placekitten.com/300/200?image=${cat.id}`;
                                            }}
                                        />
                                    </div>

                                    <div className="p-6">
                                        <div className="flex justify-between items-start">
                                            <h2 className="text-xl font-bold text-gray-900">{cat.name}</h2>
                                            <span className="text-2xl">{moodEmoji(cat.mood)}</span>
                                        </div>

                                        <p className="mt-1 text-sm text-purple-600">{cat.breed}</p>
                                        <p className="mt-2 text-gray-600 line-clamp-2">{cat.description}</p>
                                        <p className="mt-2 text-gray-600 text-sm italic line-clamp-2">{cat.personality}</p>
                                        <div className="mt-4 flex items-center space-x-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${cat.hungry ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                        {cat.hungry ? 'Hungry 😾' : 'Not hungry 😽'}
                      </span>
                                            <span className="text-xs text-gray-500">{cat.age}yrs • {cat.gender}</span>
                                        </div>

                                        {cat.favoriteFood && (
                                            <div className="mt-3 flex items-center">
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                          🍗 {cat.favoriteFood}
                        </span>
                                            </div>
                                        )}

                                        {cat.color && (
                                            <div className="mt-3 flex items-center">
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                          🎨 {cat.color}
                        </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default CatCollectionPage;