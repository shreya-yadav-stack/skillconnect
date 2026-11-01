
import React from 'react';
import {
  ScrollView,
  StatusBar,
  Text,
  View,
  Pressable,
  StyleSheet,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Ionicons} from '@react-native-vector-icons/ionicons';
import {useDispatch} from 'react-redux';
import {addToCart} from '../../redux/cartSlice';

const ProductDetailsScreen = ({navigation, route}) => {
  const product = route?.params?.product || {};
  const dispatch = useDispatch();

const handleAddToCart = () => {
  dispatch(addToCart(product));
  navigation.navigate('Cart');
};

  const title = product.title || 'Product details';
  const category = product.category || 'Learning';
  const creator = product.creator || 'SkillConnect';
  const rating = product.rating ?? '4.8';
  const level = product.level || 'All levels';
  const price = product.price ?? 'Price unavailable';
  const iconName = product.icon || 'book-outline';
  const description =
    product.description ||
    `Explore ${title} and discover learning opportunities designed to help you develop your professional skills.`;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F7FB" />

      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color="#172033" />
        </Pressable>

        <Text style={styles.headerTitle}>PRODUCT DETAILS</Text>

        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <View style={styles.productIcon}>
            <Ionicons name={iconName} size={42} color="#4568E8" />
          </View>

          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{category}</Text>
          </View>

          <Text style={styles.productTitle}>{title}</Text>
          <Text style={styles.creatorText}>Provided by {creator}</Text>

          <View style={styles.metadataRow}>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color="#E9A23B" />
              <Text style={styles.ratingText}>{rating}</Text>
            </View>

            <View style={styles.metadataDivider} />

            <Ionicons name="school-outline" size={17} color="#667085" />
            <Text style={styles.levelText}>{level}</Text>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>About this product</Text>
          <Text style={styles.description}>{description}</Text>
        </View>

        <View style={styles.priceCard}>
          <View style={styles.priceInfo}>
            <Text style={styles.priceLabel}>PRICE</Text>
            <Text style={styles.priceValue}>{String(price)}</Text>
          </View>

          <View style={styles.priceIcon}>
            <Ionicons name="pricetag-outline" size={22} color="#4568E8" />
          </View>
        </View>

        <Pressable
  accessibilityRole="button"
  style={styles.exploreButton}
  onPress={handleAddToCart}>
  <Text style={styles.exploreButtonText}>Add to Cart</Text>
  <Ionicons name="cart-outline" size={18} color="#FFFFFF" />
</Pressable>

        <Text style={styles.footerText}>
          SkillConnect · Build your professional skills
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FB',
  },
  header: {
    minHeight: 60,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: '#667085',
  },
  headerSpacer: {
    width: 42,
  },
  content: {
    padding: 20,
    paddingBottom: 32,
  },
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 24,
    alignItems: 'center',
    marginBottom: 18,
  },
  productIcon: {
    width: 88,
    height: 88,
    borderRadius: 24,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  categoryBadge: {
    backgroundColor: '#EEF2FF',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 14,
  },
  categoryText: {
    color: '#4568E8',
    fontSize: 12,
    fontWeight: '700',
  },
  productTitle: {
    fontSize: 23,
    lineHeight: 30,
    fontWeight: '700',
    color: '#172033',
    textAlign: 'center',
  },
  creatorText: {
    color: '#667085',
    fontSize: 14,
    marginTop: 9,
  },
  metadataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    gap: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#172033',
  },
  metadataDivider: {
    width: 1,
    height: 18,
    backgroundColor: '#E4E7EC',
    marginHorizontal: 3,
  },
  levelText: {
    fontSize: 13,
    color: '#667085',
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#172033',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    lineHeight: 23,
    color: '#667085',
  },
  priceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 22,
  },
  priceInfo: {
    gap: 6,
  },
  priceLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    color: '#98A2B3',
  },
  priceValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#172033',
  },
  priceIcon: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  exploreButton: {
    minHeight: 54,
    backgroundColor: '#4568E8',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  exploreButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  footerText: {
    textAlign: 'center',
    marginTop: 24,
    fontSize: 12,
    color: '#98A2B3',
  },
});

export default ProductDetailsScreen;