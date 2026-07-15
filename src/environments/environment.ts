/**
 * App environment config.
 *
 * `apiBaseUrl` is the base URL of the Só Vale Reclamar serverless API.
 * Get the real value from the backend repo: `npx serverless info --stage dev`.
 */
export const environment = {
  production: false,
  // TODO: replace with the deployed API Gateway URL.
  apiBaseUrl: 'https://REPLACE-ME.execute-api.us-east-1.amazonaws.com',
};
