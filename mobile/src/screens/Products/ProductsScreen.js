import React, {useMemo, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Ionicons} from '@react-native-vector-icons/ionicons';

const COLORS = {
  background: '#F8F9FC',
  surface: '#FFFFFF',
  primary: '#4655A5',
  primaryLight: '#EEF0FF',
  text: '#202938',
  muted: '#788195',
  border: '#E6E9F0',
};

const PRODUCTS = [
  {
    id: '1',
    title: 'UI/UX Design Fundamentals',
    category: 'Design',
    creator: 'Design Studio',
    price: '₹499',
    icon: 'color-palette-outline',
    color: '#EEEAFE',
    iconColor: '#7661C8',
    rating: '4.8',
    level: 'Beginner',
  },
  {
    id: '2',
    title: 'React Native Development',
    category: 'Technology',
    creator: 'Code Academy',
    price: '₹799',
    icon: 'phone-portrait-outline',
    color: '#E3F3FF',
    iconColor: '#2379B8',
    rating: '4.9',
    level: 'Intermediate',
  },
  {
    id: '3',
    title: 'Digital Marketing Basics',
    category: 'Marketing',
    creator: 'Growth Lab',
    price: '₹399',
    icon: 'trending-up-outline',
    color: '#E3F7ED',
    iconColor: '#25845A',
    rating: '4.7',
    level: 'Beginner',
  },
  {
    id: '4',
    title: 'Professional Photography',
    category: 'Design',
    creator: 'Creative Hub',
    price: '₹599',
    icon: 'camera-outline',
    color: '#FFF0DF',
    iconColor: '#C27A25',
    rating: '4.6',
    level: 'All levels',
  },
  {
    id: '5',
    title: 'Business Communication',
    category: 'Business',
    creator: 'Career Studio',
    price: '₹299',
    icon: 'chatbubbles-outline',
    color: '#FCE8ED',
    iconColor: '#B94D70',
    rating: '4.8',
    level: 'Beginner',
  },
  {
    id: '6',
    title: 'Python Programming',
    category: 'Technology',
    creator: 'Code Academy',
    price: '₹699',
    icon: 'code-slash-outline',
    color: '#E4EDFF',
    iconColor: '#4169B1',
    rating: '4.9',
    level: 'Beginner',
  },
];

const CATEGORIES = [
  'All',
  'Technology',
  'Design',
  'Marketing',
  'Business',
];

