import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch all admins
export const fetchAdmins = createAsyncThunk('adminActions/fetchAdmins', async (_, thunkAPI) => {
  try {
    const response = await axios.get('/api/admin-actions'); 
    return response.data.data; // Return the list of admins
  } catch (error) {
    const statusCode = error.response?.status || 500;
    const errorMessage = error.response?.data?.error || 'An error occurred';
    return thunkAPI.rejectWithValue({ message: errorMessage, statusCode });
  }
});

// Async thunk to approve an admin
export const approveAdmin = createAsyncThunk('adminActions/approveAdmin', async (adminId, thunkAPI) => {
  try {
    const response = await axios.put('/api/admin-actions', { id: adminId, action: 'approve' });
    return response.data.data; // Return the updated admin
  } catch (error) {
    const statusCode = error.response?.status || 500;
    const errorMessage = error.response?.data?.error || 'An error occurred';
    return thunkAPI.rejectWithValue({ message: errorMessage, statusCode });
  }
});

// Async thunk to reject an admin
export const rejectAdmin = createAsyncThunk('adminActions/rejectAdmin', async (adminId, thunkAPI) => {
  try {
    const response = await axios.put('/api/admin-actions', { id: adminId, action: 'reject' });
    return response.data.data; // Return the updated admin
  } catch (error) {
    const statusCode = error.response?.status || 500;
    const errorMessage = error.response?.data?.error || 'An error occurred';
    return thunkAPI.rejectWithValue({ message: errorMessage, statusCode });
  }
});

// Async thunk to update admin function
export const updateAdminFunction = createAsyncThunk('adminActions/updateAdminFunction', async ({ adminId, adminFunction }, thunkAPI) => {
  try {
    const response = await axios.put('/api/admin-actions', { id: adminId, action: 'updateAdminFunction', adminFunction });
    return response.data.data; // Return the updated admin
  } catch (error) {
    const statusCode = error.response?.status || 500;
    const errorMessage = error.response?.data?.error || 'An error occurred';
    return thunkAPI.rejectWithValue({ message: errorMessage, statusCode });
  }
});

const adminActionsSlice = createSlice({
  name: 'adminActions',
  initialState: {
    admins: [],
    loading: false,
    error: null,
    approvedAdmin: null,
    rejectedAdmin: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearAdmins: (state) => {
      state.admins = [];
    },
  },
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
      state.admins = state.admins.map(admin =>
        admin._id === action.payload._id ? action.payload : admin
      );
    });
    builder.addCase(rejectAdmin.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Update admin function
    builder.addCase(updateAdminFunction.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateAdminFunction.fulfilled, (state, action) => {
      state.loading = false;
      state.admins = state.admins.map(admin =>
        admin._id === action.payload._id ? action.payload : admin
      );
    });
    builder.addCase(updateAdminFunction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

// Selectors
export const selectAdmins = (state) => state.adminActions.admins;
export const selectLoading = (state) => state.adminActions.loading;
export const selectError = (state) => state.adminActions.error;
export const selectApprovedAdmin = (state) => state.adminActions.approvedAdmin;
export const selectRejectedAdmin = (state) => state.adminActions.rejectedAdmin;
export const selectAdminById = (state, adminId) => 
  state.adminActions.admins.find(admin => admin._id === adminId);

export const { clearError, clearAdmins } = adminActionsSlice.actions;

export default adminActionsSlice.reducer;
