import { MapContainer } from "./components";
import toast, { Toaster } from "react-hot-toast";
import { Suspense, useCallback } from "react";
import { ToastMessage } from "./components/ToastMessage.tsx";
import { Station } from "./lib/api/stations";

function MapApp() {
  const handleProvinceClick = useCallback(
    (name: string, stationsWithin: Pick<Station, "id" | "name">[]) => {
      toast.custom(<ToastMessage name={name} stations={stationsWithin} />, {
        duration: 4000,
        position: "bottom-left",
      });
    },
    [],
  );
  const onWinCondition = useCallback(() => {
    toast.success("All stations are the same color! 🎉", {
      icon: "🎉",
      duration: 0,
      position: "top-center",
    });
  }, []);

  return (
    <div className="bg-grey-300 min-h-screen">
      <header className="bg-grey-100 shadow-sm">
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
            <Suspense fallback={<div>Loading...</div>}>
              <MapContainer
                onProvinceClick={handleProvinceClick}
                onWinCondition={onWinCondition}
              />
            </Suspense>
          </div>
        </div>
      </main>

      <Toaster position="bottom-right" />
    </div>
  );
}

export default MapApp;
