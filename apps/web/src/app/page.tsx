import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="bg-gradient-to-br from-primary-500 to-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">
              Build Your Fitness Community
            </h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Create, manage, and monetize your fitness community. From running clubs to yoga circles,
              empower your members and grow together.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/register"
                className="px-8 py-3 bg-white text-primary-600 rounded-md font-semibold hover:bg-gray-100"
              >
                Get Started
              </Link>
              <Link
                href="/communities"
                className="px-8 py-3 border-2 border-white text-white rounded-md font-semibold hover:bg-white hover:text-primary-600"
              >
                Explore Communities
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl mb-4">🏃</div>
            <h3 className="text-xl font-semibold mb-2">Find Communities</h3>
            <p className="text-gray-600">
              Discover fitness communities near you that match your interests and goals.
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">📅</div>
            <h3 className="text-xl font-semibold mb-2">Join Events</h3>
            <p className="text-gray-600">
              RSVP to events, track your attendance, and stay connected with your community.
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">🏆</div>
            <h3 className="text-xl font-semibold mb-2">Compete & Grow</h3>
            <p className="text-gray-600">
              Climb the leaderboards, earn badges, and celebrate your fitness journey.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
