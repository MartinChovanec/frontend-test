// userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type LoginHistoryEntry = {
  id: number;
  date: string;
  device: string;
  browser: string;
  ip: string;
};

export type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  image: string;
  lastLoginDate?: Date;
  status?: string;
  role?: string;
  lastActive: string;
  loginHistory: LoginHistoryEntry[];
};

interface UsersState {
  users: User[];
}

const initialState: UsersState = {
  users: [],
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsers(state, action: PayloadAction<User[]>) {
      state.users = action.payload;
    },
    addUser(state, action: PayloadAction<User>) {
      state.users.unshift(action.payload);
    },
    editUser(state, action: PayloadAction<Partial<User> & { id: number }>) {
        const index = state.users.findIndex(u => u.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = {
            ...state.users[index],
            ...action.payload,
          };
        }
      }
  },
});

export const { setUsers, addUser } = userSlice.actions;
export default userSlice.reducer;