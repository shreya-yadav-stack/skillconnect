
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
  success: '#26734D',
  successLight: '#EDF7F0',
  error: '#B42318',
  errorLight: '#FEF3F2',
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
    marginBottom: 26,
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
    marginRight: 12,
  },
  backText: {
    color: colors.text,
    fontSize: 29,
    lineHeight: 32,
    marginTop: -3,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    color: colors.text,
    fontSize: 21,
    fontWeight: '700',
  },
  headerSubtitle: {
    color: colors.secondary,
    fontSize: 12,
    marginTop: 4,
  },

  intro: {
    marginBottom: 20,
  },
  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  subtitle: {
    color: colors.secondary,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 7,
  },

  planCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 13,
    padding: 17,
    marginBottom: 14,
  },
  featuredPlanCard: {
    borderColor: '#C9CFF0',
  },
  planHeadingRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  planHeadingText: {
    flex: 1,
    paddingRight: 8,
  },
  planName: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '700',
  },
  planDescription: {
    color: colors.secondary,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 5,
  },

  freeBadge: {
    backgroundColor: colors.successLight,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 6,
  },
  freeBadgeText: {
    color: colors.success,
    fontSize: 10,
    fontWeight: '700',
  },
  recommendedBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 6,
  },
  recommendedText: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: '700',
  },
  freePrice: {
    color: colors.text,
    fontSize: 23,
    fontWeight: '700',
    marginTop: 18,
    marginBottom: 14,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 9,
  },
  featureCheck: {
    color: colors.success,
    fontSize: 14,
    fontWeight: '700',
    marginRight: 9,
  },
  featureText: {
    color: colors.secondary,
    fontSize: 12,
  },

  durationHeading: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 22,
    marginBottom: 11,
  },
  durationRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  durationButton: {
    flexGrow: 1,
    minWidth: 76,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 11,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  selectedDurationButton: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  durationText: {
    color: colors.secondary,
    fontSize: 11,
    fontWeight: '600',
  },
  selectedDurationText: {
    color: colors.primary,
    fontWeight: '700',
  },

  selectionCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: '#D9DDF2',
    borderRadius: 13,
    padding: 17,
    marginTop: 4,
  },
  selectionLabel: {
    color: colors.secondary,
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 12,
  },
  selectionDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 17,
  },
  selectionPlan: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  selectionDuration: {
    color: colors.secondary,
    fontSize: 12,
    marginTop: 5,
  },
  selectionIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectionCheck: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '700',
  },
  continueButton: {
    minHeight: 47,
    borderRadius: 9,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonDisabled: {
    opacity: 0.65,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },

  errorBox: {
    backgroundColor: colors.errorLight,
    borderRadius: 9,
    padding: 12,
    marginBottom: 14,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    lineHeight: 18,
  },
  dismissText: {
    color: colors.error,
    fontSize: 11,
    fontWeight: '700',
    marginTop: 8,
  },

  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: colors.secondary,
    fontSize: 13,
    marginTop: 12,
  },
  footerText: {
    color: colors.muted,
    fontSize: 11,
    lineHeight: 17,
    textAlign: 'center',
    marginTop: 18,
  },
});

export default styles;