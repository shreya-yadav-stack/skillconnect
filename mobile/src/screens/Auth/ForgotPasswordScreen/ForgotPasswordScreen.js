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

import styles from './ForgotPasswordScreen.style';

const ForgotPasswordScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    if (!email.includes('@')) {
      setError('Enter a valid email');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const response = await api.post('/api/auth/forgot-password', {
        email: email.trim(),
      });

      Alert.alert(
        'Check Your Email',
        response.data.message,
        [
          {
            text: 'OK',
            onPress: () =>
              navigation.navigate('ResetPassword', {
                token:'7c4f306be5c8c193d71c55304f92bf6d45ced56d8adee4644128ee6364b2f067'
                ,

              }),
          },
        ],
      );

    } catch (requestError) {
      console.log('FORGOT PASSWORD ERROR:', error);

      Alert.alert(
        'Forgot Password',
        error.response?.data?.message || 'Something went wrong',
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

        {/* Back Button */}
        <Pressable
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Ionicons
            name="arrow-back-outline"
            size={24}
            color="#172A50"
          />
        </Pressable>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>
            Forgot Password?
          </Text>

          <Text style={styles.subtitle}>
            Enter your email address and we'll send you a
            password reset link.
          </Text>
        </View>

        {/* Form */}
        <View style={styles.card}>

          <Text style={styles.label}>
            Email
          </Text>

          <View style={styles.inputContainer}>
            <Ionicons
              name="mail-outline"
              size={20}
              color="#344466"
              style={styles.inputIcon}
            />

            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#9AA7C5"
              value={email}
              onChangeText={text => {
                setEmail(text);

                if (error) {
                  setError('');
                }
              }}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {error ? (
            <Text style={styles.error}>
              {error}
            </Text>
          ) : null}

          <CustomButton
            title={
              isLoading
                ? 'Sending...'
                : 'Send Reset Link'
            }
            onPress={handleForgotPassword}
            disabled={isLoading}
          />

          <Pressable
            style={styles.loginButton}
            onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginText}>
              Remember your password?{' '}
              <Text style={styles.loginLink}>
                Login
              </Text>
            </Text>
          </Pressable>

        </View>
      </View>
    </SafeAreaView>
  );
};

export default ForgotPasswordScreen;