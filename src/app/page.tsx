import Layout from '@/components/Layout';
import Link from 'next/link';

export default function Home() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight">
              Upptäck Exklusiva Produkter
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-6 md:mb-8 leading-relaxed">
              Handla från vårt noggrant utvalda sortiment av premiumvaror
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
              <Link
                href="/products"
                className="bg-gold-500 hover:bg-gold-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold text-base md:text-lg transition"
              >
                Utforska Produkter
              </Link>
              <Link
                href="/about"
                className="bg-transparent border-2 border-white hover:bg-white hover:text-gray-900 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold text-base md:text-lg transition"
              >
                Läs Mer
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">Varför Välja Oss?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm text-center hover:shadow-md transition">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                <svg
                  className="w-7 h-7 md:w-8 md:h-8 text-gold-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2">Högsta Kvalitet</h3>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                Alla produkter är noggrant utvalda för att garantera bästa kvalitet
              </p>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm text-center hover:shadow-md transition">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                <svg
                  className="w-7 h-7 md:w-8 md:h-8 text-gold-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2">Säkra Betalningar</h3>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                Dina betalningar är skyddade med branschledande säkerhet
              </p>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm text-center hover:shadow-md transition sm:col-span-2 lg:col-span-1">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                <svg
                  className="w-7 h-7 md:w-8 md:h-8 text-gold-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2">Snabb Leverans</h3>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                Vi levererar dina produkter snabbt och säkert till din dörr
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-gold-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">Redo att Börja Handla?</h2>
          <p className="text-base md:text-xl text-gray-600 mb-6 md:mb-8 leading-relaxed max-w-2xl mx-auto">
            Skapa ett konto idag och få tillgång till exklusiva erbjudanden
          </p>
          <Link
            href="/register"
            className="inline-block bg-gold-600 hover:bg-gold-700 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold text-base md:text-lg transition"
          >
            Registrera Dig Nu
          </Link>
        </div>
      </section>
    </Layout>
  );
}
