import {Dimensions, StyleSheet} from 'react-native';

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F6FF',
  },

  scrollContent: {
    flexGrow: 1,
  },

  screenContent: {
    flexGrow: 1,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: width < 360 ? 18 : 24,
    maxWidth: 480,
  },


  logoSection: {
    alignItems: 'flex-start',
    marginTop: 16,
    marginBottom: 8,
  },

  logoImage: {
    width: width * 0.52,
    height: 52,
  },

  welcomeSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  welcomeTextContainer: {
    flex: 1,
    paddingRight: 8,
  },

  welcomeTitle: {
    fontSize: width < 360 ? 18 : 20,
    lineHeight: width < 360 ? 22 : 25,
    fontWeight: '700',
    color: '#202938',
  },

  welcomeSubtitle: {
    fontSize: 12,
    lineHeight: 18,
    color: '#667085',
    marginTop: 6,
  },

  illustration: {
    width: width * 0.30,
    height: width * 0.28,
  },
  signupCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E8EAF2',
    shadowColor: '#202938',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    elevation: 2,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#202938',
    marginBottom: 6,
  },

  inputContainer: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: '#DDE2EE',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginBottom: 14,
    backgroundColor: '#FFFFFF',
  },

  inputIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },

  input: {
    flex: 1,
    minWidth: 0,
    minHeight: 46,
    fontSize: 14,
    color: '#202938',
    paddingVertical: 0,
  },

  eyeButton: {
    padding: 7,
  },
  error: {
    color: '#DC2626',
    fontSize: 12,
    marginTop: -8,
    marginBottom: 12,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 2,
    marginBottom: 16,
  },

  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    backgroundColor: '#4655A5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },

  checkboxUnchecked: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDE2EE',
  },

  checkmark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },

  termsText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
    color: '#667085',
  },

  termsLink: {
    color: '#4655A5',
    fontWeight: '600',
  },
  buttonContainer: {
    marginTop: 10,
  },

  socialButton: {
    minHeight: 46,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#DDE2EE',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },

  googleLogo: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4285F4',
    marginRight: 8,
  },

  socialText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#202938',
  },

  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 20,
  },

  loginText: {
    fontSize: 13,
    color: '#667085',
    marginRight: 5,
  },

  loginLink: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4655A5',
  },
  accountExistsOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  accountExistsCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
  },
  accountExistsIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  accountExistsTitle: {
    fontSize: 21,
    fontWeight: '700',
    color: '#172554',
    textAlign: 'center',
    marginBottom: 10,
  },
  accountExistsMessage: {
    fontSize: 14,
    lineHeight: 21,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 24,
  },
  accountExistsLoginButton: {
    width: '100%',
    backgroundColor: '#2563EB',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  accountExistsLoginText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  accountExistsCancelButton: {
    width: '100%',
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  accountExistsCancelText: {
    color: '#475569',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default styles;