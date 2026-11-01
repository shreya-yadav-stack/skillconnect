
import {configureStore} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

import authReducer from './authSlice';
import cartReducer from './cartSlice';
import usersReducer from './usersSlice';

const CART_STORAGE_KEY = 'skillconnect_cart';

const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    users: usersReducer,
  },
});

let previousCart = store.getState().cart;

store.subscribe(() => {
  const currentCart = store.getState().cart;

  if (currentCart !== previousCart) {
    previousCart = currentCart;

    AsyncStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify(currentCart),
    ).catch(error => {
      console.warn('Unable to save cart:', error);
    });
  }
});

export const loadSavedCart = async () => {
  try {
    const savedCart = await AsyncStorage.getItem(CART_STORAGE_KEY);

    if (savedCart) {
      store.dispatch({
        type: 'cart/restoreCart',
        payload: JSON.parse(savedCart),
      });
    }
  } catch (error) {
    console.warn('Unable to restore cart:', error);
  }
};

export default store;
