import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiClientAuth } from "../api";
import { toast } from "@/hooks/use-toast";

// const BASE_URL = `${import.meta.env.VITE_SERVER_URL}/api/v1`;
const BASE_URL = `http://${window.location.hostname}:4000/api/v1`;
//const BASE_URL = `${import.meta.env.VITE_SERVER_URL}/api/v1`;

export const registerUser = createAsyncThunk(
  "auth/register",
  async (
    userData: {
      tenantId?: number | null;
      email: string;
      password: string;
      confirmPassword: string;
      tenantName: string;
      name: string;
    },
    { rejectWithValue }
  ) => {
    try {

      const response = await apiClientAuth.post(
        `${BASE_URL}/auth/register`,
        userData
      );
      toast({
        title: "Success",
        description: "A validation Email has been sent",
        variant: "default",
      });
      const { accessToken, email } = response.data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("email", email);
      // return {email,accessToken}
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        toast({
          title: "Error",
          description: error.response?.data?.message,
          variant: "destructive",
        });
        return rejectWithValue(error.response.data.message);
      } else if (error instanceof Error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        return rejectWithValue(error.message);
      } else {
        toast({
          title: "Error",
          description: "An unknown error occurred",
          variant: "destructive",
        });
        return rejectWithValue("An unknown error occurred");
      }
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (
    userData: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      if (BASE_URL) {
        const response = await apiClientAuth.post(`${BASE_URL}/auth/login`, userData);
        console.log("response data", response.data);
        const { accessToken, email, tenant, role, id, name, image } = response.data;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("email", email);
        return { accessToken, email, tenant, role, id, name, image };
      }
      else {
        return rejectWithValue("An unknown error occurred");
      }

    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        toast({
          title: "Error",
          description: error.response.data.message,
          variant: "destructive",
        });
        return rejectWithValue(error.response.data.message);
      } else if (error instanceof Error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        return rejectWithValue(error.message);
      } else {
        toast({
          title: "Error",
          description: "An unknown error occurred",
          variant: "destructive",
        });
        return rejectWithValue("An unknown error occurred");
      }
    }
  }
);
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (
    userData: { email: string },
    { rejectWithValue }
  ) => {
    try {
      if (BASE_URL) {
        const response = await apiClientAuth.post(`${BASE_URL}/auth/forgotPassword`, userData);
        console.log("response data", response.data);
        // const { accessToken, email, tenant, role, id } = response.data;
        return "Success"
        // return { accessToken, email, tenant, role, id };
      }
      else {
        return rejectWithValue("An unknown error occurred");
      }

    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        toast({
          title: "Error",
          description: error.response.data.message,
          variant: "destructive",
        });
        return rejectWithValue(error.response.data.message);
      } else if (error instanceof Error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        return rejectWithValue(error.message);
      } else {
        toast({
          title: "Error",
          description: "An unknown error occurred",
          variant: "destructive",
        });
        return rejectWithValue("An unknown error occurred");
      }
    }
  }
);
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (
    userData: {
      token: string;
      password: string;
      confirmPassword: string
    },
    { rejectWithValue }
  ) => {
    try {
      if (BASE_URL) {
        const response = await apiClientAuth.post(`${BASE_URL}/auth/resetPassword`, userData);
        console.log("response data", response);
        return true;
      }
      else {
        return rejectWithValue("An unknown error occurred");
      }

    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        toast({
          title: "Error",
          description: error.response.data.message,
          variant: "destructive",
        });
        return rejectWithValue(error.response.data.message);
      } else if (error instanceof Error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        return rejectWithValue(error.message);
      } else {
        toast({
          title: "Error",
          description: "An unknown error occurred",
          variant: "destructive",
        });
        return rejectWithValue("An unknown error occurred");
      }
    }
  }
);
