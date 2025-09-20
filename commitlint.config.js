module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'body-max-line-length': [2, 'always', 100],
    'footer-max-line-length': [2, 'always', 100],
    'subject-case': [2, 'never', ['start-case', 'pascal-case', 'upper-case']],
    'subject-empty': [2, 'never'],
    'type-enum': [
      2,
      'always',
      [
        'feat', // nueva funcionalidad
        'fix', // corrección de bugs
        'docs', // documentación
        'style', // estilos, formato, comas, puntos y comas…
        'refactor', // refactorización sin cambiar comportamiento
        'perf', // mejoras de rendimiento
        'test', // agregar/corregir tests
        'build', // cambios en build, dependencias, CI/CD
        'ci', // configuración de CI
        'chore', // mantenimiento, tareas menores
        'revert', // revertir un commit
      ],
    ],
  },
};
