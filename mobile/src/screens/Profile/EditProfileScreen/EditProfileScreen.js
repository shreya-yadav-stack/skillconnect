
import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  Text,
  TextInput,
  View,
  Pressable,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import {Camera, Map} from '@maplibre/maplibre-react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {launchImageLibrary} from 'react-native-image-picker';

import {
  getProfile,
  saveProfile,
  uploadProfilePhoto,
  searchAddresses,
  reverseGeocode,
} from '../../../services/api';
import styles from './EditProfileScreen.style';

const EditProfileScreen = ({navigation}) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [isMapTouching, setIsMapTouching] = useState(false);
const [searchingAddress, setSearchingAddress] = useState(false);
  const [form, setForm] = useState({
    address: '',
    city: '',
    state: '',
    country: '',
    postal_code: '',
    latitude: null,
    longitude: null,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile();
        const profile = response.profile;

        setForm({
          address: profile?.address || '',
          city: profile?.city || '',
          state: profile?.state || '',
          country: profile?.country || '',
          postal_code: profile?.postal_code || '',
          latitude: profile?.latitude ?? null,
          longitude: profile?.longitude ?? null,
        });
      } catch (error) {
        console.log(
          'GET PROFILE ERROR:',
          error.response?.data || error.message,
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);


  const handleAddressChange = value => {
    setForm(previous => ({
      ...previous,
      address: value,
      latitude: null,
      longitude: null,
    }));

    setAddressSuggestions([]);
  };

  const handleSearchAddress = async () => {
    const query = form.address.trim();

    if (query.length < 3) {
      Alert.alert('Address required', 'Enter at least 3 characters.');
      return;
    }

    try {
      setSearchingAddress(true);
      setAddressSuggestions([]);

      const response = await searchAddresses(query);
      setAddressSuggestions(response.results || []);

      if (!response.results?.length) {
        Alert.alert('No results', 'No matching addresses were found.');
      }
    } catch (error) {
      console.log(
        'ADDRESS SEARCH ERROR:',
        error.response?.data || error.message,
      );
      Alert.alert('Search error', 'Unable to search addresses. Try again.');
    } finally {
      setSearchingAddress(false);
    }
  };

  const handleSelectAddress = place => {
    setForm(previous => ({
      ...previous,
      address: place.display_name || '',
      city: place.address?.city || '',
      state: place.address?.state || '',
      country: place.address?.country || '',
      postal_code: place.address?.postal_code || '',
      latitude: place.latitude,
      longitude: place.longitude,
    }));

    setAddressSuggestions([]);
  };
  const handleChoosePhoto = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
      });

      if (result.didCancel) {
        return;
      }

      if (result.errorCode) {
        console.log('IMAGE PICKER ERROR:', result.errorMessage);
        return;
      }

      const selectedPhoto = result.assets?.[0];
      if (selectedPhoto?.uri) {
        setProfilePhoto(selectedPhoto);
      }
    } catch (error) {
      console.log('IMAGE PICKER ERROR:', error.message);
    }
  };

  const handleMapLocationChange = async (latitude, longitude) => {
    setForm(previous => ({
      ...previous,
      latitude,
      longitude,
    }));

    try {
      const response = await reverseGeocode(latitude, longitude);
      const place = response.result;

      if (!place) {
        return;
      }

      setForm(previous => ({
        ...previous,
        address: place.display_name || previous.address,
        city: place.address?.city || '',
        state: place.address?.state || '',
        country: place.address?.country || '',
        postal_code: place.address?.postal_code || '',
        latitude,
        longitude,
      }));
    } catch (error) {
      console.log(
        'REVERSE GEOCODING ERROR:',
        error.response?.data || error.message,
      );
    }
  };

  const handleSave = async () => {
    if (saving) {
      return;
    }

    try {
      setSaving(true);

      if (profilePhoto?.uri) {
        await uploadProfilePhoto(profilePhoto);
      }
      await saveProfile({
        address: form.address.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        country: form.country.trim(),
        postal_code: form.postal_code.trim(),
        latitude: form.latitude,
        longitude: form.longitude,
      });
      Alert.alert('Success', 'Profile saved successfully.', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      console.log(
        'SAVE PROFILE ERROR:',
        error.response?.data || error.message,
      );

      Alert.alert(
        'Save failed',
        error.response?.data?.message ||
          'Unable to save your profile. Please try again.',
      );
    } finally {
      setSaving(false);
    }
  };

  const renderField = (
    label,
    field,
    placeholder,
    options = {},
  ) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>{label}</Text>

      <TextInput
        style={styles.input}
        value={String(form[field] ?? '')}
        onChangeText={value =>
          setForm(previous => ({
            ...previous,
            [field]: value,
          }))
        }
        placeholder={placeholder}
        placeholderTextColor="#98A2B3"
        editable={!saving}
        {...options}
      />
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#4655A5" />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
  contentContainerStyle={styles.content}
  keyboardShouldPersistTaps="handled"
  showsVerticalScrollIndicator={false}
  scrollEnabled={!isMapTouching}>
          {/* Header */}
          <View style={styles.header}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Go back"
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              disabled={saving}>
              <Text style={styles.backText}>‹</Text>
            </Pressable>

            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle}>Edit profile</Text>
              <Text style={styles.headerSubtitle}>
                Keep your information up to date
              </Text>
            </View>
          </View>

          {/* Profile photo */}
          <View style={styles.photoSection}>
            {profilePhoto ? (
           <Image
           source={{uri: profilePhoto.uri}}
           style={styles.profilePhoto}
         />
            ) : (
              <View style={styles.photoPlaceholder}>
                <Text style={styles.photoPlaceholderText}>Photo</Text>
              </View>
            )}

            <View style={styles.photoInfo}>
              <Text style={styles.photoTitle}>Profile photo</Text>
              <Text style={styles.photoDescription}>
                Choose an image from your device
              </Text>

              <Pressable
                accessibilityRole="button"
                style={styles.choosePhotoButton}
                onPress={handleChoosePhoto}
                disabled={saving}>
                <Text style={styles.choosePhotoButtonText}>
                  Choose photo
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Form */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Location details</Text>
            <Text style={styles.cardDescription}>
              Add your address to complete your profile.
            </Text>
            <View style={styles.fieldContainer}>
  <Text style={styles.label}>Address</Text>

  <TextInput
    style={styles.input}
    value={form.address}
    onChangeText={handleAddressChange}
    placeholder="Enter your address"
    placeholderTextColor="#98A2B3"
    editable={!saving && !searchingAddress}
    returnKeyType="search"
    onSubmitEditing={handleSearchAddress}
  />

  <Pressable
    style={styles.searchAddressButton}
    onPress={handleSearchAddress}
    disabled={saving || searchingAddress}>
    {searchingAddress ? (
      <ActivityIndicator color="#FFFFFF" />
    ) : (
      <Text style={styles.searchAddressButtonText}>
        Search address
      </Text>
    )}
  </Pressable>

  {addressSuggestions.length > 0 && (
    <ScrollView
  style={styles.addressSuggestions}
  nestedScrollEnabled
  keyboardShouldPersistTaps="handled"
  showsVerticalScrollIndicator={false}>
      {addressSuggestions.map((place, index) => (
        <Pressable
          key={`${place.latitude}-${place.longitude}`}
          onPress={() => handleSelectAddress(place)}
          disabled={saving}
          style={[
            styles.addressSuggestionItem,
            index === addressSuggestions.length - 1 &&
              styles.addressSuggestionLastItem,
          ]}>
          <Text style={styles.addressSuggestionText}>
            {place.display_name}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  )}

  <Text style={styles.mapHint}>
    Search and select your address to set its map location.
  </Text>
</View>

            {renderField('City', 'city', 'Enter city')}

            {renderField('State', 'state', 'Enter state')}

            {renderField('Country', 'country', 'Enter country')}

            {renderField(
              'Postal code',
              'postal_code',
              'Enter postal code',
              {
                keyboardType: 'number-pad',
                maxLength: 12,
              },
            )}
{form.latitude != null && form.longitude != null && (
  <View style={styles.mapContainer}>
    <Text style={styles.label}>Adjust your location</Text>

    <View
      style={styles.map}
      onTouchStart={() => setIsMapTouching(true)}
      onTouchEnd={() => setIsMapTouching(false)}
      onTouchCancel={() => setIsMapTouching(false)}>
      <Map
        mapStyle="https://tiles.openfreemap.org/styles/liberty"
        dragPan={true}
        onRegionDidChange={event => {
          const center = event.nativeEvent?.center;

          if (Array.isArray(center) && center.length === 2) {
            handleMapLocationChange(center[1], center[0]);
          }
        }}>
        <Camera
          initialViewState={{
            center: [
              Number(form.longitude),
              Number(form.latitude),
            ],
            zoom: 15,
          }}
        />
      </Map>

      <View style={styles.mapCenterPin} pointerEvents="none">
        <Text style={styles.mapCenterPinText}>📍</Text>
      </View>
    </View>

    <Text style={styles.mapHint}>
      Move the map to position the pin over your location.
    </Text>

    <Text style={styles.mapHint}>
      Map data © OpenStreetMap contributors
    </Text>
  </View>
)}
            <Pressable
              accessibilityRole="button"
              style={[
                styles.saveButton,
                saving && styles.saveButtonDisabled,
              ]}
              onPress={handleSave}
              disabled={saving}>
              {saving ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.saveButtonText}>Save changes</Text>
              )}
            </Pressable>

            <Pressable
              accessibilityRole="button"
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}
              disabled={saving}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </Pressable>
          </View>

          <Text style={styles.footerText}>SkillConnect</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default EditProfileScreen;
