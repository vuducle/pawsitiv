import Image from "next/image";

// Define the type for cat data
export interface CatData {
  name: string;
  age: number;
  mood: string;
  hungry: string;
  description: string;
  imageUrl: string;
}

export function CatProfile({ catData }: { catData: CatData }) {
  if (!catData) {
    return (
      <div className="text-center py-16 bg-white rounded-xl shadow-lg mt-8">
        <h1 className="text-4xl font-bold text-red-700 mb-4">
          Cat Profile Not Found
        </h1>
        <p className="text-lg text-gray-700">
          Could not load the cat&apos;s profile. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 mt-8 max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold text-purple-700 mb-6 text-center">
        {catData.name}&rsquo;s Profile
      </h1>

      <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
        <div className="flex-shrink-0">
          <Image
            src={catData.imageUrl}
            alt={`Picture of ${catData.name}`}
            width={400}
            height={300}
            className="rounded-lg shadow-md border-4 border-purple-200"
          />
        </div>
        <div className="flex-grow text-lg">
          <p className="mb-2">
            <strong>Name:</strong> {catData.name}
          </p>
          <p className="mb-2">
            <strong>Age:</strong> {catData.age} years old
          </p>
          <p className="mb-2">
            <strong>Mood:</strong> {catData.mood}
          </p>
          <p className="mb-2">
            <strong>Hungry:</strong> {catData.hungry}
          </p>
          <p className="mt-4 p-4 bg-purple-50 text-purple-800 rounded-md border border-purple-200">
            <strong>Description:</strong> {catData.description}
          </p>
        </div>
      </div>
    </div>
  );
}
