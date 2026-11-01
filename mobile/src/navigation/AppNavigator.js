import React from 'react';
import {Platform} from 'react-native';
import {useSelector} from 'react-redux';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import LoginScreen from '../screens/Auth/LoginScreen/LoginScreen';
import SignupScreen from '../screens/Auth/SignupScreen/SignupScreen';
import DashboardScreen from '../screens/Dashboard/DashboardScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import ForgotPasswordScreen from '../screens/Auth/ForgotPasswordScreen/ForgotPasswordScreen';
import ResetPasswordScreen from '../screens/Auth/ResetPasswordScreen/ResetPasswordScreen';
import EditProfileScreen from '../screens/Profile/EditProfileScreen/EditProfileScreen';
import PlansScreen from '../screens/Plans/PlansScreen';
import AdminUsersScreen from '../screens/Admin/AdminUsersScreen';
import ProductsScreen from '../screens/Products/ProductsScreen';
import ProductDetailsScreen from '../screens/Products/ProductDetailsScreen';
import CartScreen from '../screens/Products/CartScreen';
import DiscoverProfessionalsScreen from '../screens/Professionals/DiscoverProfessionalsScreen';
const Stack = createNativeStackNavigator();

const linking = {
  prefixes: ['skillconnect://'],
  config: {
    screens: {
      ResetPassword: 'reset-password',
    },
  },
};

const AppNavigator = () => {
  const isAuthenticated = useSelector(
    state => state.auth.isAuthenticated,
  );

  return (
    <Stack.Navigator
      linking={linking}
      screenOptions={{
        headerShown: false,

        ...(Platform.OS === 'android' && {
          animation: 'slide_from_right',
        }),
      }}>
      {isAuthenticated ? (
        <>
        <Stack.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
  name="EditProfile"
  component={EditProfileScreen}
  options={{headerShown: false}}
/>
<Stack.Screen
  name="Plans"
  component={PlansScreen}
  options={{headerShown: false}}
/>
<Stack.Screen
  name="AdminUsers"
  component={AdminUsersScreen}
  options={{headerShown: false}}
/>
<Stack.Screen
  name="Products"
  component={ProductsScreen}
  options={{headerShown: false}}
/>
<Stack.Screen
  name="ProductDetails"
  component={ProductDetailsScreen}
  options={{headerShown: false}}
/>
<Stack.Screen
  name="Cart"
  component={CartScreen}
  options={{headerShown: false}}
/>
<Stack.Screen
  name="DiscoverProfessionals"
  component={DiscoverProfessionalsScreen}
  options={{headerShown: false}}
/>
        </>
      ) : (
        <>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{headerShown: false}}
          />

          <Stack.Screen
            name="Signup"
            component={SignupScreen}
            options={{headerShown: false}}
          />

          <Stack.Screen
            name="ForgotPassword"
            component={ForgotPasswordScreen}
            options={{headerShown: false}}
          />

          <Stack.Screen
            name="ResetPassword"
            component={ResetPasswordScreen}
            options={{headerShown: false}}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;