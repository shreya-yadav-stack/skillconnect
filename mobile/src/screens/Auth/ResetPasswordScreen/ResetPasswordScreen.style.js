import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F6FF',
  },

  content: {
    flex: 1,
    paddingHorizontal: 20,
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },

  header: {
    marginTop: 40,
    marginBottom: 30,
  },

  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#172A50',
  },

  subtitle: {
    fontSize: 14,
    lineHeight: 22,
    color: '#6E7E9F',
    marginTop: 10,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 24,
    elevation: 3,
    shadowColor: '#9AA7C5',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },

  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#26395F',
    marginBottom: 6,
  },

  inputContainer: {
    height: 52,
    borderWidth: 1,
    borderColor: '#D9E1F2',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginBottom: 16,
  },

  inputIcon: {
    marginRight: 10,
  },

  input: {
    flex: 1,
    minWidth: 0,
    fontSize: 14,
    color: '#172A50',
    paddingVertical: 0,
  },

  eyeButton: {
    padding: 8,
  },

  error: {
    color: '#DC2626',
    fontSize: 12,
    marginBottom: 12,
  },
});

export default styles;