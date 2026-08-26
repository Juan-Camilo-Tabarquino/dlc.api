import { parseSurveyIds } from './dto/activity-query.dto';
import { mapCounter, mapStats, mapSurveys, mapUsers } from './visitrack.mapper';

describe('Visitrack mapper', () => {
  it('deduplicates survey ids', () =>
    expect(parseSurveyIds('2,1,2')).toEqual([2, 1]));

  it('maps the Visitrack response envelope and ID field for surveys', () => {
    expect(
      mapSurveys({
        status: true,
        response: [
          { Title: 'Z RONDA TURNO', ID: 20184, CompanyID: 3704 },
          { Title: '1. ENROLAMIENTO', ID: 20186, CompanyID: 3704 },
        ],
      }),
    ).toEqual([
      {
        Title: '1. ENROLAMIENTO',
        ID: 20186,
        CompanyID: 3704,
        SurveyID: 20186,
      },
      {
        Title: 'Z RONDA TURNO',
        ID: 20184,
        CompanyID: 3704,
        SurveyID: 20184,
      },
    ]);
  });

  it('maps wrapped users and provider field aliases', () => {
    expect(
      mapUsers({
        status: true,
        response: [
          { ID: 10, Name: 'Ana', StatusEnabled: true },
          { ID: 11, Username: 'Luis', IsDeleted: true },
        ],
      }),
    ).toEqual([
      { UserID: 10, UserName: 'Ana', Active: true },
      { UserID: 11, UserName: 'Luis', Active: false },
    ]);
  });
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

  it('unwraps stats and counter responses', () => {
    expect(
      mapStats({
        response: { DetalleSurveys: [{ SurveyID: 1, TotalActividades: 2 }] },
      }).TotalActividades,
    ).toBe(2);
    expect(
      mapCounter(
        { response: { TotalActividades: 4 } },
        { SurveyID: 1, Title: 'A' },
      ).TotalActividades,
    ).toBe(4);
  });
});
