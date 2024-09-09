// store/slices/auth/admin/adminAuthSlices.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import axios from 'axios';

// Define async thunks
export const registerAdmin = createAsyncThunk(
  'admin/registerAdmin',
  async (adminData, thunkAPI) => {
    try {
      const response = await axios.post('/api/auth/admin/register', {
        ...adminData,
        registrationStatus: 'pending',
      });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      return thunkAPI.rejectWithValue({ message: errorMessage });
    }
  }
);

export const loginAdmin = createAsyncThunk(
  'admin/login',
  async ({ email, password }, thunkAPI) => {
    try {
      const response = await axios.post('/api/auth/admin/login', { email, password });
      localStorage.setItem('adminToken', response.data.token); // Save token in localStorage
      return { user: response.data.user, token: response.data.token };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      return thunkAPI.rejectWithValue({ message: errorMessage });
    }
  }
);

export const verifyAdminEmail = createAsyncThunk(
  'admin/verifyAdminEmail',
  async (formData, thunkAPI) => {
    try {
      const response = await axios.post('/api/auth/admin/verify-email', formData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || { message: 'Verification failed' });
    }
  }
);

export const resetAdminPassword = createAsyncThunk(
  'admin/resetAdminPassword',
  async ({ email, password, confirmPassword }, thunkAPI) => {
    try {
      const response = await axios.post('/api/auth/admin/reset-password', { email, password, confirmPassword });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Password reset failed';
      return thunkAPI.rejectWithValue({ message: errorMessage });
    }
  }
);

const adminAuthSlice = createSlice({
  name: 'adminAuth',
  initialState: {
    admin: null,
    token: null,
    loading: false,
    status: 'idle',
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.admin = null;
      state.token = null;
      localStorage.removeItem('adminToken'); // Clear token on logout
    },
    setAdmin: (state, action) => {
      state.admin = action.payload;
    },
    clearStatus: (state) => {
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(HYDRATE, (state, action) => {
        if (action.payload.adminAuth) {
          state.admin = action.payload.adminAuth.admin;
          state.token = action.payload.adminAuth.token;
        }
      })
      // Register Reducers
      .addCase(registerAdmin.pending, (state) => {
        state.loading = true;
        state.status = 'pending';
      })
      .addCase(registerAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.status = 'succeeded';
        state.admin = action.payload;
      })
      .addCase(registerAdmin.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action.payload;
      })
      // Login Reducers
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.status = 'pending';
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.status = 'succeeded';
        state.admin = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action.payload;
      })
      // Verify Admin Email Reducers
      .addCase(verifyAdminEmail.pending, (state) => {
        state.loading = true;
        state.status = 'pending';
      })
      .addCase(verifyAdminEmail.fulfilled, (state) => {
        state.loading = false;
        state.status = 'succeeded';
      })
      .addCase(verifyAdminEmail.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action.payload;
      })
      // Password Reset Reducers
      .addCase(resetAdminPassword.pending, (state) => {
        state.loading = true;
        state.status = 'pending';
      })
      .addCase(resetAdminPassword.fulfilled, (state) => {
        state.loading = false;
        state.status = 'succeeded';
      })
      .addCase(resetAdminPassword.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

// Actions
export const { logout, setAdmin, clearStatus } = adminAuthSlice.actions;

// Selectors
export const selectAuthLoading = (state) => state.adminAuth.loading;
export const selectAuthStatus = (state) => state.adminAuth.status;
export const selectAuthError = (state) => state.adminAuth.error;
export const selectAdmin = (state) => state.adminAuth.admin;
export const selectToken = (state) => state.adminAuth.token;
export const selectIsAdminAuthenticated = (state) => !!state.adminAuth.token;

export default adminAuthSlice.reducer;
