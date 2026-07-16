// Default/fallback environment — swapped via `fileReplacements` in angular.json
// for the `production`/`development` build configurations. Mirrors prod values
// so an unreplaced build fails safe rather than leaking a dev API URL.
export const environment = {
  production: true,
  apiBaseUrl: 'https://adszv29vmg.execute-api.us-east-1.amazonaws.com',
  cognito: {
    userPoolId: 'us-east-1_ZWVUtUuy4',
    clientId: '7vfdj7v6dmbum3hori7k68hsj',
  },
};