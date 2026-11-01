import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Ionicons} from '@react-native-vector-icons/ionicons';
import api from '../../services/api';
import {fetchUserProfilePhoto} from '../../redux/usersSlice';

const COLORS = {
  background: '#F8F9FC',
  surface: '#FFFFFF',
  primary: '#4655A5',
  primaryLight: '#EEF0FF',
  text: '#202938',
  muted: '#788195',
  border: '#E6E9F0',
  green: '#18794E',
  greenBg: '#E7F7EE',
  orange: '#A15C07',
  orangeBg: '#FFF3DB',
  red: '#B42318',
};

const AdminUsersScreen = ({navigation}) => {
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();

const photosByUserId = useSelector(
  state => state.users.photosByUserId,
);

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const fetchUsers = useCallback(
    async (requestedPage = 1) => {
      try {
        setError('');

        const response = await api.get('/api/admin/users', {
          params: {
            page: requestedPage,
            limit: 10,
            search: search.trim(),
            status,
          },
        });

        const usersList = response.data.users || [];

        setUsers(usersList);

        usersList.forEach(adminUser => {
          if (adminUser.profile_photo_url) {
            dispatch(fetchUserProfilePhoto(adminUser.id));
          }
        });
        setPage(response.data.pagination?.page || requestedPage);
        setTotalPages(response.data.pagination?.totalPages || 1);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            'Unable to load users. Please try again.',
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [search, status, dispatch],
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true);
      fetchUsers(1);
    }, 350);

    return () => clearTimeout(timer);
  }, [fetchUsers]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchUsers(page);
  };

  const filters = [
    {label: 'All users', value: ''},
    {label: 'Verified', value: 'verified'},
    {label: 'Unverified', value: 'unverified'},
  ];

  const renderUser = ({item}) => {
    const verified = Boolean(item.is_email_verified);
    const initials = (item.name || item.email || 'U')
      .trim()
      .charAt(0)
      .toUpperCase();

    return (
      <View style={styles.userCard}>
        <View style={styles.userTopRow}>
        <View style={styles.avatar}>
  {photosByUserId[item.id]?.uri ? (
    <Image
      source={{uri: photosByUserId[item.id].uri}}
      style={styles.avatarImage}
    />
  ) : (
    <Text style={styles.avatarText}>{initials}</Text>
  )}
</View>

          <View style={styles.userInfo}>
            <Text style={styles.userName} numberOfLines={1}>
              {item.name || 'Unnamed user'}
            </Text>
            <Text style={styles.email} numberOfLines={2}>
              {item.email}
            </Text>
          </View>

          <View
            style={[
              styles.statusBadge,
              verified ? styles.verifiedBadge : styles.unverifiedBadge,
            ]}>
            <View
              style={[
                styles.statusDot,
                {backgroundColor: verified ? COLORS.green : COLORS.orange},
              ]}
            />
            <Text
              style={[
                styles.statusText,
                {color: verified ? COLORS.green : COLORS.orange},
              ]}>
              {verified ? 'Verified' : 'Unverified'}
            </Text>
          </View>
        </View>

        <View style={styles.cardDivider} />
        <View style={styles.membershipRow}>
  <View style={styles.membershipInfo}>
    <Ionicons
      name="ribbon-outline"
      size={17}
      color={COLORS.primary}
    />
    <Text style={styles.membershipLabel}>Membership</Text>
  </View>

  <View
    style={[
      styles.membershipBadge,
      item.membership_plan === 'Gold' && styles.goldBadge,
      item.membership_plan === 'Silver' && styles.silverBadge,
    ]}>
    <Text
      style={[
        styles.membershipText,
        item.membership_plan === 'Gold' && styles.goldText,
        item.membership_plan === 'Silver' && styles.silverText,
      ]}>
      {item.membership_plan || 'Free'}
    </Text>
  </View>
</View>
        <View style={styles.userFooter}>
          <View style={styles.metaItem}>
            <Ionicons
              name="shield-checkmark-outline"
              size={15}
              color={COLORS.muted}
            />
            <Text style={styles.metaText}>
              {item.role || 'user'}
            </Text>
          </View>

          <Text style={styles.userId}>ID #{item.id}</Text>
        </View>
      </View>
    );
  };

  if (user?.role !== 'admin') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <View style={styles.accessIcon}>
            <Ionicons
              name="lock-closed-outline"
              size={30}
              color={COLORS.red}
            />
          </View>
          <Text style={styles.errorTitle}>Access denied</Text>
          <Text style={styles.muted}>
            This screen is available to admins only.
          </Text>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate('Dashboard')}>
            <Text style={styles.primaryButtonText}>Back to Dashboard</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.eyebrow}>ADMINISTRATION</Text>
          <Text style={styles.title}>Users</Text>
          <Text style={styles.subtitle}>
            Manage registered accounts
          </Text>
        </View>

        <TouchableOpacity
          style={styles.backIconButton}
          onPress={() => navigation.navigate('Dashboard')}
          accessibilityLabel="Back to dashboard">
          <Ionicons name="arrow-back-outline" size={21} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color={COLORS.muted} />
        <TextInput
          style={styles.search}
          value={search}
          onChangeText={setSearch}
          placeholder="Search name or email"
          placeholderTextColor="#929AAA"
          autoCapitalize="none"
          returnKeyType="search"
        />
        {search.length > 0 && (
          <TouchableOpacity
            onPress={() => setSearch('')}
            accessibilityLabel="Clear search">
            <Ionicons name="close-circle" size={19} color={COLORS.muted} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.filterSection}>
        <Text style={styles.sectionLabel}>EMAIL STATUS</Text>
        <View style={styles.filters}>
          {filters.map(option => {
            const active = status === option.value;

            return (
              <TouchableOpacity
                key={option.value || 'all'}
                onPress={() => setStatus(option.value)}
                style={[styles.filterButton, active && styles.activeFilter]}>
                <Text
                  style={[
                    styles.filterText,
                    active && styles.activeFilterText,
                  ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.listHeading}>
        <Text style={styles.listTitle}>Registered users</Text>
        <Text style={styles.listSubtitle}>
          Page {page} of {totalPages}
        </Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.muted}>Loading users...</Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Ionicons
            name="alert-circle-outline"
            size={36}
            color={COLORS.red}
          />
          <Text style={styles.errorTitle}>{error}</Text>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => {
              setLoading(true);
              fetchUsers(page);
            }}>
            <Text style={styles.primaryButtonText}>Try again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={users}
            keyExtractor={item => String(item.id)}
            renderItem={renderUser}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={COLORS.primary}
                colors={[COLORS.primary]}
              />
            }
            contentContainerStyle={[
              styles.listContent,
              users.length === 0 && styles.emptyList,
            ]}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Ionicons
                  name="people-outline"
                  size={38}
                  color="#A0A8B8"
                />
                <Text style={styles.emptyTitle}>No users found</Text>
                <Text style={styles.muted}>
                  Try changing your search or filter.
                </Text>
              </View>
            }
          />

          <View style={styles.pagination}>
            <TouchableOpacity
              disabled={page <= 1}
              style={[
                styles.pageButton,
                page <= 1 && styles.disabledButton,
              ]}
              onPress={() => {
                setLoading(true);
                fetchUsers(page - 1);
              }}>
              <Ionicons
                name="chevron-back"
                size={16}
                color={page <= 1 ? '#A0A7B5' : COLORS.primary}
              />
              <Text
                style={[
                  styles.pageButtonText,
                  page <= 1 && styles.disabledPageText,
                ]}>
                Previous
              </Text>
            </TouchableOpacity>

            <Text style={styles.pageLabel}>
              {page} / {totalPages}
            </Text>

            <TouchableOpacity
              disabled={page >= totalPages}
              style={[
                styles.pageButton,
                page >= totalPages && styles.disabledButton,
              ]}
              onPress={() => {
                setLoading(true);
                fetchUsers(page + 1);
              }}>
              <Text
                style={[
                  styles.pageButtonText,
                  page >= totalPages && styles.disabledPageText,
                ]}>
                Next
              </Text>
              <Ionicons
                name="chevron-forward"
                size={16}
                color={page >= totalPages ? '#A0A7B5' : COLORS.primary}
              />
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
    paddingBottom: 22,
  },
  headerText: {flex: 1},
  eyebrow: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.4,
    marginBottom: 6,
  },
  title: {
    fontSize: 29,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.7,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.muted,
    marginTop: 5,
  },
  backIconButton: {
    width: 43,
    height: 43,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  searchContainer: {
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    marginBottom: 21,
  },
  search: {
    flex: 1,
    color: COLORS.text,
    fontSize: 14,
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  filterSection: {marginBottom: 22},
  sectionLabel: {
    fontSize: 10,
    color: COLORS.muted,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 10,
  },
  filters: {flexDirection: 'row', gap: 8},
  filterButton: {
    paddingVertical: 10,
    paddingHorizontal: 13,
    borderRadius: 11,
    backgroundColor: '#EEF0F5',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  activeFilter: {
    backgroundColor: COLORS.primaryLight,
    borderColor: '#D9DDFB',
  },
  filterText: {
    color: '#596276',
    fontSize: 12,
    fontWeight: '600',
  },
  activeFilterText: {color: COLORS.primary, fontWeight: '800'},
  listHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
  },
  listSubtitle: {fontSize: 12, color: COLORS.muted},
  listContent: {paddingBottom: 8, flexGrow: 1},
  userCard: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 15,
    marginBottom: 11,
  },
  userTopRow: {flexDirection: 'row', alignItems: 'center'},
  avatar: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.primary,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 14,
  },
  userInfo: {flex: 1, paddingRight: 7},
  userName: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.text,
  },
  email: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 5,
    lineHeight: 17,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginLeft: 2,
  },
  verifiedBadge: {backgroundColor: COLORS.greenBg},
  unverifiedBadge: {backgroundColor: COLORS.orangeBg},
  statusDot: {width: 6, height: 6, borderRadius: 3, marginRight: 5},
  statusText: {fontSize: 10, fontWeight: '800'},
  cardDivider: {
    height: 1,
    backgroundColor: '#F0F1F5',
    marginVertical: 13,
  },
  userFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metaItem: {flexDirection: 'row', alignItems: 'center', gap: 6},
  metaText: {
    fontSize: 11,
    color: '#626D81',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  userId: {fontSize: 11, color: '#929AAA', fontWeight: '600'},
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    paddingBottom: 14,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  pageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingVertical: 10,
    paddingHorizontal: 9,
    borderRadius: 10,
    backgroundColor: COLORS.primaryLight,
  },
  disabledButton: {backgroundColor: '#F0F1F5'},
  pageButtonText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  disabledPageText: {color: '#A0A7B5'},
  pageLabel: {color: COLORS.muted, fontSize: 12, fontWeight: '700'},
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  muted: {
    fontSize: 13,
    color: COLORS.muted,
    marginTop: 7,
    textAlign: 'center',
    lineHeight: 19,
  },
  errorTitle: {
    fontSize: 15,
    color: COLORS.red,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 12,
  },
  accessIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#FDECEC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 11,
    marginTop: 18,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  emptyList: {flexGrow: 1, justifyContent: 'center'},
  emptyState: {alignItems: 'center', paddingVertical: 35},
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 12,
  },
  membershipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 13,
  },
  membershipInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  membershipLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.muted,
  },
  membershipBadge: {
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#EEF0F5',
  },
  membershipText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#626D81',
  },
  goldBadge: {
    backgroundColor: '#FFF3DB',
  },
  goldText: {
    color: '#A15C07',
  },
  silverBadge: {
    backgroundColor: '#DCEBFF',
  },
  silverText: {
    color: '#1D4ED8',
  },
});

export default AdminUsersScreen;

