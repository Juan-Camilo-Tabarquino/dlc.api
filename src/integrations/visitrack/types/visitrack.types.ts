export interface VisitrackSurvey {
  SurveyID: number;
  Title: string;
  [field: string]: unknown;
}

export interface VisitrackUser {
  UserID: number;
  UserName: string;
  Active: boolean | null;
}

export interface ActivityUser {
  UserID: number;
  UserName: string;
  TotalActividades: number;
  Porcentaje: number;
}

export interface ActivitySurvey {
  SurveyID: number;
  Title: string;
  TotalActividades: number;
  Porcentaje: number;
  Usuarios: ActivityUser[];
  more: unknown;
}

export interface ActivityStats {
  status: string | null;
  TotalSurveys: number;
  Usuarios: { Activos: number; Inactivos: number };
  TotalActividades: number;
  DetalleSurveys: ActivitySurvey[];
}

export interface CounterResult {
  SurveyID: number;
  Title: string;
  TotalActividades: number;
  TotalActivas: number;
  TotalEliminadas: number;
  ActividadesSinLocation: number;
  ActividadesSinAsset: number;
  Locations: unknown[];
  Assets: unknown[];
  LocationsSinActividad: unknown[];
  AssetsSinActividad: unknown[];
}

export interface ProviderError {
  status?: number;
  code: string;
  message: string;
}
