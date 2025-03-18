import { MapContainer } from "./components";
import { Toaster } from "react-hot-toast";
import { Suspense } from "react";

function MapApp() {
  return (
    <div className="bg-grey-300 min-h-screen">
      <header className="bg-grey-100 shadow-xs">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-blue-900">
              Nederlandse Provincies en Treinstations
            </h1>
          </div>
        </div>
      </header>

      <main className="mx-auto min-h-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-lg bg-white shadow-lg">
          <div className="h-[600px] lg:h-[1000px]">
            <Suspense fallback={<div className="m-auto">Loading...</div>}>
              <MapContainer />
            </Suspense>
          </div>
        </div>
      </main>

      <Toaster position="bottom-right" />
    </div>
  );
}

export default MapApp;
