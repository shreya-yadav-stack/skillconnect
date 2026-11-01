import React, {
  useEffect,
  useState,
  useCallback,
} from 'react';

import {useFocusEffect} from '@react-navigation/native';
import {
  ScrollView,
  Text,
  View,
  Pressable,
  ActivityIndicator,
  Linking
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  getPlans,
  selectPlan,
  createPayment,
  getMyPlan,
} from '../../services/api';
import styles from './PlansScreen.style';

const DURATIONS = [1, 6, 12];

const getDurationLabel = hours =>
  `${hours} ${hours === 1 ? 'Hour' : 'Hours'}`;

const PlansScreen = ({navigation}) => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState(null);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [currentPlan, setCurrentPlan] = useState(null);

  const fetchCurrentPlan = useCallback(async () => {
    try {
      const myPlanResponse = await getMyPlan();
      // remove
      console.log(
        'PROFESSIONAL MEMBERSHIP DATA:',
        JSON.stringify(response.professionals, null, 2),
      );
      setCurrentPlan(myPlanResponse.userPlan);
    } catch (planError) {
      console.error(
        'FETCH MY PLAN ERROR:',
        planError?.response?.data || planError?.message || planError,
      );
    }
  }, []);
  useFocusEffect(
    useCallback(() => {
      fetchCurrentPlan();
    }, [fetchCurrentPlan]),
  );
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await getPlans();
        setPlans(response.plans || []);
      } catch (error) {
        console.error(
          'FETCH PLANS ERROR:',
          error.response?.data || error.message,
        );
        setErrorMessage('Unable to load plans. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);


  const handleContinue = async () => {
    if (!selectedPlan || !selectedDuration || saving) {
      return;
    }
    console.log('PAYPAL CHECKOUT: Continue pressed', {
      selectedPlan,
      selectedDuration,
    });
    const selected = plans.find(
      plan =>
        plan.name === selectedPlan &&
        Number(plan.duration_hours) === selectedDuration,
    );

    if (!selected) {
      setErrorMessage(
        'This plan duration is unavailable. Please choose another.',
      );
      return;
    }

    try {
      setSaving(true);
      setErrorMessage('');

      // Step 1: Create a pending membership.
      const selectionResponse = await selectPlan(selected.id);
      console.log('PAYPAL CHECKOUT: Membership response', selectionResponse);
      const userPlanId = selectionResponse.userPlan?.id;

      if (!userPlanId) {
        throw new Error('Could not create the pending membership.');
      }

      // Step 2: Ask the backend to create a PayPal order.
      const paymentResponse = await createPayment(userPlanId);
      console.log('PAYPAL CHECKOUT: Payment response', paymentResponse);
      if (!paymentResponse.approvalUrl || !paymentResponse.orderId) {
        throw new Error('PayPal did not return a valid approval link.');
      }

      // Step 3: Open the PayPal approval page.
      await Linking.openURL(paymentResponse.approvalUrl);
    } catch (error) {
      console.error('PAYPAL CHECKOUT FAILED:', {
        message: error.message,
        status: error.response?.status,
        response: error.response?.data,
      });


      setErrorMessage(
        error.response?.data?.message ||
          error.message ||
          'Unable to start PayPal checkout. Please try again.',
      );
    } finally {
      setSaving(false);
    }
  };


  const renderDurationOptions = planName => {
    const availablePlans = plans.filter(
      plan => plan.name === planName,
    );

    const availableDurations = DURATIONS.filter(duration =>
      availablePlans.some(
        plan => Number(plan.duration_hours) === duration,
      ),
    );

    return (
      <View style={styles.durationRow}>
        {availableDurations.map(duration => {
          const isSelected =
            selectedPlan === planName &&
            selectedDuration === duration;

          return (
            <Pressable
              key={duration}
              accessibilityRole="button"
              accessibilityState={{selected: isSelected}}
              style={[
                styles.durationButton,
                isSelected && styles.selectedDurationButton,
              ]}
              onPress={() => {
                setSelectedPlan(planName);
                setSelectedDuration(duration);
                setErrorMessage('');
              }}>
              <Text
                style={[
                  styles.durationText,
                  isSelected && styles.selectedDurationText,
                ]}>
                {getDurationLabel(duration)}
              </Text>
            </Pressable>
          );
        })}
      </View>
    );
  };

  const renderPaidPlan = (name, description, featured = false) => {
    const availableDurations = plans
      .filter(plan => plan.name === name)
      .map(plan => Number(plan.duration_hours));

    if (availableDurations.length === 0) {
      return null;
    }

    return (
      <View
        key={name}
        style={[
          styles.planCard,
          featured && styles.featuredPlanCard,
        ]}>
        <View style={styles.planHeadingRow}>
          <View style={styles.planHeadingText}>
            <Text style={styles.planName}>{name}</Text>
            <Text style={styles.planDescription}>{description}</Text>
          </View>

          {featured && (
            <View style={styles.recommendedBadge}>
              <Text style={styles.recommendedText}>Premium</Text>
            </View>
          )}
        </View>

        <Text style={styles.durationHeading}>Choose duration</Text>

        {renderDurationOptions(name)}
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#4655A5" />
          <Text style={styles.loadingText}>Loading plans...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>‹</Text>
          </Pressable>

          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Plans</Text>
            <Text style={styles.headerSubtitle}>
              Find the right level for your profile
            </Text>
          </View>
        </View>

        <View style={styles.intro}>
          <Text style={styles.title}>Choose your plan</Text>
          <Text style={styles.subtitle}>
            Select a plan and duration that suits your professional goals.
          </Text>
        </View>

        {errorMessage !== '' && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{errorMessage}</Text>

            <Pressable
              onPress={() => setErrorMessage('')}
              accessibilityRole="button">
              <Text style={styles.dismissText}>Dismiss</Text>
            </Pressable>
          </View>
        )}

{currentPlan && (
  <View style={styles.planCard}>
    <Text style={styles.planName}>Current Membership</Text>

    <Text style={styles.planDescription}>
      {currentPlan.name || 'Free'} Plan
    </Text>

    {currentPlan.expiry_time && (
      <Text style={styles.planDescription}>
        Expires: {new Date(currentPlan.expiry_time).toLocaleString()}
      </Text>
    )}
  </View>
)}

        <View style={styles.planCard}>
          <View style={styles.planHeadingRow}>
            <View style={styles.planHeadingText}>
              <Text style={styles.planName}>Free</Text>
              <Text style={styles.planDescription}>
                Essential profile access
              </Text>
            </View>

            <View style={styles.freeBadge}>
              <Text style={styles.freeBadgeText}>Included</Text>
            </View>
          </View>

          <Text style={styles.freePrice}>Free</Text>

          <View style={styles.featureRow}>
            <Text style={styles.featureCheck}>✓</Text>
            <Text style={styles.featureText}>Basic profile access</Text>
          </View>

          <View style={styles.featureRow}>
            <Text style={styles.featureCheck}>✓</Text>
            <Text style={styles.featureText}>Manage your profile</Text>
          </View>
        </View>

        {renderPaidPlan(
          'Silver',
          'Additional professional profile features',
        )}

        {renderPaidPlan(
          'Gold',
          'Maximum professional visibility',
          true,
        )}

        {selectedPlan && selectedDuration && (
          <View style={styles.selectionCard}>
            <Text style={styles.selectionLabel}>Your selection</Text>

            <View style={styles.selectionDetails}>
              <View>
                <Text style={styles.selectionPlan}>
                  {selectedPlan} plan
                </Text>
                <Text style={styles.selectionDuration}>
                  {getDurationLabel(selectedDuration)} access
                </Text>
              </View>

              <View style={styles.selectionIcon}>
                <Text style={styles.selectionCheck}>✓</Text>
              </View>
            </View>

            <Pressable
              accessibilityRole="button"
              style={[
                styles.continueButton,
                saving && styles.continueButtonDisabled,
              ]}
              onPress={handleContinue}
              disabled={saving}>
              {saving ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.continueButtonText}>
                  Continue
                </Text>
              )}
            </Pressable>
          </View>
        )}

        <Text style={styles.footerText}>
          You can review your selection before continuing.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PlansScreen;