export default () => ({
  clientId: process.env.CLIENT_ID || '0682a2b8-b91d-4dff-ae0b-67fcaa94d876',
  clientSecret: process.env.CLIENT_SECRET || '',
  authorizationCode: process.env.AUTHORIZATION_CODE || '',
  redirectUri: process.env.REDIRECT_URI || 'http://localhost:3000/api/token',

  service: {
    url: process.env.SERVICE_URL || 'https://dorlov777.amocrm.ru',
    apiUrl: process.env.SERVICE_API_URL || 'https://dorlov777.amocrm.ru/api/v4',
    tokenUrl:
      process.env.SERVICE_TOKEN_URL ||
      'https://dorlov777.amocrm.ru/oauth2/access_token',
  },
});
