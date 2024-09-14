import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to fetch all users
export const fetchUsers = createAsyncThunk(
  "userActions/fetchUsers",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get("/api/user-actions"); 
      console.log("fetch users response:", response)
      
      return response.data.data; // Return the list of users
    } catch (error) {
      const statusCode = error.response?.status || 500;
      const errorMessage = error.response?.data?.message || "An error occurred";
      return thunkAPI.rejectWithValue({ message: errorMessage, statusCode });
    }
  }
);

// Async thunk to approve a user
export const approveUser = createAsyncThunk(
  "userActions/approveUser",
  async (userId, thunkAPI) => {
    try {
      const response = await axios.put("/api/user-actions", {
        id: userId,
        action: "approve",
      }); 

      console.log("approve user response:", response)

      return response.data.data; // Return the approve user

    } catch (error) {
      const statusCode = error.response?.status || 500;
      const errorMessage = error.response?.data?.message || "An error occurred";
      return thunkAPI.rejectWithValue({ message: errorMessage, statusCode });
    }
  }
);

// Async thunk to reject a user
export const rejectUser = createAsyncThunk(
  "userActions/rejectUser",
  async (userId, thunkAPI) => {
    try {
      const response = await axios.put("/api/user-actions", {
        id: userId,
        action: "reject",
      }); 
      console.log("reject user response:", response)
      
      return response.data.data; // Return the updated user
    } catch (error) {
      const statusCode = error.response?.status || 500;
      const errorMessage = error.response?.data?.message || "An error occurred";
      return thunkAPI.rejectWithValue({ message: errorMessage, statusCode });
    }
  }
);

const userActionsSlice = createSlice({
  name: "userActions",
  initialState: {
    users: [],
    loading: false,
    error: null,
    approvedUser: null,
    rejectedUser: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearUsers: (state) => {
      state.users = [];
    },
  },
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
      state.users = state.users.map((user) =>
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
      state.users = state.users.map((user) =>
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
export const selectUsers = (state) => state.userActions.users;
export const selectLoading = (state) => state.userActions.loading;
export const selectError = (state) => state.userActions.error;
export const selectApprovedUser = (state) => state.userActions.approvedUser;
export const selectRejectedUser = (state) => state.userActions.rejectedUser;
export const selectUserById = (state, userId) =>
  state.userActions.users.find((user) => user._id === userId);

export const { clearError, clearUsers } = userActionsSlice.actions;

export default userActionsSlice.reducer;
