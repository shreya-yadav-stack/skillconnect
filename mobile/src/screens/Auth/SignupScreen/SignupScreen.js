import React,{useState} from 'react';
import CustomButton from '../../../components/CustomButton';
import {
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import styles from './SignupScreen.style';
import {Ionicons} from '@react-native-vector-icons/ionicons';
import api from '../../../services/api';
import {authenticateWithGoogle} from '../../../services/googleAuth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch} from 'react-redux';
import {setAuth} from '../../../redux/authSlice';
const SignupScreen = ({navigation}) => {
  const dispatch = useDispatch();
  // states
const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [confirmPassword, setConfirmPassword] = useState('');
const [errors, setErrors] = useState({});
const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);
const [acceptedTerms, setAcceptedTerms] = useState(false);
const [isLoading, setIsLoading] = useState(false);
const [showAccountExistsModal, setShowAccountExistsModal] =
  useState(false);

// validate form
const validateForm = () => {
  const newErrors = {};

  if (!name.trim()) {
    newErrors.name = 'Name is required';
  }

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

  if (!confirmPassword) {
    newErrors.confirmPassword = 'Please confirm your password';
  } else if (password !== confirmPassword) {
    newErrors.confirmPassword = 'Passwords do not match';
  }
  if (!acceptedTerms) {
    newErrors.terms =
      'Please accept the Terms & Conditions and Privacy Policy';
  }
  setErrors(newErrors);

  return Object.keys(newErrors).length === 0;
};
const handleSignup = async () => {
  const isValid = validateForm();

  if (!isValid) {
    return;

  }
  setIsLoading(true);

  try {
    const response = await api.post('/api/auth/signup', {
      name,
      email,
      password,
    });

    console.log('SIGNUP REQUEST:', {
      name,
      email,
    });

    console.log('API URL:', api.defaults.baseURL);
    console.log('SIGNUP RESPONSE:', response.data);

    Alert.alert(
      'Account Created',
      'Your account has been created successfully. Please check your email and verify your account before logging in.',
      [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Login'),
        },
      ],
    );
  } catch (error) {
    console.log('SIGNUP ERROR:', error);
    console.log('SIGNUP ERROR MESSAGE:', error.message);
    console.log('SIGNUP ERROR CODE:', error.code);
    console.log('SIGNUP ERROR RESPONSE:', error.response?.data);
    Alert.alert(
      'Signup',
      error.response?.data?.message || 'Something went wrong',
    );
  }

finally {
  setIsLoading(false);
}
};
const handleGoogleSignup = async () => {
  try {
    const result = await authenticateWithGoogle('signup');

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

    Alert.alert('Google Signup', result.message);
  } catch (error) {
    console.log(
      'GOOGLE SIGNUP ERROR:',
      error.response?.data || error.message,
    );

    if (error.response?.status === 409) {
      setShowAccountExistsModal(true);
      return;
    }

    Alert.alert(
      'Google Signup',
      error.response?.data?.message ||
        error.message ||
        'Google signup failed. Please try again.',
    );
  }
};
  return (

    <SafeAreaView style={styles.container}>
  <StatusBar
    barStyle="dark-content"
    backgroundColor="#F3F6FF"
  />

  <ScrollView
    showsVerticalScrollIndicator={false}
    contentContainerStyle={styles.scrollContent}>

    <View style={styles.screenContent}>
    {/* Welcome section */}
  {/* Welcome section */}
<View style={styles.welcomeSection}>
{/* Logo */}
<View style={styles.logoSection}>
  <Image
    source={require('../../../assets/image.png')}
    style={styles.logoImage}
    resizeMode="contain"
  />
</View>

  <Image
    source={require('../../../assets/image copy.png')}
    style={styles.illustration}
    resizeMode="contain"
  />
</View>

      {/* Signup card */}
      <View style={styles.signupCard}>

        {/*  form  */}


        <Text style={styles.label}>Full Name *</Text>

<View style={styles.inputContainer}>
  <Ionicons
    name="person-outline"
    size={20}
    color="#344466"
    style={styles.inputIcon}
  />

  <TextInput
    style={styles.input}
    placeholder="Enter your full name"
    placeholderTextColor="#9AA7C5"
    value={name}
    onChangeText={text => {
      setName(text);

      if (errors.name) {
        setErrors(prev => ({
          ...prev,
          name: '',
        }));
      }
    }}
  />
</View>

{errors.name ? (
  <Text style={styles.error}>{errors.name}</Text>
) : null}

<Text style={styles.label}>Email *</Text>

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

      if (errors.email) {
        setErrors(prev => ({
          ...prev,
          email: '',
        }));
      }
    }}
    keyboardType="email-address"
    autoCapitalize="none"
  />
</View>

