
import React, {useCallback, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useFocusEffect} from '@react-navigation/native';
import {getProfessionals} from '../../services/api';
import {useDispatch, useSelector} from 'react-redux';
import {fetchUserProfilePhoto} from '../../redux/usersSlice';


const DiscoverProfessionalsScreen = ({navigation}) => {
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const dispatch = useDispatch();

const photosByUserId = useSelector(
  state => state.users.photosByUserId,
);

  const loadProfessionals = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError('');

      const response = await getProfessionals();
      console.log(
        'PROFESSIONAL MEMBERSHIP DATA:',
        JSON.stringify(response.professionals, null, 2),
      );
      const professionalsList = response.professionals || [];

      setProfessionals(professionalsList);

      professionalsList.forEach(professional => {
        if (professional.profile_photo_url) {
          dispatch(fetchUserProfilePhoto(professional.id));
        }
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Unable to load professionals. Please try again.',
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [dispatch]);

  useFocusEffect(
    useCallback(() => {
      loadProfessionals();
    }, [loadProfessionals]),
  );


  const renderProfessional = ({item}) => {
    const photoUri = photosByUserId[item.id]?.uri;
    const location = [item.city, item.state, item.country]
      .filter(Boolean)
      .join(', ');

      const initial = item.name?.trim()?.charAt(0)?.toUpperCase() || '?';
      const membershipPlan = item.membership_plan || 'Free';
      const isGold = membershipPlan === 'Gold';
      const isSilver = membershipPlan === 'Silver';

    return (
      <View style={[styles.card, isGold && styles.featuredCard]}>
    <View style={[styles.avatar, isGold && styles.goldAvatar]}>
  {photoUri ? (
    <Image
      source={{uri: photoUri}}
      style={styles.avatarImage}
    />
  ) : (
    <Text style={[styles.avatarText, isGold && styles.goldAvatarText]}>
      {initial}
    </Text>
  )}
</View>

        <View style={styles.details}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>
              {item.name || 'Professional'}
            </Text>

            {isGold && (
                      <View
                      style={[
                        styles.membershipBadge,
                        isGold && styles.goldBadge,
                        isSilver && styles.silverBadge,
                      ]}>
                      <Text
                        style={[
                          styles.membershipBadgeText,
                          isGold && styles.goldBadgeText,
                          isSilver && styles.silverBadgeText,
                        ]}>
                        {membershipPlan.toUpperCase()}
                      </Text>
                    </View>
            )}
          </View>

          <Text style={styles.role}>
            {isGold ? 'Featured professional' : 'SkillConnect member'}
          </Text>

          <Text style={styles.location}>
            {location || 'Location not added'}
          </Text>
        </View>
      </View>
    );
  };


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F7F8FC" />

      <View style={styles.header}>
        <Text style={styles.eyebrow}>YOUR NETWORK</Text>
        <Text style={styles.title}>Discover</Text>
        <Text style={styles.subtitle}>
          Find professionals and grow your connections.
        </Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#4F46E5" />
          <Text style={styles.helper}>Finding professionals...</Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.error}>{error}</Text>
          <Text
            style={styles.retry}
            onPress={() => loadProfessionals()}>
            Try again
          </Text>
        </View>
      ) : (
        <FlatList
          data={professionals}
          keyExtractor={item => String(item.id)}
          renderItem={renderProfessional}
          contentContainerStyle={
            professionals.length === 0 ? styles.emptyList : styles.list
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => loadProfessionals(true)}
              tintColor="#4F46E5"
            />
          }
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={styles.emptyTitle}>
                No professionals found yet
              </Text>
              <Text style={styles.helper}>
                Verified members will appear here when available.
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FC',
  },
  header: {
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 20,
  },
  eyebrow: {
    color: '#4F46E5',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  title: {
    color: '#171923',
    fontSize: 30,
    fontWeight: '800',
  },
  subtitle: {
    color: '#697386',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 7,
  },
  list: {
    paddingHorizontal: 18,
    paddingBottom: 24,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E9ECF4',
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#E8E9FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarText: {
    color: '#4338CA',
    fontSize: 22,
    fontWeight: '700',
  },
  details: {
    flex: 1,
  },
  name: {
    color: '#171923',
    fontSize: 16,
    fontWeight: '700',
  },
  role: {
    color: '#4F46E5',
    fontSize: 12,
    marginTop: 4,
  },
  location: {
    color: '#697386',
    fontSize: 12,
    marginTop: 5,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  helper: {
    color: '#697386',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 21,
  },
  error: {
    color: '#B42318',
    fontSize: 14,
    textAlign: 'center',
  },
  retry: {
    color: '#4F46E5',
    fontWeight: '700',
    marginTop: 14,
    padding: 8,
  },
  emptyList: {
    flexGrow: 1,
  },
  emptyTitle: {
    color: '#171923',
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
  },

  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  featuredCard: {
    borderColor: '#E5B94C',
    backgroundColor: '#FFFCF3',
  },
  goldAvatar: {
    backgroundColor: '#FFF0C2',
  },
  goldAvatarText: {
    color: '#946200',
  },
  goldBadge: {
    backgroundColor: '#F5D778',
    borderRadius: 5,
    paddingHorizontal: 6,
    paddingVertical: 3,
    marginLeft: 8,
  },
  goldBadgeText: {
    color: '#704B00',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  membershipBadge: {
    backgroundColor: '#EEF0F5',
    borderRadius: 5,
    paddingHorizontal: 6,
    paddingVertical: 3,
    marginLeft: 8,
  },
  membershipBadgeText: {
    color: '#626D81',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  silverBadge: {
    backgroundColor: '#DCEBFF',
  },
  silverBadgeText: {
    color: '#1D4ED8',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 27,
  },
});

export default DiscoverProfessionalsScreen;
