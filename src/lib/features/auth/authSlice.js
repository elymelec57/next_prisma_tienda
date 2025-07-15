import { createAppSlice } from '../../createAppSlice'

const initialState = {
  value: 0,
  auth: {}
}

export const authSlice = createAppSlice({
  name: 'auth',
  initialState,
  reducers: {
    increment: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value += 1
    },
    decrement: (state) => {
      state.value -= 1
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload
    },
    auth: (state,action) => {
      state.auth = action.payload
    }
  },
  // You can define your selectors here. These selectors receive the slice
  // state as their first argument.
  // selectors: {
  //   selectCount: (counter) => counter.value,
  //   selectStatus: (counter) => counter.status,
  // },
})

// Action creators are generated for each case reducer function
export const { increment, decrement, incrementByAmount, auth } = authSlice.actions
//export const { selectCount, selectStatus } = counterSlice.selectors;
export default authSlice.reducer;