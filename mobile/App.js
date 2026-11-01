import React, {useEffect, useState,useRef} from 'react';

import {Alert, Linking} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {Provider, useDispatch, useSelector} from 'react-redux';

import {initializeAuth} from './src/redux/authSlice';
import AppNavigator from './src/navigation/AppNavigator';
import store, {loadSavedCart} from './src/redux/store';
import {capturePayment} from './src/services/api';

const AppContent = () => {
  const dispatch = useDispatch();
  const loading = useSelector(state => state.auth.loading);
  const isAuthenticated = useSelector(
    state => state.auth.isAuthenticated,
  );

  const [cartLoaded, setCartLoaded] = useState(false);
  const handledUrls = useRef(new Set());

  useEffect(() => {
    const initializeApp = async () => {
      await loadSavedCart();
      dispatch(initializeAuth());
      setCartLoaded(true);
    };

    initializeApp();
  }, [dispatch]);

  useEffect(() => {
    if (loading || !cartLoaded || !isAuthenticated) {
      return undefined;
    }

    let mounted = true;

    const handlePayPalUrl = async url => {
      console.log('PAYPAL DEEP LINK RECEIVED:', url);
      if (!url || handledUrls.current.has(url)) {
        console.log('PAYPAL DEEP LINK IGNORED:', url);
        return;
      }

      if (url.startsWith('skillconnect://paypal-cancel')) {
        console.log('PAYPAL CANCEL HANDLER REACHED');
        handledUrls.current.add(url);

        Alert.alert(
          'Payment cancelled',
          'Your membership has not been activated. You can try again anytime.',
        );
        return;
      }

      if (!url.startsWith('skillconnect://paypal-return')) {
        return;
      }

      const orderId = new URLSearchParams(url.split('?')[1] || '')
        .get('orderId');

      if (!orderId) {
        Alert.alert(
          'Payment error',
          'The PayPal return link did not include an order ID.',
        );
        return;
      }

      handledUrls.current.add(url);

      try {
        const response = await capturePayment(orderId);

        if (!mounted) {
          return;
        }

        Alert.alert(
          'Payment successful',
          response.message ||
            'Your membership has been activated successfully.',
        );
      } catch (error) {
        if (!mounted) {
          return;
        }

        console.error(
          'PAYPAL RETURN ERROR:',
          error.response?.data || error.message,
        );

        Alert.alert(
          'Payment verification failed',
          error.response?.data?.message ||
            'We could not verify the payment. Please open Plans and check your membership status.',
        );
      }
    };

    const subscription = Linking.addEventListener('url', event => {
      handlePayPalUrl(event.url);
    });

    Linking.getInitialURL()
      .then(handlePayPalUrl)
      .catch(error => {
        console.error('INITIAL LINK ERROR:', error.message);
      });

    return () => {
      mounted = false;
      subscription.remove();
    };
  }, [loading, cartLoaded, isAuthenticated]);

  if (loading || !cartLoaded) {
    return null;
  }

  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

export default App;
