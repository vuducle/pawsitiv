"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuthStore } from "../../stores/authStore";
import {
  FiCamera,
  FiMapPin,
  FiHeart,
  FiUsers,
  FiStar,
  FiPlus,
  FiBell,
  FiUser,
  FiLogOut,
} from "react-icons/fi";

// Quick actions for the dashboard
const quickActions = [
  {
    icon: <FiCamera className="w-6 h-6" />,
    title: "Share Cat Sighting",
    description: "Upload a new cat photo and location",
    href: "/catCollection",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    disabled: true,
  },
  {
    icon: <FiMapPin className="w-6 h-6" />,
    title: "Create Cat Profile",
    description: "Add a new cat to the community",
    href: "/catProfile",
    color: "text-pink-600",
    bgColor: "bg-pink-50",
    disabled: false,
  },
  {
    icon: <FiHeart className="w-6 h-6" />,
    title: "Virtual Companion",
    description: "Check your daily affirmation",
    href: "/catProfile",
    color: "text-red-600",
    bgColor: "bg-red-50",
    disabled: true,
  },
  {
    icon: <FiUsers className="w-6 h-6" />,
    title: "Community",
    description: "Connect with other cat lovers",
    href: "/catCollection",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    disabled: true,
  },
];

// Recent activity mock data
const recentActivity = [
  {
    type: "sighting",
    message: "You shared a photo of a tabby cat in Kreuzberg",
    time: "2 hours ago",
    icon: <FiCamera className="w-4 h-4" />,
  },
  {
    type: "profile",
    message: "You created a profile for 'Whiskers'",
    time: "1 day ago",
    icon: <FiPlus className="w-4 h-4" />,
  },
  {
    type: "affirmation",
    message: "Your virtual cat sent you a positive message",
    time: "2 days ago",
    icon: <FiHeart className="w-4 h-4" />,
  },
];

export default function Dashboard() {
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50">
      {/* Welcome Header */}
      <section className="pt-24 pb-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card p-8 rounded-3xl shadow-glass">
            <div className="flex flex-col lg:flex-row items-center justify-between">
              <div className="text-center lg:text-left mb-6 lg:mb-0">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">
                  Welcome back, {user?.name || "Cat Lover"}! 🐱
                </h1>
                <p className="text-xl text-gray-600">
                  Ready to discover more cats in Berlin today?
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-gray-500">Member since</p>
                  <p className="font-semibold text-gray-700">
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "Recently"}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="glass-card p-3 rounded-full hover:scale-105 transition-transform duration-200"
                  title="Logout"
                >
                  <FiLogOut className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Quick Actions
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) =>
              action.disabled ? (
                <div
                  key={index}
                  className="glass-card p-6 rounded-2xl opacity-50 cursor-not-allowed"
                >
                  <div
                    className={`p-3 rounded-full w-12 h-12 mb-4 flex items-center justify-center ${action.bgColor}`}
                  >
                    <div className={action.color}>{action.icon}</div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {action.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{action.description}</p>
                  <div className="mt-3">
                    <span className="inline-block bg-gray-200 text-gray-500 px-3 py-1 rounded-full text-xs font-medium">
                      Coming Soon
                    </span>
                  </div>
                </div>
              ) : (
                <Link
                  key={index}
                  href={action.href}
                  className="glass-card p-6 rounded-2xl hover:scale-105 transition-transform duration-200 group"
                >
                  <div
                    className={`p-3 rounded-full w-12 h-12 mb-4 flex items-center justify-center ${action.bgColor} group-hover:scale-110 transition-transform duration-200`}
                  >
                    <div className={action.color}>{action.icon}</div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {action.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{action.description}</p>
                </Link>
              )
            )}
          </div>
        </div>
      </section>

      {/* Stats Overview */}
      <section className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Your Activity
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="glass-card p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">12</div>
              <div className="text-gray-600">Cat Sightings Shared</div>
            </div>
            <div className="glass-card p-6 text-center">
              <div className="text-3xl font-bold text-pink-600 mb-2">8</div>
              <div className="text-gray-600">Cat Profiles Created</div>
            </div>
            <div className="glass-card p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">45</div>
              <div className="text-gray-600">Days of Positivity</div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Activity & Virtual Companion */}
      <section className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Recent Activity */}
            <div className="glass-card p-6 rounded-2xl">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FiBell className="w-5 h-5 text-purple-600" />
                Recent Activity
              </h3>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-lg bg-white/50"
                  >
                    <div className="p-2 rounded-full bg-purple-100 text-purple-600">
                      {activity.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-700 text-sm">
                        {activity.message}
                      </p>
                      <p className="text-gray-500 text-xs">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Virtual Companion */}
            <div className="glass-card p-6 rounded-2xl opacity-50">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FiHeart className="w-5 h-5 text-pink-600" />
                Your Virtual Cat
              </h3>
              <div className="text-center">
                <div className="relative mb-4">
                  <Image
                    src="/img/lickingCat.webp"
                    width={120}
                    height={120}
                    alt="Virtual Cat Companion"
                    className="rounded-full mx-auto"
                  />
                  <div className="absolute -top-2 -right-2 glass-card p-2 rounded-full">
                    <FiStar className="w-4 h-4 text-yellow-500" />
                  </div>
                </div>
                <h4 className="text-lg font-semibold text-gray-800 mb-2">
                  Dave the Cheese Wizard
                </h4>
                <p className="text-gray-600 text-sm mb-4">
                  "Today's affirmation: You're doing great! Remember, every cat
                  you help makes the world a better place. 🧀✨"
                </p>
                <div className="inline-block bg-gray-200 text-gray-500 px-6 py-2 rounded-full text-sm font-semibold cursor-not-allowed">
                  Coming Soon
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Highlights */}
      <section className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Community Highlights
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="glass-card p-6 text-center">
              <div className="text-2xl mb-2">🐱</div>
              <h3 className="font-semibold text-gray-800 mb-2">
                New Cats This Week
              </h3>
              <p className="text-3xl font-bold text-purple-600">15</p>
            </div>
            <div className="glass-card p-6 text-center">
              <div className="text-2xl mb-2">📸</div>
              <h3 className="font-semibold text-gray-800 mb-2">
                Photos Shared
              </h3>
              <p className="text-3xl font-bold text-pink-600">89</p>
            </div>
            <div className="glass-card p-6 text-center">
              <div className="text-2xl mb-2">👥</div>
              <h3 className="font-semibold text-gray-800 mb-2">
                Active Members
              </h3>
              <p className="text-3xl font-bold text-blue-600">234</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card p-8 rounded-3xl text-center bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <h2 className="text-3xl font-bold mb-4">
              Ready for Your Next Adventure?
            </h2>
            <p className="text-xl mb-6 opacity-90">
              Explore the cat collection or share your latest feline encounter!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="bg-gray-300 text-gray-500 px-6 py-3 rounded-full font-semibold cursor-not-allowed opacity-50">
                Explore Cats
              </div>
              <Link
                href="/catProfile"
                className="border-2 border-white text-white px-6 py-3 rounded-full font-semibold hover:bg-white hover:text-purple-600 transition-all duration-200"
              >
                Create Profile
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