{errors.email ? (
  <Text style={styles.error}>{errors.email}</Text>
) : null}
       <Text style={styles.label}>Password *</Text>

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
    placeholderTextColor="#9AA7C5"
    value={password}
    secureTextEntry={!showPassword}
    onChangeText={text => {
      setPassword(text);

      if (errors.password) {
        setErrors(prev => ({
          ...prev,
          password: '',
        }));
      }
    }}
  />

  <Pressable
    style={styles.eyeButton}
    onPress={() => setShowPassword(!showPassword)}>
    <Ionicons
      name={showPassword ? 'eye-outline' : 'eye-off-outline'}
      size={20}
      color="#344466"
    />
  </Pressable>
</View>

{errors.password ? (
  <Text style={styles.error}>{errors.password}</Text>
) : null}

<Text style={styles.label}>Confirm Password *</Text>

<View style={styles.inputContainer}>
  <Ionicons
    name="lock-closed-outline"
    size={20}
    color="#344466"
    style={styles.inputIcon}
  />

  <TextInput
    style={styles.input}
    placeholder="Confirm your password"
    placeholderTextColor="#9AA7C5"
    value={confirmPassword}
    secureTextEntry={!showConfirmPassword}
    onChangeText={text => {
      setConfirmPassword(text);

      if (errors.confirmPassword) {
        setErrors(prev => ({
          ...prev,
          confirmPassword: '',
        }));
      }
    }}
  />

  <Pressable
    style={styles.eyeButton}
    onPress={() =>
      setShowConfirmPassword(!showConfirmPassword)
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
{errors.confirmPassword ? (
  <Text style={styles.error}>
    {errors.confirmPassword}
  </Text>
) : null}
<View style={styles.termsContainer}>
  <Pressable
    style={[
      styles.checkbox,
      !acceptedTerms && styles.checkboxUnchecked,
    ]}
    onPress={() => {
      setAcceptedTerms(!acceptedTerms);

      if (errors.terms) {
        setErrors(prev => ({
          ...prev,
          terms: '',
        }));
      }
    }}>
    {acceptedTerms ? (
      <Text style={styles.checkmark}>✓</Text>
    ) : null}
  </Pressable>

  <Text style={styles.termsText}>
    I agree to the{' '}
    <Text style={styles.termsLink}>
      Terms & Conditions
    </Text>{' '}
    and{' '}
    <Text style={styles.termsLink}>
      Privacy Policy
    </Text>
  </Text>
</View>



{errors.terms ? (
  <Text style={styles.error}>
    {errors.terms}
  </Text>
) : null}

              <View style={styles.buttonContainer}>
            <CustomButton
  title={isLoading ? 'Creating Account...' : 'Create Account'}
  onPress={handleSignup}
  disabled={isLoading}
/>

             </View>


             <View style={styles.buttonContainer}>
  <Pressable
    style={styles.socialButton}
    onPress={handleGoogleSignup}
    >
    <Text style={styles.googleLogo}>G</Text>

    <Text style={styles.socialText}>
      Continue with Google
    </Text>
  </Pressable>
</View>
<View style={styles.loginContainer}>
  <Text style={styles.loginText}>
    Already have an account?
  </Text>

  <Pressable
    onPress={() => navigation.navigate('Login')}>
    <Text style={styles.loginLink}>
      Login
    </Text>
  </Pressable>
</View>

      </View>
    </View>
  </ScrollView>

  <Modal
  visible={showAccountExistsModal}
  transparent={true}
  animationType="none"
  statusBarTranslucent={true}
  navigationBarTranslucent={false}
  onRequestClose={() => setShowAccountExistsModal(false)}
>
  <View
   style={styles.accountExistsOverlay}
  >
    <View
   style={styles.accountExistsCard}
    >
      <View
      style={styles.accountExistsIcon}
      >
        <Ionicons
          name="person-outline"
          size={30}
          color="#DC2626"
        />
      </View>

      <Text
     style={styles.accountExistsTitle}
      >
        Account already exists
      </Text>

      <Text
     style={styles.accountExistsMessage}
      >
        This Google email is already registered with SkillConnect.
        Please log in to your existing account.
      </Text>

      <Pressable
        onPress={() => {
          setShowAccountExistsModal(false);
          navigation.navigate('Login');
        }}
        style={styles.accountExistsLoginButton}
      >
        <Text
          style={styles.accountExistsLoginText}
        >
          Go to Login
        </Text>
      </Pressable>

      <Pressable
        onPress={() => setShowAccountExistsModal(false)}
        style={styles.accountExistsCancelButton}
      >
        <Text
          style={styles.accountExistsCancelText}
        >
          Cancel
        </Text>
      </Pressable>
    </View>
  </View>
</Modal>

</SafeAreaView>


  );
};


export default SignupScreen;