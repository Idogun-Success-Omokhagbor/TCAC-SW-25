import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import axios from 'axios';

// Define async thunks
export const registerSuperAdmin = createAsyncThunk(
  'superAdmin/registerSuperAdmin',
  async (formValues, thunkAPI) => {
    console.log("form values:", formValues);

    try {
      const response = await axios.post('/api/auth/superAdmin/register', formValues);
      console.log("response:", response);
      return response.data;
      console.log("response data:", response.data);
    } catch (error) {
      const statusCode = error.response?.status || 500;
      const errorMessage = error.response?.data?.error || "Registration failed";
      return thunkAPI.rejectWithValue({ message: errorMessage, statusCode });
    }
  }
);

export const loginSuperAdmin = createAsyncThunk(
  'superAdmin/login',
  async (formValues, thunkAPI) => {
    try {
      const response = await axios.post('/api/auth/superAdmin/login', formValues);
      // console.log("Login response:", response.data); // Log the entire response
      localStorage.setItem('superAdminToken', response.data.token);
      return { superAdmin: response.data.superAdminData, token: response.data.token };
    } catch (error) {
      const statusCode = error.response?.status || 500;
      const errorMessage = error.response?.data?.error || "Login failed";
      return thunkAPI.rejectWithValue({ message: errorMessage, statusCode });
    }
  }
);



export const verifySuperAdminEmail = createAsyncThunk(
  'superAdmin/verifySuperAdminEmail',
  async (formValues, thunkAPI) => {
    try {
      const response = await axios.post('/api/auth/superAdmin/verify-email', formValues);
      return response.data;
    } catch (error) {
      const statusCode = error.response?.status || 500;
      const errorMessage = error.response?.data?.error || "Email verification failed";
      return thunkAPI.rejectWithValue({ message: errorMessage, statusCode });
    }
  }
);

export const resetSuperAdminPassword = createAsyncThunk(
  'superAdmin/resetSuperAdminPassword',
  async (formValues, thunkAPI) => {
    try {
      const response = await axios.post('/api/auth/superAdmin/reset-password', formValues);
      return response.data;
    } catch (error) {
      const statusCode = error.response?.status || 500;
      const errorMessage = error.response?.data?.error || "Password reset failed";
      return thunkAPI.rejectWithValue({ message: errorMessage, statusCode });
    }
  }
);

const superAdminAuthSlice = createSlice({
  name: 'superAdminAuth',
  initialState: {
    superAdmin: null,
    token: typeof window !== 'undefined' ? localStorage.getItem('superAdminToken') : null,
    loading: false,
    status: 'idle',
    error: null,
  },
  reducers: {
    logoutSuperAdmin: (state) => {
      state.superAdmin = null;
      state.token = null;
      localStorage.removeItem('superAdminToken');
      sessionStorage.removeItem('superAdminData');
    },
    setSuperAdmin: (state, action) => {
      state.superAdmin = action.payload;
      state.token = localStorage.getItem('superAdminToken');
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
        state.superAdmin = action.payload.superAdmin;  // Ensure this payload exists
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
export const { logoutSuperAdmin, setSuperAdmin, clearStatus } = superAdminAuthSlice.actions;

// Selectors
export const selectAuthLoading = (state) => state.superAdminAuth.loading;
export const selectAuthStatus = (state) => state.superAdminAuth.status;
export const selectAuthError = (state) => state.superAdminAuth.error;
export const selectSuperAdmin = (state) => state.superAdminAuth.superAdmin;
export const selectSuperAdminToken = (state) => state.superAdminAuth.token;
export const selectIsSuperAdminAuthenticated = (state) => !!state.superAdminAuth.token;

export default superAdminAuthSlice.reducer;
