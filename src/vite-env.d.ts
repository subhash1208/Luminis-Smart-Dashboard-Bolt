/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_USER_POOL_ID: string;
  readonly VITE_CLIENT_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Add Amplify specific type augmentations if needed
declare module 'aws-amplify' {
  // This is a simplified version - update based on your Amplify version
  export namespace Auth {
    interface AuthConfig {
      Cognito: {
        userPoolId: string;
        userPoolClientId: string;
        loginWith?: {
          username?: boolean;
          email?: boolean;
          phone?: boolean;
        };
        signUpVerificationMethod?: string;
        authenticationFlowType?: string;
        mfa?: {
          status: string;
        };
      };
    }
  }
}