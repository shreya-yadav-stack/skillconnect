import {GoogleSignin} from '@react-native-google-signin/google-signin';
import api from './api';

// Replace this placeholder with your Web application OAuth Client ID.
// Use the SAME Web Client ID as GOOGLE_WEB_CLIENT_ID in backend/.env.
GoogleSignin.configure({
  webClientId: '154092338773-tnsam0485ppdbl0hpcamiat4cjfqsajl.apps.googleusercontent.com',
  offlineAccess: false,
});

export const authenticateWithGoogle = async (mode) => {
  await GoogleSignin.hasPlayServices({
    showPlayServicesUpdateDialog: true,
  });

  await GoogleSignin.signOut();

  const signInResponse = await GoogleSignin.signIn();

  // The user may cancel the Google sign-in screen.
  if (signInResponse.type !== 'success') {
    return null;
  }

  const idToken = signInResponse.data.idToken;

  if (!idToken) {
    throw new Error(
      'Google ID token is missing. Check your Web Client ID configuration.',
    );
  }

  // Backend verifies the Google token and creates or signs in the user.
  const response = await api.post('/api/auth/google', {
    idToken,
    mode,
  });

  return response.data;
};
