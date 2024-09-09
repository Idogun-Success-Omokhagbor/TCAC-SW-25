import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import axios from 'axios';

// Define async thunks
export const registerSuperAdmin = createAsyncThunk(
  'superAdmin/registerSuperAdmin',
  async (superAdminData, thunkAPI) => {
    try {
      const response = await axios.post('/api/auth/super-admin/register', {
        ...superAdminData,
        registrationStatus: 'pending',
      });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      return thunkAPI.rejectWithValue({ message: errorMessage });
    }
  }
);

export const loginSuperAdmin = createAsyncThunk(
  'superAdmin/login',
  async ({ email, password }, thunkAPI) => {
    try {
      const response = await axios.post('/api/auth/superAdmin/login', { email, password });
      localStorage.setItem('superAdminToken', response.data.token); // Save token in localStorage
      return { user: response.data.user, token: response.data.token };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      return thunkAPI.rejectWithValue({ message: errorMessage });
    }
  }
);

export const verifySuperAdminEmail = createAsyncThunk(
  'superAdmin/verifySuperAdminEmail',
  async (formData, thunkAPI) => {
    try {
      const response = await axios.post('/api/auth/super-admin/verify-email', formData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || { message: 'Verification failed' });
    }
  }
);

export const resetSuperAdminPassword = createAsyncThunk(
  'superAdmin/resetSuperAdminPassword',
  async ({ email, password, confirmPassword }, thunkAPI) => {
    try {
      const response = await axios.post('/api/auth/super-admin/reset-password', { email, password, confirmPassword });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Password reset failed';
      return thunkAPI.rejectWithValue({ message: errorMessage });
    }
  }
);

const superAdminAuthSlice = createSlice({
  name: 'superAdminAuth',
  initialState: {
    superAdmin: null,
    token: null,
    loading: false,
    status: 'idle',
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.superAdmin = null;
      state.token = null;
      localStorage.removeItem('superAdminToken'); // Clear token on logout
    },
    setSuperAdmin: (state, action) => {
      state.superAdmin = action.payload;
    },
    clearStatus: (state) => {
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(HYDRATE, (state, action) => {
        if (action.payload.superAdminAuth) {
          state.superAdmin = action.payload.superAdminAuth.superAdmin;
          state.token = action.payload.superAdminAuth.token;
        }
      })
      // Register Reducers
      .addCase(registerSuperAdmin.pending, (state) => {
        state.loading = true;
        state.status = 'pending';
      })
      .addCase(registerSuperAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.status = 'succeeded';
        state.superAdmin = action.payload;
      })
      .addCase(registerSuperAdmin.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action.payload;
      })
      // Login Reducers
      .addCase(loginSuperAdmin.pending, (state) => {
        state.loading = true;
        state.status = 'pending';
      })
      .addCase(loginSuperAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.status = 'succeeded';
        state.superAdmin = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginSuperAdmin.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action.payload;
      })
      // Verify Super Admin Email Reducers
      .addCase(verifySuperAdminEmail.pending, (state) => {
        state.loading = true;
        state.status = 'pending';
      })
      .addCase(verifySuperAdminEmail.fulfilled, (state) => {
        state.loading = false;
        state.status = 'succeeded';
      })
      .addCase(verifySuperAdminEmail.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action.payload;
      })
      // Password Reset Reducers
      .addCase(resetSuperAdminPassword.pending, (state) => {
        state.loading = true;
        state.status = 'pending';
      })
      .addCase(resetSuperAdminPassword.fulfilled, (state) => {
        state.loading = false;
        state.status = 'succeeded';
      })
      .addCase(resetSuperAdminPassword.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

// Actions
export const { logout, setSuperAdmin, clearStatus } = superAdminAuthSlice.actions;

// Selectors
export const selectAuthLoading = (state) => state.superAdminAuth.loading;
export const selectAuthStatus = (state) => state.superAdminAuth.status;
export const selectAuthError = (state) => state.superAdminAuth.error;
export const selectSuperAdmin= (state) => state.superAdminAuth.superAdmin;
export const selectToken = (state) => state.superAdminAuth.token;
export const selectIsSuperAdminAuthenticated = (state) => !!state.superAdminAuth.token;

export default superAdminAuthSlice.reducer;
