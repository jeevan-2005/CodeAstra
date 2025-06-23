import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define types for user and state
export interface NewUser {
  id: number;
  username: string;
  email: string;
}

export interface AuthState {
  user: NewUser | null;
}

const initialState: AuthState = {
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<NewUser | null>) {
      state.user = action.payload;
    },
    logout(state) {
      state.user = null;
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;