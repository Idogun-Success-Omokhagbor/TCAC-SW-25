import { configureStore } from "@reduxjs/toolkit";
import userAuthReducer from "./slices/auth/user/userAuthSlice";
import adminAuthReducer from "./slices/auth/admin/adminAuthSlice";
import superAdminAuthReducer from "./slices/auth/superAdmin/superAdminAuthSlice";


const store = configureStore({
  reducer: {
    userAuth: userAuthReducer,
    adminAuth: adminAuthReducer,
    superAdminAuth: superAdminAuthReducer,
   
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: true,
    }),
});

export default store;