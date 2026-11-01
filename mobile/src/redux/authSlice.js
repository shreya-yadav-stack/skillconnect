import {createAsyncThunk,createSlice} from '@reduxjs/toolkit';

import AsyncStorage from '@react-native-async-storage/async-storage';

import api from '../services/api';

export const initializeAuth = createAsyncThunk(
    'auth/initializeAuth',
    async (_, {rejectWithValue}) => {
      try {
        const token = await AsyncStorage.getItem('token');

        if (!token) {
          return null;
        }

        const response = await api.get('/api/auth/me');

        return {
          user: response.data.user,
          token,
        };
      } catch (error) {
        await AsyncStorage.removeItem('token');

        return rejectWithValue(
          error.response?.data?.message || 'Session expired',
        );
      }
    },
  );


const initialState={
    user:null,
    token:null,
    isAuthenticated:false,
    loading :false,
};

const authSlice = createSlice({
    name:'auth',
    initialState,

    reducers: {
        setAuth: (state, action) => {
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.isAuthenticated = true;
        },

        logout: state => {
          state.user = null;
          state.token = null;
          state.isAuthenticated = false;
        },
      },

      extraReducers: builder => {
        builder
          .addCase(initializeAuth.pending, state => {
            state.loading = true;
          })

          .addCase(initializeAuth.fulfilled, (state, action) => {
            state.loading = false;

            if (action.payload) {
              state.user = action.payload.user;
              state.token = action.payload.token;
              state.isAuthenticated = true;
            }
          })

          .addCase(initializeAuth.rejected, state => {
            state.loading = false;
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
          });
      },
});

export const {setAuth,logout} = authSlice.actions;

export default authSlice.reducer;