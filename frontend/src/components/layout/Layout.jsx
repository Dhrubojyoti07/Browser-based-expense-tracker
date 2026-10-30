import Navbar from './Navbar';

/**
 * Main layout wrapper — navbar on top, content below with padding.
 */
export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 pt-20 pb-12 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
