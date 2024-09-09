import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { HYDRATE } from "next-redux-wrapper";
import axios from 'axios';

// Define async thunks
export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (userData, thunkAPI) => {
    try {
      const response = await axios.post("/api/auth/user/register", {
        ...userData,
        registrationStatus: 'pending',
      });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Registration failed";
      return thunkAPI.rejectWithValue({ message: errorMessage });
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password, role }, thunkAPI) => {
    try {
      const response = await axios.post('/api/auth/user/login', { email, password, role });
      localStorage.setItem('token', response.data.token); // Save token in localStorage
      return { user: response.data.user, token: response.data.token }; // Return both user and token
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Login failed";
      return thunkAPI.rejectWithValue({ message: errorMessage });
    }
  }
);

export const verifyUserEmail = createAsyncThunk(
  "user/verifyUserEmail",
  async (formData, thunkAPI) => {
    try {
      const response = await axios.post("/api/auth/user/verify-email", formData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || { message: "Verification failed" });
    }
  }
);

export const resetUserPassword = createAsyncThunk(
  "user/resetUserPassword",
  async ({ email, password, confirmPassword }, thunkAPI) => {
    try {
      const response = await axios.post(
        "/api/auth/user/reset-password",
        { email, password, confirmPassword }
      );
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Password reset failed";
      return thunkAPI.rejectWithValue({ message: errorMessage });
    }
  }
);

const userAuthSlice = createSlice({
  name: 'userAuth',
  initialState: {
    user: null,
    token: null,
    loading: false,
    status: 'idle', // Possible values: 'idle', 'pending', 'succeeded', 'failed'
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token'); // Clear token on logout
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    clearStatus: (state) => {
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(HYDRATE, (state, action) => {
        if (action.payload.userAuth) {
          state.user = action.payload.userAuth.user;
          state.token = action.payload.userAuth.token;
        }
      })
      // Register Reducers
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.status = 'pending';
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action.payload;
      })
      // Login Reducers
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.status = 'pending';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action.payload;
      })
      // Verify User Email Reducers
      .addCase(verifyUserEmail.pending, (state) => {
        state.loading = true;
        state.status = 'pending';
      })
      .addCase(verifyUserEmail.fulfilled, (state) => {
        state.loading = false;
        state.status = 'succeeded';
      })
      .addCase(verifyUserEmail.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action.payload;
      })
      // Password Reset Reducers
      .addCase(resetUserPassword.pending, (state) => {
        state.loading = true;
        state.status = 'pending';
      })
      .addCase(resetUserPassword.fulfilled, (state) => {
        state.loading = false;
        state.status = 'succeeded';
      })
      .addCase(resetUserPassword.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

// Actions
export const { logout, setUser, clearStatus } = userAuthSlice.actions;

// Selectors
export const selectAuthLoading = (state) => state.userAuth.loading;
export const selectAuthStatus = (state) => state.userAuth.status;
export const selectAuthError = (state) => state.userAuth.error;
export const selectUser = (state) => state.userAuth.user;
export const selectToken = (state) => state.userAuth.token;
export const selectIsAuthenticated = (state) => !!state.userAuth.token;
export const selectRegistrationStatus = (state) => state.userAuth.user?.registrationStatus;

export default userAuthSlice.reducer;
