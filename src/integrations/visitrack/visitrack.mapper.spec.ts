import { parseSurveyIds } from './dto/activity-query.dto';
import { mapStats } from './visitrack.mapper';

describe('Visitrack mapper', () => {
  it('deduplicates survey ids', () =>
    expect(parseSurveyIds('2,1,2')).toEqual([2, 1]));
  it('recalculates survey and user percentages over the selected set', () => {
    const result = mapStats(
      {
        Usuarios: { Activos: 7, Inactivos: 2 },
        DetalleSurveys: [
          {
            SurveyID: 1,
            TotalActividades: 30,
            Usuarios: [{ UserID: 1, TotalActividades: 10 }],
          },
          {
            SurveyID: 2,
            TotalActividades: 10,
            Usuarios: [{ UserID: 2, TotalActividades: 0 }],
          },
        ],
      },
      [1],
    );
    expect(result.TotalActividades).toBe(30);
    expect(result.DetalleSurveys[0].Porcentaje).toBe(100);
    expect(result.DetalleSurveys[0].Usuarios[0].Porcentaje).toBe(33.33);
    expect(result.Usuarios).toEqual({ Activos: 7, Inactivos: 2 });
  });
  it('returns zero percentages for zero denominators', () => {
    expect(
      mapStats({
        DetalleSurveys: [{ SurveyID: 1, TotalActividades: 0, Usuarios: [{}] }],
      }).DetalleSurveys[0],
    ).toMatchObject({ Porcentaje: 0, Usuarios: [{ Porcentaje: 0 }] });
  });
});
