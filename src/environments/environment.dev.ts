/**
 * App environment config.
 *
 * `apiBaseUrl` is the base URL of the Só Vale Reclamar serverless API.
 * Get the real value from the backend repo: `npx serverless info --stage dev`.
 */
export const environment = {
  production: false,
  apiBaseUrl: 'https://ikrkwbapeh.execute-api.us-east-1.amazonaws.com',
  cognito: {
    userPoolId: 'us-east-1_RlpHHCYSp',
    clientId: 'v3k8fd0iqncop866q3476adpa',
  },
};
