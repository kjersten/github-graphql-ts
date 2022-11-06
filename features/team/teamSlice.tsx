import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { DateRange } from "../../types";
import { getDefaultDateRange } from "../../utilities/date_utils";

export interface TeamState {
  org: string;
  team: string;
  dateRange: DateRange;
}

const initialState: TeamState = {
  org: "",
  team: "",
  dateRange: getDefaultDateRange(),
};

export const teamSlice = createSlice({
  name: "team",
  initialState,
  reducers: {
    setOrg: (state, action: PayloadAction<string>) => {
      state.org = action.payload;
      state.team = "";
    },
    setTeam: (state, action: PayloadAction<string>) => {
      state.team = action.payload;
    },
    setDateRange: (state, action: PayloadAction<DateRange>) => {
      state.dateRange = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setOrg, setTeam, setDateRange } = teamSlice.actions;

export default teamSlice.reducer;
