export interface TrackingDocument {
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

export interface TrackingData {
  id: string;
  estado: string;
  pasos: TrackingStep[];
}

export interface TrackingStep {
  area: string;
  descripcion: string;
  fecha: string;
  estado: string;
  details: TrackingDocument;
}