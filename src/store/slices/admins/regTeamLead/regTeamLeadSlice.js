import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch all users
export const fetchUsers = createAsyncThunk('regTeamLead/fetchUsers', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get('/api/dashboard/regTeamLead');
    return response.data.data; // Return the list of users
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Async thunk to approve a user
export const approveUser = createAsyncThunk('regTeamLead/approveUser', async (userId, { rejectWithValue }) => {
  try {
    const response = await axios.put('/api/dashboard/regTeamLead', { id: userId, action: 'approve' });
    return response.data.data; // Return the updated user
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Async thunk to reject a user
export const rejectUser = createAsyncThunk('regTeamLead/rejectUser', async (userId, { rejectWithValue }) => {
  try {
    const response = await axios.put('/api/dashboard/regTeamLead', { id: userId, action: 'reject' });
    return response.data.data; // Return the updated user
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const regTeamLeadSlice = createSlice({
  name: 'regTeamLead',
  initialState: {
    users: [],
    loading: false,
    error: null,
    approvedUser: null,
    rejectedUser: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // Fetch users
    builder.addCase(fetchUsers.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      state.loading = false;
      state.users = action.payload;
    });
    builder.addCase(fetchUsers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Approve user
    builder.addCase(approveUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(approveUser.fulfilled, (state, action) => {
      state.loading = false;
      state.approvedUser = action.payload;
      // Update the users list with the approved user status
      state.users = state.users.map(user =>
        user._id === action.payload._id ? action.payload : user
      );
    });
    builder.addCase(approveUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Reject user
    builder.addCase(rejectUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(rejectUser.fulfilled, (state, action) => {
      state.loading = false;
      state.rejectedUser = action.payload;
      // Update the users list with the rejected user status
      state.users = state.users.map(user =>
        user._id === action.payload._id ? action.payload : user
      );
    });
    builder.addCase(rejectUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

// Selectors
export const selectUsers = (state) => state.regTeam.users;
export const selectLoading = (state) => state.regTeam.loading;
export const selectError = (state) => state.regTeam.error;

export default regTeamLeadSlice.reducer;
