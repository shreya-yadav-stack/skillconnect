
import {StyleSheet} from 'react-native';

const colors = {
  background: '#F8F9FB',
  surface: '#FFFFFF',
  text: '#202938',
  secondary: '#667085',
  muted: '#98A2B3',
  border: '#E5E7EB',
  primary: '#4655A5',
  primaryLight: '#EEF0FA',
  green: '#26734D',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 30,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    color: colors.text,
    fontSize: 29,
    lineHeight: 32,
    marginTop: -3,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 12,
  },
  headerSpacer: {
    width: 38,
  },

  profileHeader: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 22,
    marginBottom: 22,
  },
  profileImage: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: 14,
  },
  profileInitial: {
    color: colors.primary,
    fontSize: 30,
    fontWeight: '700',
  },
  profilePhoto: {
    width: '100%',
    height: '100%',
    borderRadius: 38,
  },
  profileName: {
    color: colors.text,
    fontSize: 21,
    fontWeight: '700',
    textAlign: 'center',
  },
  profileEmail: {
    color: colors.secondary,
    fontSize: 13,
    marginTop: 6,
    textAlign: 'center',
  },
  roleBadge: {
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: colors.primaryLight,
    marginTop: 12,
  },
  roleText: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '600',
  },
  editButton: {
    width: '100%',
    minHeight: 44,
    borderRadius: 9,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 19,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },

  card: {
    backgroundColor: colors.surface,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    paddingTop: 17,
    paddingBottom: 4,
    marginBottom: 16,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 7,
  },
  field: {
    paddingVertical: 13,
  },
  fieldLabel: {
    color: colors.secondary,
    fontSize: 12,
    marginBottom: 6,
  },
  fieldValue: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },

  completionCard: {
    backgroundColor: colors.surface,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 17,
    marginTop: 3,
  },
  completionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  completionTextContainer: {
    flex: 1,
    paddingRight: 12,
  },
  completionTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  completionRemaining: {
    color: colors.secondary,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 5,
  },
  completionPercentage: {
    color: colors.primary,
    fontSize: 21,
    fontWeight: '700',
  },
  progressBackground: {
    height: 6,
    backgroundColor: '#ECEEF2',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  completeProfileButton: {
    alignSelf: 'flex-start',
    marginTop: 14,
    paddingVertical: 5,
  },
  completeProfileText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  footerText: {
    color: colors.muted,
    fontSize: 11,
    textAlign: 'center',
    marginTop: 22,
  },
  downloadButton: {
    backgroundColor: '#4655A5',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },

  downloadButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default styles;