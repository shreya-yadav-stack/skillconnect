import React, {useState} from 'react';
import { useDispatch, useSelector} from 'react-redux';
import CustomButton from '../../../components/CustomButton';
import {
  Alert,
  Pressable,
  Image,
  Text,
  TextInput,
  View,
  ScrollView,
  StatusBar,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import styles from './LoginScreenStyle';
import api from '../../../services/api'
import AsyncStorage from '@react-native-async-storage/async-storage';
import {setAuth} from '../../../redux/authSlice'
import {Ionicons} from '@react-native-vector-icons/ionicons';
import {authenticateWithGoogle} from '../../../services/googleAuth';

const LoginScreen = ({navigation}) => {

  const dispatch =useDispatch();

  const auth = useSelector(state => state.auth);
  console.log('REDUX AUTH STATE:', auth);


  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState({});



  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!email.includes('@')) {
      newErrors.email = 'Enter a valid email';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    try {
      const response = await api.post('/api/auth/login', {
        email,
        password,
      });


      await AsyncStorage.setItem('token', response.data.token);

      dispatch(
        setAuth({
          user: response.data.user,
          token: response.data.token,
        }),
      );



      Alert.alert('Login', response.data.message);
    } catch (error) {
      console.log('LOGIN ERROR:', error);
      console.log('LOGIN ERROR MESSAGE:', error.message);
      console.log('LOGIN ERROR RESPONSE:', error.response?.data);

      Alert.alert(
        'Login',
        error.response?.data?.message || 'Something went wrong',
      );
    }
  };
  const handleGoogleLogin = async () => {
    try {
      const result = await authenticateWithGoogle('login');
      // The user cancelled Google sign-in.
      if (!result) {
        return;
      }

      await AsyncStorage.setItem('token', result.token);

      dispatch(
        setAuth({
          user: result.user,
          token: result.token,
        }),
      );

      Alert.alert('Google Login', result.message);
    } catch (error) {
      console.log(
        'GOOGLE LOGIN ERROR:',
        error.response?.data || error.message,
      );

      Alert.alert(
        'Google Login',
        error.response?.data?.message ||
          error.message ||
          'Google login failed. Please try again.',
      );
    }
  };



  return (
    <>
  <StatusBar
      barStyle="dark-content"
      backgroundColor="#F3F6FF"
    />

    <SafeAreaView style={styles.container}>
      <ScrollView
         showsVerticalScrollIndicator={false}
         contentContainerStyle={styles.scrollContent}>

      <View style={styles.screenContent}>

        {/* Header / Logo */}
        <View style={styles.logoSection}>
  <Image
    source={require('../../../assets/image.png')}
    style={styles.logoImage}
    resizeMode="contain"
  />
</View>
        {/* Welcome Section */}


        {/* Login Card */}
        <View style={styles.loginCard}>

          {/* Email */}
          <Text style={styles.label}>
            Email or Phone Number
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
              placeholder="Enter your email or phone number"
              placeholderTextColor="#9AAAD0"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {errors.email ? (
            <Text style={styles.error}>
              {errors.email}
            </Text>
          ) : null}

          {/* Password */}
          <Text style={styles.label}>
            Password
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
              placeholder="Enter your password"
              placeholderTextColor="#9AAAD0"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />

            <Pressable
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeButton}>
             <Ionicons
  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
  size={22}
  color="#344466"
/>
            </Pressable>
          </View>

          {errors.password ? (
            <Text style={styles.error}>
              {errors.password}
            </Text>
          ) : null}

          {/* Remember + Forgot */}
          <View style={styles.optionsRow}>

            <Pressable style={styles.rememberContainer}>
              <View style={styles.checkbox}>
                <Text style={styles.checkmark}>✓</Text>
              </View>

              <Text style={styles.rememberText}>
                Remember me
              </Text>
            </Pressable>
            <Pressable
          onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.forgotText}>
              Forgot Password?
              </Text>
            </Pressable>

          </View>

          {/* Login Button */}
          <View style={styles.buttonContainer}>
            <CustomButton
              title="Log In"
              onPress={handleLogin}
            />
          </View>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.divider} />

            <Text style={styles.orText}>
              Or continue with
            </Text>

            <View style={styles.divider} />
          </View>

          {/* Social Buttons */}
          <View style={styles.socialRow}>

            <Pressable
              style={styles.socialButton}
              onPress={handleGoogleLogin}>
<Text style={styles.googleIcon}>G</Text>
              <Text style={styles.socialText}>
                Google
              </Text>
            </Pressable>

          </View>

          {/* Signup */}
          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>
              Don't have an account?
            </Text>

            <Pressable
              onPress={() => navigation.navigate('Signup')}>
              <Text style={styles.signupLink}>
                Sign Up
              </Text>
            </Pressable>
          </View>

        </View>
      </View>
      </ScrollView>

    </SafeAreaView>
    </>
  );
};


export default LoginScreen;

