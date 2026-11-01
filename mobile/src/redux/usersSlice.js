import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {getUserProfilePhoto} from '../services/api';

export const fetchUserProfilePhoto = createAsyncThunk(
  'users/fetchProfilePhoto',
  async (userId, {rejectWithValue}) => {
    try {
      const response = await getUserProfilePhoto(userId);

      return {
        userId,
        photoUri: `data:${response.mimeType};base64,${response.base64}`,
      };
    } catch (error) {
      return rejectWithValue({
        userId,
        message:
          error.response?.data?.message || 'Unable to load profile photo.',
      });
    }
  },
  {
    condition: (userId, {getState}) => {
      const photo = getState().users?.photosByUserId?.[userId];

      return !photo || photo.status === 'idle' || photo.status === 'failed';
    },
  },
);

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    photosByUserId: {},
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchUserProfilePhoto.pending, (state, action) => {
        const userId = action.meta.arg;

        state.photosByUserId[userId] = {
          uri: null,
          status: 'loading',
        };
      })
      .addCase(fetchUserProfilePhoto.fulfilled, (state, action) => {
        const {userId, photoUri} = action.payload;

        state.photosByUserId[userId] = {
          uri: photoUri,
          status: 'succeeded',
        };
      })
      .addCase(fetchUserProfilePhoto.rejected, (state, action) => {
        const userId = action.meta.arg;

        state.photosByUserId[userId] = {
          uri: null,
          status: 'failed',
        };
      });
  },
});

export default usersSlice.reducer;