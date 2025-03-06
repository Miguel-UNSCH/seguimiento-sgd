"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "../theme/theme-toogle";
import AvatarUser from "../cards/avatar-user";
import { getTrackingDocument } from "@/actions/tracking-action";
import TrackingModal from "../modals/TrackingModal";

interface TrackingDocument {
  expidiente_rem: string;
  documento: string;
  asunto: string;
  cargo: string;
  anio: string;
  local: string;
  fecha: string;
  estado_doc: string;
  unidad_organica: string;
  usuario_firma: string;
  usuario_elabora: string;
  emision: string;
  tipo_emision: string;
  unidad_destino: string;
  empleado_destino: string;
  indicaciones: string;
  motivo_tramite: string;
  codigo_prioridad: string;
}

interface TrackingData {
  id: string;
  estado: string;
  pasos: TrackingStep[];
}

interface TrackingStep {
  area: string;
  descripcion: string;
  fecha: string;
  estado: string;
  details: TrackingDocument;
}

// const statusNames: Record<string, string> = {
//   "0": "Emitido",
//   "1": "Recibido Parcial",
//   "2": "Recibido",
//   "3": "Atendido",
//   "4": "Archivado",
//   "5": "En Proyecto",
//   "6": "Atendido Parcial",
//   "7": "Para Despacho",
//   "9": "Anulado"
// };

const statusColors: Record<
  string,
  {
    bgLight: string;
    bgDark: string;
    textLight: string;
    textDark: string;
    borderLight?: string;
    borderDark?: string;
  }
> = {
  "0": {
    bgLight: "bg-blue-100",
    bgDark: "bg-blue-900/30",
    textLight: "text-blue-600",
    textDark: "text-blue-400",
    borderLight: "border-blue-200",
    borderDark: "border-blue-800",
  }, // EMITIDO
  "1": {
    bgLight: "bg-yellow-100",
    bgDark: "bg-yellow-900/30",
    textLight: "text-yellow-600",
    textDark: "text-yellow-400",
  }, // RECIBIDO PARCIAL
  "2": {
    bgLight: "bg-green-100",
    bgDark: "bg-green-900/30",
    textLight: "text-green-600",
    textDark: "text-green-400",
  }, // RECIBIDO
  "3": {
    bgLight: "bg-teal-100",
    bgDark: "bg-teal-900/30",
    textLight: "text-teal-600",
    textDark: "text-teal-400",
  }, // ATENDIDO
  "4": {
    bgLight: "bg-gray-100",
    bgDark: "bg-gray-900/30",
    textLight: "text-gray-600",
    textDark: "text-gray-400",
  }, // ARCHIVADO
  "5": {
    bgLight: "bg-purple-100",
    bgDark: "bg-purple-900/30",
    textLight: "text-purple-600",
    textDark: "text-purple-400",
  }, // EN PROYECTO
  "6": {
    bgLight: "bg-cyan-100",
    bgDark: "bg-cyan-900/30",
    textLight: "text-cyan-600",
    textDark: "text-cyan-400",
  }, // ATENDIDO PARCIAL
  "7": {
    bgLight: "bg-orange-100",
    bgDark: "bg-orange-900/30",
    textLight: "text-orange-600",
    textDark: "text-orange-400",
  }, // PARA DESPACHO
  "9": {
    bgLight: "bg-red-100",
    bgDark: "bg-red-900/30",
    textLight: "text-red-600",
    textDark: "text-red-400",
  }, // ANULADO
};

