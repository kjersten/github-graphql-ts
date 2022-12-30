import { configureStore, createListenerMiddleware } from "@reduxjs/toolkit";
import { setOrg, setTeam } from "../features/team/teamSlice";
import type { RootState } from "./store";

export const listenerMiddleware = createListenerMiddleware();
listenerMiddleware.startListening({
  actionCreator: setOrg,
  effect: (action, listenerApi) =>
    localStorage.setItem(
      "org",
      JSON.stringify((listenerApi.getState() as RootState).team.org)
    ),
});

listenerMiddleware.startListening({
  actionCreator: setTeam,
  effect: (action, listenerApi) =>
    localStorage.setItem(
      "team",
      JSON.stringify((listenerApi.getState() as RootState).team.team)
    ),
});
