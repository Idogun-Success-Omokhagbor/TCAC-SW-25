import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch all admins
export const fetchAdmins = createAsyncThunk(
  'adminActions/fetchAdmins',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/adminActions');
      return response.data.data; // Return the list of admins
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to approve an admin
export const approveAdmin = createAsyncThunk(
  'adminActions/approveAdmin',
  async (adminId, { rejectWithValue }) => {
    try {
      const response = await axios.put('/api/adminActions', { id: adminId, action: 'approve' });
      return response.data.data; // Return the updated admin
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to reject an admin
export const rejectAdmin = createAsyncThunk(
  'adminActions/rejectAdmin',
  async (adminId, { rejectWithValue }) => {
    try {
      const response = await axios.put('/api/adminActions', { id: adminId, action: 'reject' });
      return response.data.data; // Return the updated admin
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const adminActionsSlice = createSlice({
  name: 'adminActions',
  initialState: {
    admins: [],
    loading: false,
    error: null,
    approvedAdmin: null,
    rejectedAdmin: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // Fetch admins
    builder.addCase(fetchAdmins.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchAdmins.fulfilled, (state, action) => {
      state.loading = false;
      state.admins = action.payload;
    });
    builder.addCase(fetchAdmins.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Approve admin
    builder.addCase(approveAdmin.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(approveAdmin.fulfilled, (state, action) => {
      state.loading = false;
      state.approvedAdmin = action.payload;
      // Update the admins list with the approved admin status
      state.admins = state.admins.map(admin =>
        admin._id === action.payload._id ? action.payload : admin
      );
    });
    builder.addCase(approveAdmin.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Reject admin
    builder.addCase(rejectAdmin.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(rejectAdmin.fulfilled, (state, action) => {
      state.loading = false;
      state.rejectedAdmin = action.payload;
      // Update the admins list with the rejected admin status
      state.admins = state.admins.map(admin =>
        admin._id === action.payload._id ? action.payload : admin
      );
    });
    builder.addCase(rejectAdmin.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

// Selectors
export const selectAdmins = (state) => state.adminActions.admins;
export const selectLoading = (state) => state.adminActions.loading;
export const selectError = (state) => state.adminActions.error;

export default adminActionsSlice.reducer;
