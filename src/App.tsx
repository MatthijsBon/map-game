import { MapWrapper } from "./components";
import { Suspense, useCallback } from "react";
import { FeatureLike } from "ol/Feature";

function MapApp() {
  const handleProvinceClick = useCallback((feature: FeatureLike) => {
    console.log(feature); // show toast
  }, []);

  return (
    <div className="bg-grey-300 min-h-screen">
      <header className="bg-grey-100 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-blue-900">
              Nederlandse Provincies
            </h1>
          </div>
        </div>
      </header>

      <main className="mx-auto min-h-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-lg bg-white shadow-lg">
          <div className="h-[600px] lg:h-[1000px]">
            <Suspense fallback={<div>Loading...</div>}>
              <MapWrapper onProvinceClick={handleProvinceClick} />
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  );
}

export default MapApp;
