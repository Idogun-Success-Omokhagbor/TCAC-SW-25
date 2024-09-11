import { configureStore } from "@reduxjs/toolkit";
import userAuthReducer from "./slices/auth/user/userAuthSlice";
import adminAuthReducer from "./slices/auth/admin/adminAuthSlice";
import superAdminAuthReducer from "./slices/auth/superAdmin/superAdminAuthSlice";
import userActionsReducer from "./slices/userActionsSlice";
import adminActionsReducer from "./slices/adminActionsSlice";


const store = configureStore({
  reducer: {
    userAuth: userAuthReducer,
    adminAuth: adminAuthReducer,
    superAdminAuth: superAdminAuthReducer,
    userActions: userActionsReducer,
    adminActions: adminActionsReducer,
   
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: true,
    }),
});

export default store;