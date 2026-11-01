import React, {useState} from 'react';

import {
  Alert,
  Pressable,
  StatusBar,
  Text,
  TextInput,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Ionicons} from '@react-native-vector-icons/ionicons';

import api from '../../../services/api';
import CustomButton from '../../../components/CustomButton';

import styles from './ResetPasswordScreen.style';

const ResetPasswordScreen = ({navigation, route}) => {
  const token = route.params?.token;

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!password) {
      setError('Password is required');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (!confirmPassword) {
      setError('Please confirm your password');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!token) {
      setError('Invalid or missing reset token');
      return;
    }

    setError('');
    setIsLoading(true);

    console.log('RESET TOKEN FROM APP:', token);

    try {
      const response = await api.post(
        '/api/auth/reset-password',
        {
          token,
          newPassword: password,
        },
      );

      Alert.alert(
        'Password Reset',
        response.data.message,
        [
          {
            text: 'Login',
            onPress: () => navigation.navigate('Login'),
          },
        ],
      );
    } catch (requestError) {
        console.log(
            'RESET PASSWORD ERROR:',
            error.response?.data,
          );

      setError(
        error.response?.data?.message ||
          'Something went wrong',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#F3F6FF"
      />

      <View style={styles.content}>

        <Pressable
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Ionicons
            name="arrow-back-outline"
            size={24}
            color="#172A50"
          />
        </Pressable>

        <View style={styles.header}>
          <Text style={styles.title}>
            Reset Password
          </Text>

          <Text style={styles.subtitle}>
            Create a new password for your Skill Connect
            account.
          </Text>
        </View>

        <View style={styles.card}>

          {/* New Password */}

          <Text style={styles.label}>
            New Password
          </Text>

          <View style={styles.inputContainer}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color="#344466"
              style={styles.inputIcon}
            />

            <TextInput
              style={styles.input}
              placeholder="Enter new password"
              placeholderTextColor="#9AA7C5"
              value={password}
              onChangeText={text => {
                setPassword(text);
                setError('');
              }}
              secureTextEntry={!showPassword}
            />

            <Pressable
              style={styles.eyeButton}
              onPress={() =>
                setShowPassword(!showPassword)
              }>
              <Ionicons
                name={
                  showPassword
                    ? 'eye-outline'
                    : 'eye-off-outline'
                }
                size={20}
                color="#344466"
              />
            </Pressable>
          </View>

          {/* Confirm Password */}

          <Text style={styles.label}>
            Confirm Password
          </Text>

          <View style={styles.inputContainer}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color="#344466"
              style={styles.inputIcon}
            />

            <TextInput
              style={styles.input}
              placeholder="Confirm new password"
              placeholderTextColor="#9AA7C5"
              value={confirmPassword}
              onChangeText={text => {
                setConfirmPassword(text);
                setError('');
              }}
              secureTextEntry={!showConfirmPassword}
            />

            <Pressable
              style={styles.eyeButton}
              onPress={() =>
                setShowConfirmPassword(
                  !showConfirmPassword,
                )
              }>
              <Ionicons
                name={
                  showConfirmPassword
                    ? 'eye-outline'
                    : 'eye-off-outline'
                }
                size={20}
                color="#344466"
              />
            </Pressable>
          </View>

          {error ? (
            <Text style={styles.error}>
              {error}
            </Text>
          ) : null}

          <CustomButton
            title={
              isLoading
                ? 'Resetting...'
                : 'Reset Password'
            }
            onPress={handleResetPassword}
            disabled={isLoading}
          />

        </View>
      </View>
    </SafeAreaView>
  );
};

export default ResetPasswordScreen;