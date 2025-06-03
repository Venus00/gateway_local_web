import { createSlice } from "@reduxjs/toolkit";
import { forgotPassword, loginUser, registerUser, resetPassword } from "./authActions";
import { number } from "zod";

const userToken = localStorage.getItem("accessToken")
  ? localStorage.getItem("accessToken")
  : null;

const initialState = {
  loading: false,
  id:null as number |null,
  email: null as string | null,
  name: null as string | null,
  image:null as string|null,
  userToken,
  error: null as string | null,
  success: false,
  role: "user",
  tenant: {
    name: undefined,
    id: null,
    image:null as string|null,
    licence:{
id:null as number|null,
name:null as string | null,
subscriptionPlanId:null as number | null,

    },
    layout: [],
    widget: [],
  },
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    switchTenant: (state, action) => {
      const {tenantItem,accessToken} = action.payload
      
      state.tenant = tenantItem
      // localStorage.setItem("state.userToken",state.userToken)
      localStorage.setItem("accessToken",accessToken,)
      state.userToken = accessToken
      setTimeout(() => {
        window.location.replace("/device");
      }, 500);
      // window.location.replace("/device");
      
    },
    updateTenantInfo: (state, action) => {
      state.tenant = action.payload;
    },
    logOutUser: (state) => {
      state.userToken = null;
      state.email = null;
      state.name = null;
      state.id = null;
      state.image = null;
      state.success = false;state.role = ""
      localStorage.removeItem("accessToken");
      window.location.href = "/login";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(registerUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(registerUser.fulfilled, (state, action) => {
      //state.loading = false
      // state.email = action.payload.email
      //state.success = true
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.loading = false;
      state.error = (action.payload as string) || "An unknown error occurred";
    });
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      console.log(action.payload)
      state.loading = false;
      state.userToken = action.payload.accessToken;
      state.id = action.payload.id;
      state.email = action.payload.email;
      state.name = action.payload.name;
      state.image = action.payload.image;
      state.tenant = action.payload.tenant;
      state.role = action.payload.role;
      state.success = true;
      window.location.href = "/device";

    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = (action.payload as string) || "An unknown error occurred";
    });
    builder.addCase(forgotPassword.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(forgotPassword.rejected, (state, action) => {
      state.loading = false
      // state.email = action.payload.email
      state.error = (action.payload as string) || "An unknown error occurred";
    });
    builder.addCase(forgotPassword.fulfilled, (state, action) => {
      console.log(action.payload)
    });
    builder.addCase(resetPassword.fulfilled, (state, action) => {
      console.log(action.payload)
      state.success = true;
      window.location.href = "/login";
    });
  },
});

export const { logOutUser, switchTenant, updateTenantInfo } = authSlice.actions;
export default authSlice.reducer;
