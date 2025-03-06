"use client";

import * as React from "react";
import {
  X,
  FileText,
  User,
  Building,
  Calendar,
  CheckCircle,
  Send,
  PenLine,
  LayoutList,
  AlignStartVertical,
  FileCheck2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

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

interface TrackingStep {
  area: string;
  descripcion: string;
  fecha: string;
  estado: string;
  details: TrackingDocument;
}

interface TrackingModalProps {
  step: TrackingStep;
  onClose: () => void;
}

export default function TrackingModal({ step, onClose }: TrackingModalProps) {
  const { details } = step;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center p-4 justify-center z-50">
      <div className="bg-card rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-foreground">
            Detalles del Trámite
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="hover:cursor-pointer"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Documento</p>
              <p className="font-medium">{details.documento}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Building className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Unidad Emisora</p>
              <p className="font-medium">{details.unidad_organica}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Firmado por</p>
              <p className="font-medium">{details.usuario_firma}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Elaborado por</p>
              <p className="font-medium">{details.usuario_elabora}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Cargo remitente</p>
              <p className="font-medium">{details.cargo}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Send className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Unidad Destino</p>
              <p className="font-medium">{details.unidad_destino}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Empleado Destino</p>
              <p className="font-medium">{details.empleado_destino}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Fecha</p>
              <p className="font-medium">{step.fecha}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Estado</p>
              <p className="font-medium">{details.estado_doc}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <AlignStartVertical className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Prioridad</p>
              <p className="font-medium">{details.codigo_prioridad}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <FileCheck2 className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Tipo de trámite</p>
              <p className="font-medium">{details.motivo_tramite}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <PenLine className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Asunto</p>
              <p className="font-medium">{details.asunto}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <LayoutList className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Indicaciones</p>
              <p className="font-medium">
                {details.indicaciones || "Sin indicaciones"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Building className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Local</p>
              <p className="font-medium">{details.local}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Send className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Tipo de Emisión</p>
              <p className="font-medium">{details.tipo_emision}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button onClick={onClose} className="hover:cursor-pointer">
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  );
}
