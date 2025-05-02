// src/aws-config.ts
import { Amplify } from 'aws-amplify';

const awsConfig = {
  Auth: {
    region:                'ap-south-1',
    userPoolId:            import.meta.env.VITE_USER_POOL_ID,
    userPoolWebClientId:   import.meta.env.VITE_CLIENT_ID,
    mandatorySignIn:       true,
    authenticationFlowType: 'USER_SRP_AUTH' as const,
  }
};

// no error here—TS just infers your object’s shape
export const configureAmplify = () => {
  // cast to any so Amplify.configure doesn’t choke on the “extra” region field
  Amplify.configure(awsConfig as any);
};

export default awsConfig;
