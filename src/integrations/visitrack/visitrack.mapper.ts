import {
  ActivityStats,
  CounterResult,
  VisitrackSurvey,
  VisitrackUser,
} from './types/visitrack.types';

const number = (value: unknown): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};
const percentage = (part: number, total: number) =>
  total === 0 ? 0 : Math.round((part / total) * 10000) / 100;
const array = (value: unknown): Record<string, unknown>[] =>
  Array.isArray(value) ? (value as Record<string, unknown>[]) : [];

export function mapSurveys(payload: unknown): VisitrackSurvey[] {
  const rows = Array.isArray(payload)
    ? payload
    : array((payload as Record<string, unknown>)?.data);
  return rows
    .map((row) => ({
      ...row,
      SurveyID: number(row.SurveyID),
      Title: String(row.Title ?? ''),
    }))
    .sort((a, b) => a.Title.localeCompare(b.Title));
}

export function mapUsers(payload: unknown): VisitrackUser[] {
  const rows = Array.isArray(payload)
    ? payload
    : array((payload as Record<string, unknown>)?.data);
  return rows.map((row) => ({
    UserID: number(row.UserID),
    UserName: String(row.UserName ?? ''),
    Active:
      row.Active == null
        ? null
        : row.Active === true || row.Active === 1 || row.Active === '1',
  }));
}

export function mapStats(payload: unknown, selected?: number[]): ActivityStats {
  const source = (payload ?? {}) as Record<string, unknown>;
  const details = array(source.DetalleSurveys).filter(
    (row) => !selected || selected.includes(number(row.SurveyID)),
  );
  const total = details.reduce(
    (sum, row) => sum + number(row.TotalActividades),
    0,
  );
  const mapped = details.map((row) => {
    const surveyTotal = number(row.TotalActividades);
    return {
      SurveyID: number(row.SurveyID),
      Title: String(row.Title ?? ''),
      TotalActividades: surveyTotal,
      Porcentaje: percentage(surveyTotal, total),
      Usuarios: array(row.Usuarios).map((user) => ({
        UserID: number(user.UserID),
        UserName: String(user.UserName ?? ''),
        TotalActividades: number(user.TotalActividades),
        Porcentaje: percentage(number(user.TotalActividades), surveyTotal),
      })),
      more: row.more ?? null,
    };
  });
  const users = (source.Usuarios ?? {}) as Record<string, unknown>;
  return {
    status: source.status == null ? null : String(source.status),
    TotalSurveys: mapped.length,
    Usuarios: {
      Activos: number(users.Activos),
      Inactivos: number(users.Inactivos),
    },
    TotalActividades: total,
    DetalleSurveys: mapped,
  };
}

export function mapCounter(
  payload: unknown,
  survey: VisitrackSurvey,
): CounterResult {
  const row = (payload ?? {}) as Record<string, unknown>;
  return {
    SurveyID: survey.SurveyID,
    Title: survey.Title,
    TotalActividades: number(row.TotalActividades),
    TotalActivas: number(row.TotalActivas),
    TotalEliminadas: number(row.TotalEliminadas),
    ActividadesSinLocation: number(row.ActividadesSinLocation),
    ActividadesSinAsset: number(row.ActividadesSinAsset),
    Locations: Array.isArray(row.Locations) ? row.Locations : [],
    Assets: Array.isArray(row.Assets) ? row.Assets : [],
    LocationsSinActividad: Array.isArray(row.LocationsSinActividad)
      ? row.LocationsSinActividad
      : [],
    AssetsSinActividad: Array.isArray(row.AssetsSinActividad)
      ? row.AssetsSinActividad
      : [],
  };
}
