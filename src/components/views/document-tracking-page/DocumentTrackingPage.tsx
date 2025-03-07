"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { Session } from "next-auth";
import { getTrackingDocument } from "@/actions/tracking-action";
import SearchForm from "./SearchForm";
import TrackingResult from "./TrackingResult";
import TrackingModal from "@/components/modals/TrackingModal";
import { TrackingData, TrackingDocument, TrackingStep } from "@/types/tracking";

export default function DocumentTrackingPage({ session }: { session: Session }) {
  const [resultadoBusqueda, setResultadoBusqueda] = useState<
    TrackingData | undefined
  >(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedStep, setSelectedStep] = useState<TrackingStep | null>(null);
  const [isExpired, setIsExpired] = useState(false);
  const router = useRouter();

  // Validación de la sesión
  useEffect(() => {
    if (!session?.expires) return;

    const expiresDate = new Date(session.expires).getTime();
    const checkExpiration = () => {
      const now = Date.now();
      if (now >= expiresDate) {
        setIsExpired(true);
      }
    };

    checkExpiration();
    const interval = setInterval(checkExpiration, 1000);

    return () => clearInterval(interval);
  }, [session]);

  // Redirigir si la sesión ha caducado
  if (isExpired) {
    signOut({ callbackUrl: "/login", redirect: false }).then(() => {
      router.push("/login");
    });
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-red-600 dark:text-red-400">
          Sesión caducada, redirigiendo...
        </p>
      </div>
    );
  }

  const buscarExpediente = async (expedienteId: string) => {
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

      setResultadoBusqueda(trackingData);
    } catch (err) {
      setError("Error al buscar el expediente");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-background relative overflow-y-auto">
      <main className="flex-1 w-full mx-auto px-4 py-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 text-foreground">
            Seguimiento de Trámite Documentario
          </h1>
          <p className="text-muted-foreground">
            Ingrese el número de expediente para ver el estado de su trámite
          </p>
        </div>

        <SearchForm onSearch={buscarExpediente} loading={loading} />

        {error && (
          <div className="max-w-3xl mx-auto bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {resultadoBusqueda && (
          <TrackingResult
            trackingData={resultadoBusqueda}
            onStepSelect={setSelectedStep}
          />
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