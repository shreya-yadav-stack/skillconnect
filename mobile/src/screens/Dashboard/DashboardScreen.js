
import React, {useCallback, useState, useEffect} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {
  ScrollView,
  Text,
  View,
  Pressable,
  StatusBar,
  Image,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {logout} from '../../redux/authSlice';
import {
  getMyPlan,
  getProfile,
  getProfilePhoto,
} from '../../services/api';
import styles from './DashboardScreen.style';

const DashboardScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const cartItems = useSelector(state => state.cart.items);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [currentPlan, setCurrentPlan] = useState(null);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchCurrentPlan = async () => {
        try {
          const response = await getMyPlan();

          if (isActive) {
            setCurrentPlan(response.userPlan);
          }
        } catch (error) {
          console.error(
            'DASHBOARD PLAN ERROR:',
            error?.response?.data || error?.message || error,
          );
        }
      };

      fetchCurrentPlan();

      return () => {
        isActive = false;
      };
    }, []),
  );
  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchProfilePhoto = async () => {
        try {
          const profileResponse = await getProfile();

          if (!profileResponse?.profile?.profile_photo_url) {
            if (isActive) {
              setProfilePhoto(null);
            }
            return;
          }

          const photoResponse = await getProfilePhoto();

          if (isActive) {
            setProfilePhoto(
              `data:${photoResponse.mimeType};base64,${photoResponse.base64}`,
            );
          }
        } catch (error) {
          console.error(
            'DASHBOARD PROFILE PHOTO ERROR:',
            error?.response?.data || error?.message || error,
          );
        }
      };

      fetchProfilePhoto();

      return () => {
        isActive = false;
      };
    }, []),
  );
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await getMyPlan();
        setCurrentPlan(response.userPlan);
      } catch (error) {
        console.error(
          'DASHBOARD PLAN REFRESH ERROR:',
          error?.response?.data || error?.message || error,
        );
      }
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const cartCount = (cartItems || []).reduce(
    (total, item) => total + (item.quantity || 0),
    0,
  );

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    dispatch(logout());
  };

  const firstName = user?.name?.trim()?.split(' ')[0] || 'there';

  const planName = currentPlan?.name || 'Loading...';
  const isPending = currentPlan?.payment_status === 'pending';
  const isActive = currentPlan?.is_active === true;
  const isGold = currentPlan?.name === 'Gold' && isActive;
  const isSilver = currentPlan?.name === 'Silver' && isActive;

  const statusLabel = !currentPlan
    ? 'LOADING'
    : isPending
      ? 'PENDING'
      : isActive
        ? 'ACTIVE'
        : 'INACTIVE';

  const formatExpiry = expiryTime => {
    if (!expiryTime) {
      return null;
    }

    const date = new Date(expiryTime);

    if (Number.isNaN(date.getTime())) {
      return null;
    }

    return date.toLocaleString([], {
      day: 'numeric',
      month: 'short',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const expiryLabel = formatExpiry(currentPlan?.expiry_time);

  const renderAction = ({
    title,
    subtitle,
    icon,
    onPress,
    iconStyle,
    badge,
  }) => (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      style={({pressed}) => [
        styles.actionCard,
        pressed && {
          opacity: 0.88,
          transform: [{scale: 0.98}],
        },
      ]}
      onPress={onPress}>
      <View style={[styles.actionIcon, iconStyle]}>
        <Text style={styles.actionIconText}>{icon}</Text>
      </View>

      {badge !== undefined && (
        <View style={styles.cartCountBadge}>
          <Text style={styles.cartCountText}>{badge}</Text>
        </View>
      )}

      <Text style={styles.actionTitle}>{title}</Text>
      <Text style={styles.actionSubtitle}>{subtitle}</Text>
      <Text style={styles.actionArrow}>↗</Text>
    </Pressable>
  );

  return (
    <SafeAreaView
      style={styles.container}
      edges={['top', 'left', 'right']}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#F7F8FC"
        translucent={false}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {/* Compact header */}
        <View style={styles.header}>
          <View style={styles.brandRow}>
            <View style={styles.brandIcon}>
              <Text style={styles.brandIconText}>S</Text>
            </View>

            <View>
              <Text style={styles.brand}>SkillConnect</Text>
              <Text style={styles.headerSubtitle}>
                PROFESSIONAL NETWORK
              </Text>
            </View>
          </View>

          <Pressable
            accessibilityRole="button"
            style={styles.logoutButton}
            onPress={handleLogout}>
            <Text style={styles.logoutText}>Log out</Text>
          </Pressable>
        </View>

        {/* Welcome */}


        <View style={styles.welcomeNameRow}>
        <View style={styles.welcomeAvatar}>
  {profilePhoto ? (
    <Image
      source={{uri: profilePhoto}}
      style={styles.welcomeAvatarImage}
      resizeMode="cover"
    />
  ) : (
    <Text style={styles.welcomeAvatarText}>
      {firstName?.charAt(0)?.toUpperCase() || 'U'}
    </Text>
  )}
</View>

  <View style={styles.welcomeTextContainer}>
    <Text style={styles.userName} numberOfLines={1}>
      {firstName}
    </Text>

    <Text style={styles.welcomeSubtitle}>
      Build connections. Grow your professional presence.
    </Text>
  </View>
</View>


        {/* Main actions */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Explore</Text>
            <Text style={styles.sectionSubtitle}>
              Everything you need, in one place
            </Text>
          </View>
        </View>

        <View style={styles.quickActions}>
          {renderAction({
            title: 'My Profile',
            subtitle: 'Manage your details',
            icon: '👤',
            iconStyle: styles.profileActionIcon,
            onPress: () => navigation.navigate('Profile'),
          })}

          {renderAction({
            title: 'Discover',
            subtitle: 'Find professionals',
            icon: '🤝',
            iconStyle: styles.profileActionIcon,
            onPress: () => navigation.navigate('DiscoverProfessionals'),
          })}

          {renderAction({
            title: 'Products',
            subtitle: 'Browse catalogue',
            icon: '🛍️',
            iconStyle: styles.exportActionIcon,
            onPress: () => navigation.navigate('Products'),
          })}

          {renderAction({
            title: 'My Cart',
            subtitle: cartCount === 1 ? '1 item in your cart' : `${cartCount} items in your cart`,
            icon: '🛒',
            iconStyle: styles.exportActionIcon,
            onPress: () => navigation.navigate('Cart'),
            badge: cartCount > 0 ? cartCount : undefined,
          })}
        </View>

        {/* Admin shortcut */}
        {user?.role === 'admin' && (
          <Pressable
            accessibilityRole="button"
            style={styles.adminCard}
            onPress={() => navigation.navigate('AdminUsers')}>
            <View style={styles.adminIcon}>
              <Text style={styles.adminIconText}>⚙</Text>
            </View>

            <View style={styles.adminTextContainer}>
              <Text style={styles.adminTitle}>Admin dashboard</Text>
              <Text style={styles.adminSubtitle}>
                Manage registered users
              </Text>
            </View>

            <Text style={styles.adminArrow}>→</Text>
          </Pressable>
        )}

        {/* Membership */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Membership</Text>
            <Text style={styles.sectionSubtitle}>
              Your plan and benefits
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.planCard,
            isGold && styles.goldPlanCard,
          ]}>
          <View style={styles.planTopRow}>
          <View style={styles.planInfoContainer}>
              <Text style={styles.planLabel}>CURRENT PLAN</Text>
              <Text style={styles.planName}>
                {currentPlan ? `${planName} Plan` : 'Loading plan...'}
              </Text>
            </View>

            <View
              style={[
                styles.planBadge,
                isPending && styles.pendingPlanBadge,
                !isActive && !isPending && styles.inactivePlanBadge,
                isGold && styles.goldPlanBadge,
              ]}>
              <View
                style={[
                  styles.planBadgeDot,
                  isPending && styles.pendingPlanBadgeDot,
                  !isActive && !isPending && styles.inactivePlanBadgeDot,
                  isGold && styles.goldPlanBadgeDot,
                ]}
              />
              <Text
                style={[
                  styles.planBadgeText,
                  isPending && styles.pendingPlanBadgeText,
                  !isActive && !isPending && styles.inactivePlanBadgeText,
                  isGold && styles.goldPlanBadgeText,
                ]}>
                {statusLabel}
              </Text>
            </View>
          </View>

          {isGold && (
            <View style={styles.goldMembershipTag}>
              <Text style={styles.goldMembershipTagText}>
                ✦ GOLD MEMBER
              </Text>
            </View>
          )}
{isSilver && (
  <View style={styles.silverMembershipTag}>
    <Text style={styles.silverMembershipTagText}>
      ✦ SILVER MEMBER
    </Text>
  </View>
)}
          {expiryLabel && isActive && (
            <Text style={styles.planDescription}>
              Expires {expiryLabel}
            </Text>
          )}

          {isPending && (
            <Text style={styles.planDescription}>
              Your membership is awaiting payment confirmation.
            </Text>
          )}

          {!isActive && !isPending && currentPlan && (
            <Text style={styles.planDescription}>
              Explore plans to find the membership that suits you.
            </Text>
          )}

          <Pressable
            accessibilityRole="button"
            style={styles.planButton}
            onPress={() => navigation.navigate('Plans')}>
            <Text style={styles.planButtonText}>
              Manage membership
            </Text>
            <Text style={styles.planButtonArrow}>→</Text>
          </Pressable>
        </View>

        <Text style={styles.footerText}>
          SkillConnect · Grow your professional network
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DashboardScreen;
