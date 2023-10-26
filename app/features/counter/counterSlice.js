import { createSlice } from "@reduxjs/toolkit";

export const counterSlice = createSlice({
  name: "counter",
  initialState: {
    value: 0,
    waypoints: [],
    POIs: [],
  },
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
    setWPs: (state, action) => {
      state.waypoints = action.payload;
    },
    setPOIs: (state, action) => {
      state.POIs = action.payload;
    },
  },
});

export const { increment, decrement, incrementByAmount, setWPs, setPOIs } =
  counterSlice.actions;

export const incrementAsync = (amount) => (dispatch) => {
  setTimeout(() => {
    dispatch(incrementByAmount(amount));
  }, 1000);
};

export const selectCount = (state) => state.counter.value;
export const selectWPs = (state) => state.counter.waypoints;
export const selectPOIs = (state) => state.counter.POIs;

export default counterSlice.reducer;
