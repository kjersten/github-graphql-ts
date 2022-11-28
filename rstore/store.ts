import { configureStore } from "@reduxjs/toolkit";
import teamSlice from "../features/team/teamSlice";

export const store = configureStore({
  reducer: {
    team: teamSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