const ProductsScreen = ({navigation}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return PRODUCTS.filter(product => {
      const matchesCategory =
        selectedCategory === 'All' ||
        product.category === selectedCategory;

      const matchesSearch =
        !query ||
        product.title.toLowerCase().includes(query) ||
        product.creator.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [search, selectedCategory]);

  const renderProduct = ({item}) => (
    <View style={styles.productCard}>
      <View style={[styles.productArtwork, {backgroundColor: item.color}]}>
        <View style={styles.artworkIcon}>
          <Ionicons
            name={item.icon}
            size={34}
            color={item.iconColor}
          />
        </View>

        <View style={styles.ratingBadge}>
          <Ionicons name="star" size={11} color="#E6A23C" />
          <Text style={styles.ratingText}>{item.rating}</Text>
        </View>
      </View>

      <View style={styles.productInfo}>
        <Text style={styles.categoryText}>{item.category}</Text>

        <Text style={styles.productTitle} numberOfLines={2}>
          {item.title}
        </Text>

        <Text style={styles.creatorText} numberOfLines={1}>
          {item.creator}
        </Text>

        <View style={styles.levelBadge}>
          <Text style={styles.levelText}>{item.level}</Text>
        </View>

        <View style={styles.cardFooter}>
          <Text style={styles.price}>{item.price}</Text>

          <TouchableOpacity
            style={styles.detailsButton}
            onPress={() =>
              navigation.navigate('ProductDetails', {product: item})
            }
            accessibilityLabel={`View details for ${item.title}`}>
            <Ionicons
              name="arrow-forward"
              size={17}
              color={COLORS.primary}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>DISCOVER</Text>
          <Text style={styles.title}>Explore products</Text>
          <Text style={styles.subtitle}>
            Learn something new and grow your skills.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.navigate('Dashboard')}
          accessibilityLabel="Back to dashboard">
          <Ionicons
            name="arrow-back-outline"
            size={21}
            color={COLORS.text}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color={COLORS.muted} />

        <TextInput
          style={styles.searchInput}
          placeholder="Search courses and products"
          placeholderTextColor="#929AAA"
          value={search}
          onChangeText={setSearch}
          autoCapitalize="none"
          returnKeyType="search"
        />

        {search.length > 0 && (
          <TouchableOpacity
            onPress={() => setSearch('')}
            accessibilityLabel="Clear search">
            <Ionicons
              name="close-circle"
              size={19}
              color={COLORS.muted}
            />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Categories</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
        contentContainerStyle={styles.categoryList}>
        {CATEGORIES.map(category => {
          const active = selectedCategory === category;

          return (
            <TouchableOpacity
              key={category}
              onPress={() => setSelectedCategory(category)}
              style={[
                styles.categoryChip,
                active && styles.activeCategoryChip,
              ]}>
              <Text
                style={[
                  styles.categoryChipText,
                  active && styles.activeCategoryChipText,
                ]}>
                {category}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recommended for you</Text>
        <Text style={styles.resultCount}>
          {filteredProducts.length} items
        </Text>
      </View>

      <FlatList
        data={filteredProducts}
        keyExtractor={item => item.id}
        renderItem={renderProduct}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={styles.productRow}
        contentContainerStyle={styles.productList}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons
              name="search-outline"
              size={38}
              color="#A0A8B8"
            />
            <Text style={styles.emptyTitle}>No products found</Text>
            <Text style={styles.emptyText}>
              Try another search or category.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 18,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 20,
  },
  eyebrow: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.4,
    marginBottom: 5,
  },
  title: {
    color: COLORS.text,
    fontSize: 25,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitle: {
    color: COLORS.muted,
    fontSize: 12,
    marginTop: 6,
  },
  headerButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  searchContainer: {
    minHeight: 49,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 13,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 13,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    color: COLORS.text,
    fontSize: 13,
    paddingHorizontal: 9,
    paddingVertical: 11,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 11,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '800',
  },
  categoryScroll: {
    flexGrow: 0,
    marginBottom: 22,
  },
  categoryList: {
    gap: 8,
    paddingRight: 5,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: '#EEF0F5',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  activeCategoryChip: {
    backgroundColor: COLORS.primaryLight,
    borderColor: '#D9DDFB',
  },
  categoryChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#596276',
  },
  activeCategoryChipText: {
    color: COLORS.primary,
    fontWeight: '800',
  },
  resultCount: {
    color: COLORS.muted,
    fontSize: 11,
    fontWeight: '600',
  },
  productList: {
    paddingBottom: 22,
  },
  productRow: {
    justifyContent: 'space-between',
  },
  productCard: {
    width: '48.3%',
    backgroundColor: COLORS.surface,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    marginBottom: 13,
  },
  productArtwork: {
    height: 112,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  artworkIcon: {
    width: 66,
    height: 66,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratingBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#FFFFFF',
    borderRadius: 7,
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  ratingText: {
    color: COLORS.text,
    fontSize: 10,
    fontWeight: '800',
  },
  productInfo: {
    padding: 11,
  },
  categoryText: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: '800',
    marginBottom: 6,
  },
  productTitle: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 18,
    minHeight: 36,
  },
  creatorText: {
    color: COLORS.muted,
    fontSize: 10,
    marginTop: 5,
  },
  levelBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#F1F3F7',
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 9,
  },
  levelText: {
    color: '#626D81',
    fontSize: 9,
    fontWeight: '700',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 9,
    borderTopWidth: 1,
    borderTopColor: '#F0F1F5',
  },
  price: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '800',
  },
  detailsButton: {
    width: 31,
    height: 31,
    borderRadius: 10,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 45,
    paddingHorizontal: 15,
  },
  emptyTitle: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '800',
    marginTop: 12,
  },
  emptyText: {
    color: COLORS.muted,
    fontSize: 12,
    marginTop: 6,
    textAlign: 'center',
  },
});

export default ProductsScreen;

