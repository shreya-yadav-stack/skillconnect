
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardContainer: {
    flex: 1,
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

  photoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 13,
    marginBottom: 18,
  },
  profilePhoto: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#ECEEF2',
  },
  photoPlaceholder: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoPlaceholderText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  photoInfo: {
    flex: 1,
    marginLeft: 15,
    alignItems: 'flex-start',
  },
  photoTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  photoDescription: {
    color: colors.secondary,
    fontSize: 11,
    marginTop: 4,
    marginBottom: 9,
  },
  choosePhotoButton: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 7,
    paddingHorizontal: 11,
    paddingVertical: 7,
  },
  choosePhotoButtonText: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '600',
  },

  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 13,
    padding: 17,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  cardDescription: {
    color: colors.secondary,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 5,
    marginBottom: 20,
  },
  fieldContainer: {
    marginBottom: 17,
  },
  label: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    minHeight: 46,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 9,
    paddingHorizontal: 12,
    paddingVertical: 11,
    backgroundColor: '#FFFFFF',
    color: colors.text,
    fontSize: 13,
  },

  saveButton: {
    minHeight: 47,
    borderRadius: 9,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
  saveButtonDisabled: {
    opacity: 0.65,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  cancelButton: {
    minHeight: 42,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
  cancelButtonText: {
    color: colors.secondary,
    fontSize: 13,
    fontWeight: '600',
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
    textAlign: 'center',
    marginTop: 22,
  },
  addressSearchLoader: {
    marginTop: 8,
  },
  addressSuggestions: {
    borderWidth: 1,
    borderColor: '#E4E7EC',
    borderRadius: 8,
    marginTop: 6,
    overflow: 'hidden',
  },
  addressSuggestionItem: {
    padding: 12,
    borderBottomColor: '#E4E7EC',
  },
  addressSuggestionText: {
    color: '#344054',
  },
  mapContainer: {
    marginTop: 16,
  },
  map: {
    width: '100%',
    height: 220,
    borderRadius: 12,
  },
  mapHint: {
    fontSize: 12,
    color: '#667085',
    marginTop: 8,
  },
  searchAddressButton: {
    backgroundColor: '#4655A5',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },

  searchAddressButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  mapContainer: {
    marginTop: 16,
  },

  map: {
    width: '100%',
    height: 220,
    borderRadius: 12,
    overflow: 'hidden',
  },

  mapCenterPin: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{translateX: -12}, {translateY: -24}],
  },

  mapCenterPinText: {
    fontSize: 28,
  },

  mapHint: {
    fontSize: 12,
    color: '#667085',
    marginTop: 8,
  },
  addressSuggestions: {
    maxHeight: 220,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#E4E7EC',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
});

export default styles;