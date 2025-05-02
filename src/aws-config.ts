// src/aws-config.ts
import { Amplify } from 'aws-amplify';

export function configureAmplify() {
  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId: import.meta.env.VITE_USER_POOL_ID,
        userPoolClientId: import.meta.env.VITE_CLIENT_ID,
        loginWith: {
          username: true,
          email: true,
          phone: false
        },
        signUpVerificationMethod: 'code',
        authenticationFlowType: 'USER_SRP_AUTH',
        mfa: {
          status: 'off'
        }
      }
    }
  });
}

export default {
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_USER_POOL_ID,
      userPoolClientId: import.meta.env.VITE_CLIENT_ID,
      loginWith: {
        username: true,
        email: true,
        phone: false
      },
      authenticationFlowType: 'USER_SRP_AUTH',
    }
  }
};