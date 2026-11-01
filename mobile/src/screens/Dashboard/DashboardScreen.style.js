
import {StyleSheet} from 'react-native';

const colors = {
  background: '#F7F8FC',
  surface: '#FFFFFF',
  text: '#202938',
  secondary: '#667085',
  muted: '#98A2B3',
  border: '#E6E8EF',
  primary: '#4655A5',
  primaryLight: '#EEF0FA',
  green: '#26734D',
  greenLight: '#EDF7F0',
  gold: '#9A6A13',
  goldLight: '#FFF5D9',
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

  // Compact brand header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  brandIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  brandIconText: {
    color: '#FFFFFF',
    fontSize: 23,
    fontWeight: '800',
  },
  brand: {
    color: colors.text,
    fontSize: 19,
    fontWeight: '800',
  },
  headerSubtitle: {
    color: colors.muted,
    fontSize: 9,
    letterSpacing: 0.7,
    marginTop: 3,
  },
  logoutButton: {
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    backgroundColor: colors.surface,
    marginLeft: 8,
  },
  logoutText: {
    color: colors.secondary,
    fontSize: 12,
    fontWeight: '500',
  },

  // Welcome
  welcomeSection: {
    marginBottom: 26,
  },
  welcomeEyebrow: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 8,
  },
  welcomeText: {
    color: colors.text,
    fontSize: 25,
    fontWeight: '400',
  },
  userName: {
    fontSize: 24,
    fontWeight: '400',
    color: '#1F2937',
  },
  welcomeSubtitle: {
    color: colors.secondary,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 9,
    maxWidth: 330,
  },

  // Profile card styles retained for compatibility
  profileCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  profileCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  profileInitial: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: '400',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '400',
  },
  profileEmail: {
    color: colors.secondary,
    fontSize: 12,
    marginTop: 4,
  },
  accountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 7,
  },
  accountDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.green,
    marginRight: 6,
  },
  accountBadgeText: {
    color: colors.green,
    fontSize: 11,
    fontWeight: '400',
  },
  profileDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginTop: 15,
    marginBottom: 8,
  },
  profileButton: {
    minHeight: 38,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileButtonText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  buttonArrow: {
    color: colors.primary,
    fontSize: 19,
  },

  // Section headings
  sectionHeader: {
    marginTop: 2,
    marginBottom: 12,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '800',
  },
  sectionSubtitle: {
    color: colors.secondary,
    fontSize: 13,
    marginTop: 4,
  },

  // Responsive two-column actions grid


actionCard: {
  width: '48%',
  flexGrow: 0,
  flexShrink: 0,
  backgroundColor: colors.surface,
  borderRadius: 18,
  borderWidth: 1,
  borderColor: '#EAECF4',
  padding: 14,
  marginBottom: 12,
  minHeight: 138,
  elevation: 2,
  shadowColor: '#26336B',
  shadowOffset: {width: 0, height: 2},
  shadowOpacity: 0.05,
  shadowRadius: 8,
},

actionIcon: {
  width: 40,
  height: 40,
  borderRadius: 13,
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: 12,
},

quickActions: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  marginBottom: 20,
},


  profileActionIcon: {
    backgroundColor: '#EEF0FF',
  },

  exportActionIcon: {
    backgroundColor: '#F1F4F8',
  },

  actionIconText: {
    fontSize: 21,
  },

  actionTitle: {
    color: '#252D40',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    paddingRight: 8,
  },

  actionSubtitle: {
    color: '#7B8494',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 5,
  },

  actionArrow: {
    color: colors.primary,
    fontSize: 17,
    position: 'absolute',
    top: 15,
    right: 14,
  },


  // Admin shortcut
  adminCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 14,
    padding: 15,
    marginBottom: 26,
  },
  adminIcon: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  adminIconText: {
    fontSize: 18,
    color: colors.primary,
  },
  adminTextContainer: {
    flex: 1,
  },
  adminTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  adminSubtitle: {
    color: colors.secondary,
    fontSize: 12,
    marginTop: 4,
  },
  adminArrow: {
    color: colors.secondary,
    fontSize: 20,
    marginLeft: 8,
  },

  // Membership card

  planCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E8EAF2',
    marginBottom: 22,
    elevation: 2,
    shadowColor: '#26336B',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },

  planTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  planLabel: {
    color: '#7B8494',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1,
  },

  planName: {
    color: '#202938',
    fontSize: 22,
    fontWeight: '500',
    marginTop: 7,
  },

  planButton: {
    backgroundColor: '#4655A5',
    borderRadius: 12,
    minHeight: 46,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },

  planButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '500',
  },

  planButtonArrow: {
    color: '#FFFFFF',
    fontSize: 18,
    marginLeft: 9,
  },

  planBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.greenLight,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  planBadgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.green,
    marginRight: 6,
  },
  planBadgeText: {
    color: colors.green,
    fontSize: 10,
    fontWeight: '800',
  },
  planDescription: {
    color: colors.secondary,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 12,
    marginBottom: 12,
  },

  planInfoContainer: {
    flex: 1,
  },

  footerText: {
    color: colors.muted,
    fontSize: 11,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 12,
    lineHeight: 18,
  },


  cartCountBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    minWidth: 22,
    height: 22,
    paddingHorizontal: 5,
    borderRadius: 11,
    backgroundColor: '#4655A5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartCountText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },

  goldPlanCard: {
    borderColor: '#E8D6A3',
    backgroundColor: '#FFFEFA',
  },
  goldPlanBadge: {
    backgroundColor: '#FFF2CC',
  },
  goldPlanBadgeDot: {
    backgroundColor: '#9A6A13',
  },
  goldPlanBadgeText: {
    color: '#9A6A13',
  },
  goldMembershipTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFF2CC',
    borderRadius: 7,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginTop: 12,
  },
  goldMembershipTagText: {
    color: '#8A6114',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  silverMembershipTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#DCEBFF',
    borderRadius: 7,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginTop: 12,
  },
  silverMembershipTagText: {
    color: '#1D4ED8',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  pendingPlanBadge: {
    backgroundColor: '#FFF4DB',
  },
  pendingPlanBadgeDot: {
    backgroundColor: '#B7791F',
  },
  pendingPlanBadgeText: {
    color: '#946200',
  },
  inactivePlanBadge: {
    backgroundColor: '#F0F2F5',
  },
  inactivePlanBadgeDot: {
    backgroundColor: '#667085',
  },
  inactivePlanBadgeText: {
    color: '#667085',
  },

  welcomeNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom:12,
  },

  welcomeAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#EEF0FF',
    borderWidth: 1,
    borderColor: '#D9DEFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  welcomeAvatarText: {
    color: '#4655A5',
    fontSize: 21,
    fontWeight: '600',
  },
  welcomeAvatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 22,
  },
  welcomeTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },

});

export default styles;
