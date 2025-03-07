"use server";

import { query } from "@/lib/db";

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

interface PropsTracking {
  record: string | number;
}

export async function getTrackingDocument({ record }: PropsTracking) {
  try {
    // const formattedRecord = Number(record).toString().padStart(10, "0");

    const result = await query<TrackingDocument>(
      `
      SELECT
      trr.nu_expediente expidiente_rem,
      rem.co_tip_doc_adm || '-' || doc.cdoc_desdoc documento,
      rem.de_asu asunto,
      emp.cemp_co_cargo || '-' || c.ccar_descar cargo,
      rem.nu_ann anio,
      rem.co_loc_emi || '-' || loc.de_nombre_local local,
      rem.fe_use_cre fecha,
      (
        SELECT
          co_est || ' - ' || de_est
        FROM
          idosgd.tdtr_estados
        WHERE
          co_est = rem.es_doc_emi
          AND de_tab = 'TDTV_REMITOS'
      ) estado_doc,
      rem.co_dep_emi || '-' || dep.de_dependencia unidad_organica,
      rem.co_emp_emi || '-' || emp.cemp_apepat || ' ' || emp.cemp_apemat || ' ' || emp.cemp_denom usuario_firma,
      rem.co_emp_res || '-' || (
        select
          r.cemp_apepat || ' ' || r.cemp_apemat || ' ' || r.cemp_denom
        from
          idosgd.rhtm_per_empleados r
        where
          cemp_codemp = rem.co_emp_res
      ) usuario_elabora,
      rem.nu_emi emision,
      (
        SELECT
          cele_codele || ' - ' || cele_desele
        FROM
          idosgd.si_elemento
        WHERE
          ctab_codtab = 'TIP_DESTINO'
          AND cele_codele = rem.ti_emi
      ) tipo_emision,
      des.co_dep_des || '-' || (
        select
          d.de_dependencia
        from
          idosgd.rhtm_dependencia d
        where
          d.co_dependencia = des.co_dep_des
      ) unidad_destino,
      (
        select
          cemp_codemp || '-' || e.cemp_apepat || ' ' || e.cemp_apemat || ' ' || e.cemp_denom
        from
          idosgd.rhtm_per_empleados e
        where
          e.cemp_codemp = des.co_emp_des
      ) empleado_destino,
      des.de_pro indicaciones,
      moti.de_mot motivo_tramite,
      prio.de_pri codigo_prioridad
      FROM
        idosgd.tdtv_remitos rem
        inner join idosgd.tdtv_destinos des on rem.nu_emi = des.nu_emi
        inner join idosgd.si_mae_local loc on rem.co_loc_emi = loc.ccod_local
        inner join idosgd.rhtm_per_empleados emp on rem.co_emp_emi = emp.cemp_codemp
        inner join idosgd.rhtm_cargos c on emp.cemp_co_cargo = c.ccar_co_cargo
        inner join idosgd.rhtm_dependencia dep on rem.co_dep_emi = dep.co_dependencia
        inner join idosgd.si_mae_tipo_doc doc on rem.co_tip_doc_adm = doc.cdoc_tipdoc
        inner join idosgd.tdtr_prioridad prio on prio.co_pri = des.co_pri
        inner join idosgd.tdtr_motivo moti on moti.co_mot = des.co_mot
        inner join idosgd.tdtx_remitos_resumen trr on trr.nu_emi = rem.nu_emi
        
      where
        trr.nu_expediente = $1
        AND rem.es_doc_emi NOT IN ('5', '7', '9')
      order by
        rem.nu_emi desc,
        rem.nu_cor_emi;
      `,
      [record]
    );

    return result;
  } catch (error) {
    console.error("Error al obtener los documentos de seguimiento:", error);
    return null;
  }
}
