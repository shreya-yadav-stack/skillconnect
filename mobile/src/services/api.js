import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: 'https://skillconnect-api-dawr.onrender.com',
 // baseURL: 'http://10.0.0.28:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});


api.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log(
      '[API REQUEST]',
      config.method?.toUpperCase(),
      `${config.baseURL || ''}${config.url || ''}`,
    );

    return config;
  },
  error => Promise.reject(error),
);

api.interceptors.response.use(
  response => response,
  error => {
    console.log('[API ERROR]', {
      url: error.config?.url,
      method: error.config?.method,
      message: error.message,
      status: error.response?.status,
      response: error.response?.data,
    });

    return Promise.reject(error);
  },
);

export const getProfile = async () => {
  const response = await api.get('/api/profile');

  return response.data;
};
export const getProfessionals = async () => {
  const response = await api.get('/api/professionals');
  console.log('PROFESSIONALS API RESPONSE:', response.data);
  return response.data;
};

export const uploadProfilePhoto = async photo => {
  const formData = new FormData();

  formData.append('photo', {
    uri: photo.uri,
    name: photo.fileName || `profile-${Date.now()}.jpg`,
    type: photo.type || 'image/jpeg',
  });

  const response = await api.post('/api/profile/photo', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};
export const getProfilePhoto = async () => {
  const response = await api.get('/api/profile/photo/base64');
  console.log('PHOTO API RESPONSE:', {
    mimeType: response.data?.mimeType,
    base64Length: response.data?.base64?.length,
  });
  return response.data;
};

export const getUserProfilePhoto = async userId => {
  const response = await api.get(
    `/api/users/${userId}/profile-photo/base64`,
  );
  return response.data;
};

export const saveProfile = async profileData => {
  const response = await api.put('/api/profile', profileData);

  return response.data;
};

export const getPlans = async () => {
  const response = await api.get('/api/plans');
  return response.data;
};


export const selectPlan = async planId => {
  const response = await api.post('/api/my-plan', {
    plan_id: planId,
  });

  return response.data;
};

export const createPayment = async userPlanId => {
  const response = await api.post('/api/create-payment', {
    user_plan_id: userPlanId,
  });

  return response.data;
};

export const capturePayment = async orderId => {
  const response = await api.post('/api/capture-payment', {
    order_id: orderId,
  });

  return response.data;
};


export const getMyPlan = async () => {
  const response = await api.get('/api/my-plan');

  return response.data;
};

export const searchAddresses = async query => {
  const response = await api.get('/api/places/search', {
    params: {query},
  });

  return response.data;
};

export const reverseGeocode = async (latitude, longitude) => {
  const response = await api.get('/api/places/reverse', {
    params: {
      latitude,
      longitude,
    },
  });

  return response.data;
};

export default api;