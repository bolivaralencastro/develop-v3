import { resolveAppUrl } from '../app/core/auth/pages-url';

export const environment = {
  mockAuth: true,
  auth: {
    url: 'https://iam.developtecnologia.com.br/',
    realm: 'dev',
    clientId: 'develop-platform-webapp',
  },
  keycloakConfig: {
    config: {
      url: 'https://iam.developtecnologia.com.br',
      realm: 'dev',
      clientId: 'develop-platform-webapp',
      bearerExcludedUrls: [],
    },
    initOptions: {
      onLoad: 'check-sso',
      silentCheckSsoRedirectUri: resolveAppUrl('/assets/silent-check-sso.html'),
    },
  },
  // api: 'http://localhost:3000/api/v1',
  api: 'https://iam.developtecnologia.com.br:3000/api/v1',
  apiParser: 'http://develop-platform-parser-api.us-east-1.elasticbeanstalk.com/api/v1/email-codes',
};
