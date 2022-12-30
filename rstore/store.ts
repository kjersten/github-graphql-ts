import { configureStore } from "@reduxjs/toolkit";
import teamSlice from "../features/team/teamSlice";
import { listenerMiddleware } from "./middleware";
import { getDefaultDateRange } from "../utilities/date-utils";

let storedOrg = "";
let storedTeam = "";

if (typeof window !== "undefined") {
  storedOrg = localStorage.getItem("org") || "";
  storedTeam = localStorage.getItem("team") || "";
}

export const store = configureStore({
  preloadedState: {
    team: {
      org: storedOrg,
      team: storedTeam,
      dateRange: getDefaultDateRange(),
    },
  },
  reducer: {
    team: teamSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(listenerMiddleware.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
