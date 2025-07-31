import Image from "next/image";
import Link from "next/link";
import {
  FiMapPin,
  FiCamera,
  FiHeart,
  FiUsers,
  FiMessageCircle,
  FiStar,
} from "react-icons/fi";

// User personas data
const personas = [
  {
    name: "Mike Ehrmanntraut",
    role: "Cat Whisperer",
    description:
      "Security consultant by day, street cat guardian by night. Knows every alley cat in Kreuzberg. Loves chicken wings and is a big fan of the big bang theory",
    avatar: "/img/mike.jpg",
    location: "Kreuzberg",
  },
  {
    name: "Niklas Regen",
    role: "Cat Photographer",
    description:
      "Professional photographer who captures the soul of Berlin's feline residents. Loves australia espically the kangaroos",
    avatar: "/img/niklas_regen.jpg",
    location: "Mitte",
  },
  {
    name: "Wendy Ameilya",
    role: "Cat Community Leader",
    description:
      "Organizes neighborhood cat feeding schedules and coordinates rescue efforts. Loves Kpop and is a big fan of Red Velvet.",
    avatar: "/img/wendy_from_redvelvet.jpg",
    location: "Lichtenberg",
  },
  {
    name: "Marc Szemlics",
    role: "Cat Enthusiast",
    description:
      "Software developer who built this app to connect Berlin's cat lovers. Has a twin brother named Malte.",
    avatar: "/img/marc.png",
    location: "Friedrichshain",
  },
];

// Features data
const features = [
  {
    icon: <FiCamera className="w-8 h-8" />,
    title: "Share Cat Sightings",
    description:
      "Upload photos and locations of street cats you encounter in Berlin",
  },
  {
    icon: <FiMapPin className="w-8 h-8" />,
    title: "Create Cat Profiles",
    description:
      "Build detailed profiles with names, hangout spots, and personality traits",
  },
  {
    icon: <FiHeart className="w-8 h-8" />,
    title: "Virtual Cat Companion",
    description:
      "Interact with a virtual cat that sends daily positive affirmations",
  },
  {
    icon: <FiUsers className="w-8 h-8" />,
    title: "Community Building",
    description:
      "Connect with fellow cat lovers and build a light-hearted community",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div className="text-center lg:text-left">
              <h1 className="text-5xl lg:text-6xl font-extrabold mb-6">
                <span className="kpop-gradient-text">Pawsitive</span>
                <br />
                <span className="text-gray-800">Berlin's Cat Community</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Share photos and locations of street cats in Berlin, create
                detailed profiles, and connect with a community of cat lovers.
                Plus, get daily positive affirmations from your virtual cat
                companion!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href="/register"
                  className="glass-button px-8 py-4 rounded-full text-lg font-semibold shadow-glass hover:scale-105 transition-transform duration-200"
                >
                  Join the Community
                </Link>
                <Link
                  href="/catCollection"
                  className="glass-card px-8 py-4 rounded-full text-lg font-semibold text-gray-700 hover:scale-105 transition-transform duration-200"
                >
                  Explore Cats
                </Link>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div className="glass-card p-8 rounded-3xl shadow-glass">
                <Image
                  src="/img/lickingCat.webp"
                  width={400}
                  height={400}
                  alt="Virtual Cat Companion"
                  className="rounded-2xl w-full"
                />
                <div className="mt-4 text-center">
                  <p className="text-lg font-semibold text-gray-700">
                    Your Virtual Cat Companion
                  </p>
                  <p className="text-sm text-gray-500">
                    Sends daily positive affirmations
                  </p>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 glass-card p-4 rounded-full">
                <FiHeart className="w-6 h-6 text-pink-500" />
              </div>
              <div className="absolute -bottom-4 -left-4 glass-card p-4 rounded-full">
                <FiStar className="w-6 h-6 text-yellow-500" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-br from-pink-50 to-blue-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              What Makes Pawsitive Special
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Instagram meets Tamagotchi - a unique blend of social sharing and
              virtual companionship
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="glass-card p-6 text-center hover:scale-105 transition-transform duration-200"
              >
                <div className="glass-card p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center text-purple-600">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Meet Our Community
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real people making a difference in Berlin's cat community
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {personas.map((persona, index) => (
              <div
                key={index}
                className="glass-card p-6 text-center hover:scale-105 flex flex-col items-center transition-transform duration-200"
              >
                <Image
                  src={persona.avatar}
                  alt={persona.name}
                  width={100}
                  height={100}
                  className="rounded-full mb-4 object-contain"
                />
                <h3 className="text-xl font-semibold text-gray-800 mb-1">
                  {persona.name}
                </h3>
                <p className="text-purple-600 font-medium mb-2">
                  {persona.role}
                </p>
                <p className="text-sm text-gray-500 mb-3">{persona.location}</p>
                <p className="text-gray-600 text-sm">{persona.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-500 to-pink-500">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Join the Pawsitive Community?
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Start sharing your cat encounters, create profiles for your favorite
            street cats, and receive daily positivity from your virtual
            companion.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="bg-white text-purple-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
            >
              Get Started Today
            </Link>
            <Link
              href="/catProfile"
              className="glass-card px-8 py-4 rounded-full text-lg font-semibold text-white border-2 border-white hover:bg-white hover:text-purple-600 transition-all duration-200"
            >
              Meet Dave the Cheese Wizard
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="glass-card p-8">
              <div className="text-4xl font-bold text-purple-600 mb-2">
                500+
              </div>
              <div className="text-gray-600">Cat Sightings Shared</div>
            </div>
            <div className="glass-card p-8">
              <div className="text-4xl font-bold text-pink-600 mb-2">200+</div>
              <div className="text-gray-600">Active Community Members</div>
            </div>
            <div className="glass-card p-8">
              <div className="text-4xl font-bold text-blue-600 mb-2">50+</div>
              <div className="text-gray-600">Cat Profiles Created</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
