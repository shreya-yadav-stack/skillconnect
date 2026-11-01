
import React from 'react';
import {
  StatusBar,
  Text,
  View,
  FlatList,
  Pressable,
  StyleSheet,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import {Ionicons} from '@react-native-vector-icons/ionicons';
import {removeFromCart, clearCart} from '../../redux/cartSlice';

const CartScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const items = useSelector(state => state.cart.items);

  const totalItems = items.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const totalPrice = items.reduce((total, item) => {
    const price = Number(
      String(item.price ?? 0).replace(/[^0-9.]/g, ''),
    );
    return total + price * item.quantity;
  }, 0);

  const renderItem = ({item}) => (
    <View style={styles.productCard}>
      <View style={styles.productIcon}>
        <Ionicons name="book-outline" size={25} color="#4568E8" />
      </View>

      <View style={styles.productInfo}>
        <Text style={styles.productTitle} numberOfLines={2}>
          {item.title || 'Product'}
        </Text>
        <Text style={styles.productCategory}>
          {item.category || 'Learning'}
        </Text>
        <Text style={styles.productPrice}>
          {String(item.price ?? 'Price unavailable')}
        </Text>
        <Text style={styles.quantity}>Quantity: {item.quantity}</Text>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Remove ${item.title || 'product'}`}
        style={styles.removeButton}
        onPress={() => dispatch(removeFromCart(item.id))}>
        <Ionicons name="trash-outline" size={20} color="#D64545" />
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F7FB" />

      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color="#172033" />
        </Pressable>

        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>My Cart</Text>
          <Text style={styles.headerSubtitle}>
            {totalItems} {totalItems === 1 ? 'item' : 'items'} selected
          </Text>
        </View>

        {items.length > 0 ? (
          <Pressable
            accessibilityRole="button"
            onPress={() => dispatch(clearCart())}>
            <Text style={styles.clearText}>Clear</Text>
          </Pressable>
        ) : (
          <View style={styles.headerSpacer} />
        )}
      </View>

      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIcon}>
            <Ionicons
              name="cart-outline"
              size={42}
              color="#4568E8"
            />
          </View>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySubtitle}>
            Explore the catalogue and add products you like.
          </Text>

          <Pressable
            accessibilityRole="button"
            style={styles.browseButton}
            onPress={() => navigation.navigate('Products')}>
            <Text style={styles.browseButtonText}>Browse catalogue</Text>
          </Pressable>
        </View>
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={(item, index) =>
              String(item.id ?? item.title ?? index)
            }
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />

          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total items</Text>
              <Text style={styles.summaryValue}>{totalItems}</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total price</Text>
              <Text style={styles.totalPrice}>
                {`₹${totalPrice.toLocaleString('en-IN')}`}
              </Text>
            </View>

            <Text style={styles.note}>
              Checkout and payment will be added later.
            </Text>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FB',
  },
  header: {
    minHeight: 76,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#172033',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#667085',
    marginTop: 3,
  },
  clearText: {
    color: '#D64545',
    fontSize: 14,
    fontWeight: '700',
    padding: 8,
  },
  headerSpacer: {
    width: 42,
  },
  listContent: {
    padding: 20,
    paddingBottom: 12,
  },
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 12,
  },
  productIcon: {
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  productInfo: {
    flex: 1,
  },
  productTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#172033',
  },
  productCategory: {
    fontSize: 12,
    color: '#667085',
    marginTop: 4,
  },
  productPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: '#4568E8',
    marginTop: 7,
  },
  quantity: {
    fontSize: 12,
    color: '#667085',
    marginTop: 4,
  },
  removeButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#FFF1F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyIcon: {
    width: 88,
    height: 88,
    borderRadius: 28,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
  },
  emptyTitle: {
    fontSize: 21,
    fontWeight: '700',
    color: '#172033',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#667085',
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 10,
    marginBottom: 22,
  },
  browseButton: {
    backgroundColor: '#4568E8',
    borderRadius: 14,
    paddingHorizontal: 22,
    paddingVertical: 15,
  },
  browseButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 22,
    paddingBottom: 26,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#667085',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#172033',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#172033',
  },
  totalPrice: {
    fontSize: 22,
    fontWeight: '700',
    color: '#4568E8',
  },
  note: {
    fontSize: 12,
    color: '#98A2B3',
    marginTop: 4,
  },
});

export default CartScreen;
