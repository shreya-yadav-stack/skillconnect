
import React, {useCallback, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {
  ScrollView,
  Text,
  View,
  Pressable,
  StatusBar,
  Image,
  ActivityIndicator,
  Alert,
  ToastAndroid,
} from 'react-native';
import {useSelector} from 'react-redux';
import ReactNativeBlobUtil from 'react-native-blob-util';
import {SafeAreaView} from 'react-native-safe-area-context';
import styles from './ProfileScreen.style';
import {
  getProfile,
  getProfilePhoto,
} from '../../services/api';
import {generatePDF} from 'react-native-html-to-pdf';

const ProfileScreen = ({navigation}) => {
  const user = useSelector(state => state.auth.user);
  const [profile, setProfile] = useState(null);
const [profilePhoto, setProfilePhoto] = useState(null);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchProfile = async () => {
        try {
          const response = await getProfile();

          if (isActive) {
            setProfile(response.profile);
          }

          if (response.profile?.profile_photo_url) {
            try {
              const photoResponse = await getProfilePhoto();

              if (isActive) {
                setProfilePhoto(
                  `data:${photoResponse.mimeType};base64,${photoResponse.base64}`,
                );
              }
            } catch (photoError) {
              console.log(
                'GET PROFILE PHOTO ERROR:',
                photoError.response?.data || photoError.message,
              );
            }
          } else if (isActive) {
            setProfilePhoto(null);
          }
        } catch (error) {
          console.log(
            'GET PROFILE ERROR:',
            error.response?.data || error.message,
          );
        }
      };

      fetchProfile();

      return () => {
        isActive = false;
      };
    }, []),
  );

  const userName = user?.name || 'User';
  const userEmail = user?.email || 'No email available';
  const userRole = user?.role || 'user';



  const completionFields = [
    user?.name,
    user?.email,
    profile?.address,
    profile?.city,
    profile?.state,
    profile?.country,
    profile?.postal_code,
  ];

  const completedFields = completionFields.filter(
    field => field && String(field).trim() !== '',
  ).length;

  const profileCompletion = Math.round(
    (completedFields / completionFields.length) * 100,
  );

  const remainingFields = completionFields.length - completedFields;

  const location = [
    profile?.city,
    profile?.state,
    profile?.country,
  ]
    .filter(Boolean)
    .join(', ');

  const renderField = (label, value, isLast = false) => (
    <View>
      <View style={styles.field}>
        <Text style={styles.fieldLabel}>{label}</Text>
        <Text style={styles.fieldValue}>{value || 'Not added'}</Text>
      </View>
      {!isLast && <View style={styles.divider} />}
    </View>
  );
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadProfile = async () => {
    try {
      setIsDownloading(true);

      const escapeHtml = value =>
        String(value || '').replace(/[&<>"']/g, character => ({
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#39;',
        })[character]);

      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8" />
            <style>
              body { font-family: Arial, sans-serif; padding: 32px; color: #202938; }
              h1 { color: #4655A5; margin-bottom: 6px; }
              .subtitle { color: #667085; margin-bottom: 28px; }
              .section { margin-top: 24px; }
              .section-title { color: #4655A5; font-size: 18px; border-bottom: 1px solid #E5E7EB; padding-bottom: 8px; }
              .label { color: #667085; font-size: 12px; margin-top: 16px; }
              .value { font-size: 15px; margin-top: 4px; }
              .photo { width: 90px; height: 90px; border-radius: 45px; object-fit: cover; }
              .footer { margin-top: 40px; color: #98A2B3; font-size: 11px; }
            </style>
          </head>
          <body>
            <h1>SkillConnect</h1>
            <div class="subtitle">Personal Profile</div>

            ${profilePhoto ? `<img class="photo" src="${profilePhoto}" />` : ''}

            <div class="section">
              <div class="section-title">Personal Information</div>
              <div class="label">Full Name</div>
              <div class="value">${escapeHtml(userName)}</div>
              <div class="label">Email Address</div>
              <div class="value">${escapeHtml(userEmail)}</div>
              <div class="label">Role</div>
              <div class="value">${escapeHtml(userRole)}</div>
            </div>

            <div class="section">
              <div class="section-title">Location Information</div>
              <div class="label">Address</div>
              <div class="value">${escapeHtml(profile?.address || 'Not added')}</div>
              <div class="label">City</div>
              <div class="value">${escapeHtml(profile?.city || 'Not added')}</div>
              <div class="label">State</div>
              <div class="value">${escapeHtml(profile?.state || 'Not added')}</div>
              <div class="label">Country</div>
              <div class="value">${escapeHtml(profile?.country || 'Not added')}</div>
              <div class="label">Postal Code</div>
              <div class="value">${escapeHtml(profile?.postal_code || 'Not added')}</div>
            </div>

            <div class="footer">
              Generated on ${new Date().toLocaleDateString()}
            </div>
          </body>
        </html>
      `;

      const pdf = await generatePDF({
        html,
        fileName: 'SkillConnect_Profile',
        directory: 'Documents',
      });

      if (!pdf?.filePath) {
        throw new Error('PDF could not be generated.');
      }

    await ReactNativeBlobUtil.MediaCollection.copyToMediaStore(
      {
        name: 'SkillConnect_Profile.pdf',
        parentFolder: '',
        mimeType: 'application/pdf',
      },
      'Download',
      pdf.filePath,
    );

      ToastAndroid.show(
        'Profile PDF saved to Downloads',
        ToastAndroid.LONG,
      );
    } catch (error) {
      Alert.alert('Download failed', error.message || 'Unable to generate profile PDF.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FB" />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>‹</Text>
          </Pressable>

          <Text style={styles.headerTitle}>My Profile</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Profile summary */}
        <View style={styles.profileHeader}>
        <View style={styles.profileImage}>
  {profilePhoto ? (
    <Image
  source={{uri: profilePhoto}}
  style={styles.profilePhoto}
  resizeMode="cover"
/>
  ) : (
    <Text style={styles.profileInitial}>
      {userName.trim().charAt(0).toUpperCase()}
    </Text>
  )}
</View>

          <Text style={styles.profileName}>{userName}</Text>
          <Text style={styles.profileEmail}>{userEmail}</Text>

          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>
              {userRole === 'admin' ? 'Administrator' : 'User'}
            </Text>
          </View>

          <Pressable
            accessibilityRole="button"
            style={styles.editButton}
            onPress={() => navigation.navigate('EditProfile')}>
            <Text style={styles.editButtonText}>Edit profile</Text>
          </Pressable>
        </View>

        {/* Personal information */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Personal information</Text>

          {renderField('Full name', userName)}
          {renderField('Email address', userEmail, true)}
        </View>

        {/* Location information */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Location information</Text>

          {renderField('Address', profile?.address)}
          {renderField('City, state and country', location)}
          {renderField('Postal code', profile?.postal_code, true)}
        </View>

        <Pressable
  style={styles.downloadButton}
  onPress={handleDownloadProfile}
  disabled={isDownloading}>
  {isDownloading ? (
    <ActivityIndicator color="#FFFFFF" />
  ) : (
    <Text style={styles.downloadButtonText}>
      Download Profile as PDF
    </Text>
  )}
</Pressable>

        {/* Profile completion */}
        <View style={styles.completionCard}>
          <View style={styles.completionHeader}>
            <View style={styles.completionTextContainer}>
              <Text style={styles.completionTitle}>Profile completion</Text>
              <Text style={styles.completionRemaining}>
                {remainingFields === 0
                  ? 'All profile details are complete.'
                  : `${remainingFields} ${
                      remainingFields === 1 ? 'item' : 'items'
                    } remaining`}
              </Text>
            </View>

            <Text style={styles.completionPercentage}>
              {profileCompletion}%
            </Text>
          </View>

          <View
            style={styles.progressBackground}
            accessibilityRole="progressbar"
            accessibilityValue={{
              min: 0,
              max: 100,
              now: profileCompletion,
            }}>
            <View
              style={[
                styles.progressFill,
                {width: `${profileCompletion}%`},
              ]}
            />
          </View>

          {remainingFields > 0 && (
            <Pressable
              accessibilityRole="button"
              style={styles.completeProfileButton}
              onPress={() => navigation.navigate('EditProfile')}>
              <Text style={styles.completeProfileText}>
                Complete your profile →
              </Text>
            </Pressable>
          )}
        </View>

        <Text style={styles.footerText}>SkillConnect</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;