export default function DocumentTrackingPage() {
  const [expedienteId, setExpedienteId] = useState("");
  const [resultadoBusqueda, setResultadoBusqueda] = useState<
    TrackingData | undefined
  >(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedStep, setSelectedStep] = useState<TrackingStep | null>(null); // Para el modal

  const buscarExpediente = async () => {
    if (!expedienteId.trim()) return;

    setLoading(true);
    setError(null);
    setResultadoBusqueda(undefined);

    try {
      const resultados = await getTrackingDocument({ record: expedienteId });

      if (!resultados || resultados.length === 0) {
        setError("No se encontraron resultados para este expediente");
        return;
      }

      const trackingData = {
        id: resultados[0].expidiente_rem,
        estado: resultados[0].estado_doc,
        pasos: resultados.map((doc: TrackingDocument) => ({
          area: doc.unidad_organica,
          descripcion: `${doc.indicaciones || "Sin indicaciones"} - ${
            doc.unidad_destino
          }`,
          fecha: new Date(doc.fecha).toLocaleString("es-PE", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
          estado: doc.estado_doc.split(" - ")[0],
          details: doc,
        })),
      };

      console.log({
        resultados,
        trackingData,
      });

      setResultadoBusqueda(trackingData);
    } catch (err) {
      setError("Error al buscar el expediente");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background relative">
      <header className="border-b border-border bg-card relative z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Image
                src="/images/logo.png"
                width={32}
                height={32}
                alt="Logo"
                className="mr-2"
              />
              <span className="font-bold text-xl text-foreground">
                GORE Ayacucho
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <AvatarUser />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full mx-auto px-4 py-8 relative z-10 overflow-y-auto">
        <div className="max-w-3xl mx-auto text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 text-foreground">
            Seguimiento de Trámite Documentario
          </h1>
          <p className="text-muted-foreground">
            Ingrese el número de expediente para ver el estado de su trámite
          </p>
        </div>

        <form
          className="max-w-3xl mx-auto flex items-center gap-2 mb-10 bg-card p-4 rounded-xl"
          onSubmit={(e) => {
            e.preventDefault();
            buscarExpediente();
          }}
        >
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-muted-foreground" />
            </div>
            <Input
              type="text"
              placeholder="N° expediente Ejm.( 000002, 2 )"
              className="pl-10 h-12 rounded-md border-input bg-input"
              value={expedienteId}
              onChange={(e) => setExpedienteId(e.target.value)}
            />
          </div>
          <Button
            type="submit"
            className="h-12 px-6 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md hover:cursor-pointer"
            disabled={loading}
          >
            {loading ? "Buscando..." : "Buscar"}
          </Button>
        </form>

        {error && (
          <div className="max-w-3xl mx-auto bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* <div className="max-w-3xl mx-auto mb-10">
          <h3 className="text-lg font-semibold text-foreground mb-2">Leyenda de Estados</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(statusColors).map(([code, colors]) => (
              <div key={code} className="flex items-center gap-2">
                <div
                  className={`w-4 h-4 rounded-full ${colors.bgLight} dark:${colors.bgDark} ${colors.textLight} dark:${colors.textDark}`}
                />
                <span className="text-sm text-foreground">{statusNames[code]}</span>
              </div>
            ))}
          </div>
        </div> */}

        {resultadoBusqueda && (
          <div className="max-w-3xl mx-auto bg-card p-4 rounded-xl">
            <div
              className={`border rounded-lg p-4 mb-6 flex items-start gap-4 
              ${
                statusColors[resultadoBusqueda.pasos[0].estado]?.bgLight ||
                "bg-gray-50"
              } 
              ${
                statusColors[resultadoBusqueda.pasos[0].estado]?.borderLight ||
                "border-gray-200"
              } 
              dark:${
                statusColors[resultadoBusqueda.pasos[0].estado]?.bgDark ||
                "bg-gray-900/20"
              } 
              dark:${
                statusColors[resultadoBusqueda.pasos[0].estado]?.borderDark ||
                "border-gray-800"
              }`}
            >
              <div
                className={`${
                  statusColors[resultadoBusqueda.pasos[0].estado]?.bgLight ||
                  "bg-gray-100"
                } 
                dark:${
                  statusColors[resultadoBusqueda.pasos[0].estado]?.bgDark ||
                  "bg-gray-900/30"
                } p-2 rounded-md`}
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
                  className={`${
                    statusColors[resultadoBusqueda.pasos[0].estado]
                      ?.textLight || "text-gray-600"
                  } 
                  dark:${
                    statusColors[resultadoBusqueda.pasos[0].estado]?.textDark ||
                    "text-gray-400"
                  }`}
                >
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </div>
              <div className="flex-1">
                <h2
                  className={`
                  text-lg font-semibold ${
                    statusColors[resultadoBusqueda.pasos[0].estado]
                      ?.textLight || "text-gray-600"
                  } 
                  dark:${
                    statusColors[resultadoBusqueda.pasos[0].estado]?.textDark ||
                    "text-gray-400"
                  }
                  `}
                >
                  Expediente: {resultadoBusqueda.id}
                </h2>
                <p className="text-muted-foreground">
                  Último estado: {resultadoBusqueda.estado}
                </p>
              </div>
            </div>

            <div className="relative">
              {resultadoBusqueda.pasos.map(
                (paso: TrackingStep, index: number) => (
                  <div key={index} className="flex mb-6 relative">
                    {index < resultadoBusqueda.pasos.length - 1 && (
                      <div className="absolute left-[18px] top-[36px] w-[2px] h-[calc(100%-16px)] bg-gray-200 dark:bg-gray-700"></div>
                    )}
                    <div
                      className={`w-[36px] h-[36px] rounded-full flex items-center justify-center shrink-0 z-10 
                      ${statusColors[paso.estado]?.bgLight || "bg-gray-100"} 
                      ${
                        statusColors[paso.estado]?.textLight || "text-gray-600"
                      } 
                      dark:${
                        statusColors[paso.estado]?.bgDark || "bg-gray-900/30"
                      } 
                      dark:${
                        statusColors[paso.estado]?.textDark || "text-gray-400"
                      }`}
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
                          <p className="text-muted-foreground text-sm">
                            {paso.fecha}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          className="hover:cursor-pointer"
                          size="sm"
                          onClick={() => setSelectedStep(paso)}
                        >
                          Ver detalles
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </main>

      {selectedStep && (
        <TrackingModal
          step={selectedStep}
          onClose={() => setSelectedStep(null)}
        />
      )}
    </div>
  );
}
