
import {Dimensions, StyleSheet} from 'react-native';

const {width} = Dimensions.get('window');

const colors = {
  background: '#F8F9FB',
  surface: '#FFFFFF',
  text: '#202938',
  secondary: '#667085',
  muted: '#98A2B3',
  border: '#E5E7EB',
  primary: '#4655A5',
  primaryLight: '#EEF0FA',
  error: '#DC2626',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  screenContent: {
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    paddingHorizontal: width < 360 ? 18 : 24,
    paddingTop: 20,
    paddingBottom: 28,
  },


  logoSection: {
    alignItems: 'flex-start',
    marginBottom: 28,
  },
  logoImage: {
    width: 155,
    height: 48,
  },

  welcomeSection: {
    marginBottom: 22,
  },
  welcomeTextContainer: {
    flex: 1,
  },
  welcomeTitle: {
    fontSize: 27,
    lineHeight: 34,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.5,
  },
  welcomeSubtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.secondary,
    marginTop: 8,
  },

  loginCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 22,
    borderWidth: 1,
    borderColor: '#E8EAF2',
    shadowColor: '#202938',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  inputContainer: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: '#DDE2EE',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    minHeight: 46,
    fontSize: 14,
    color: colors.text,
    paddingVertical: 0,
  },
  eyeButton: {
    padding: 7,
  },
  eyeText: {
    fontSize: 20,
    color: colors.secondary,
  },

  error: {
    color: colors.error,
    fontSize: 12,
    marginTop: -10,
    marginBottom: 12,
  },

  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    rowGap: 10,
    marginTop: 0,
    marginBottom: 22,
  },
  rememberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 5,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  rememberText: {
    fontSize: 12,
    color: colors.secondary,
  },
  forgotText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },

  buttonContainer: {
    marginTop: 0,
  },

  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  orText: {
    marginHorizontal: 12,
    fontSize: 12,
    color: colors.muted,
  },

  socialRow: {
    flexDirection: 'row',
    gap: 10,
  },
  socialButton: {
    flex: 1,
    minHeight: 46,
    borderWidth: 1,
    borderColor: '#DDE2EE',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  googleIcon: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
    marginRight: 8,
  },
  googleLogo: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
    marginRight: 8,
  },
  appleLogo: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginRight: 8,
  },
  socialIcon: {
    marginRight: 8,
  },
  socialText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },

  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 24,
  },
  signupText: {
    fontSize: 13,
    color: colors.secondary,
    marginRight: 5,
  },
  signupLink: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },

  // Retained so existing JSX can be adjusted without missing styles.
  illustration: {
    width: 0,
    height: 0,
  },
});

export default styles;