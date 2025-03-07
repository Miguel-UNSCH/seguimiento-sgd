"use client";

import { Button } from "@/components/ui/button";
import { TrackingData, TrackingStep } from "@/types/tracking";

interface TrackingResultProps {
  trackingData: TrackingData;
  onStepSelect: (step: TrackingStep) => void;
}

export const statusClassNames: Record<string, string> = {
  "0": "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800",
  "1": "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400",
  "2": "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
  "3": "bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400",
  "4": "bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400",
  "5": "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
  "6": "bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400",
  "7": "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400",
  "9": "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
};

export default function TrackingResult({
  trackingData,
  onStepSelect,
}: TrackingResultProps) {
  return (
    <div className="max-w-3xl mx-auto bg-card p-4 rounded-xl">
      <div
        className={`border rounded-lg p-4 mb-6 flex items-start gap-4 
          ${statusClassNames[trackingData.pasos[0].estado] || "bg-gray-50 border-gray-200 dark:bg-gray-900/20 dark:border-gray-800"}`}
      >
        <div
          className={`${statusClassNames[trackingData.pasos[0].estado] || "bg-gray-100 dark:bg-gray-900/30"} p-2 rounded-md`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`${statusClassNames[trackingData.pasos[0].estado] || "text-gray-600 dark:text-gray-400"}`}
          >
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
        </div>
        <div className="flex-1">
          <h2
            className={`text-lg font-semibold ${statusClassNames[trackingData.pasos[0].estado] || "text-gray-600 dark:text-gray-400"}`}
          >
            Expediente: {trackingData.id}
          </h2>
          <p className="text-muted-foreground">
            Último estado: {trackingData.estado}
          </p>
        </div>
      </div>

      <div className="relative">
        {trackingData.pasos.map((paso, index) => (
          <div key={index} className="flex mb-6 relative">
            {index < trackingData.pasos.length - 1 && (
              <div className="absolute left-[18px] top-[36px] w-[2px] h-[calc(100%-16px)] bg-gray-200 dark:bg-gray-700"></div>
            )}
            <div
              className={`w-[36px] h-[36px] rounded-full flex items-center justify-center shrink-0 z-10 
                ${statusClassNames[paso.estado] || "bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400"}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {(() => {
                  switch (paso.estado) {
                    case "0":
                      return <circle cx="12" cy="12" r="10" />;
                    case "1":
                      return <circle cx="12" cy="12" r="5" />;
                    case "2":
                    case "3":
                    case "4":
                      return <path d="M20 6 9 17l-5-5" />;
                    case "5":
                      return <path d="M12 2v20" />;
                    case "6":
                      return <path d="M9 12h6" />;
                    case "7":
                      return <path d="M5 12h14" />;
                    case "9":
                      return <path d="M18 6L6 18" />;
                    default:
                      return <circle cx="12" cy="12" r="10" />;
                  }
                })()}
              </svg>
            </div>
            <div className="ml-4 flex-1">
              <div className="bg-card border rounded-lg p-4 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                  <h3 className="font-semibold text-foreground">
                    <div>
                      <p>Unidad emisora:</p>
                      {paso.area}
                    </div>
                    <br />
                    <div>
                      <p>Unidad receptora:</p>
                      {paso.details.unidad_destino}
                    </div>
                  </h3>
                  <p className="text-muted-foreground text-sm">{paso.fecha}</p>
                </div>
                <Button
                  variant="outline"
                  className="hover:cursor-pointer"
                  size="sm"
                  onClick={() => onStepSelect(paso)}
                >
                  Ver detalles
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}