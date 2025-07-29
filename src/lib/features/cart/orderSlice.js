import { createAppSlice } from '../../createAppSlice'

const initialState = {
  count: 0, //localStorage.getItem('count') || 0,
  order: [] //localStorage.getItem('order') || [],
}

export const orderSlice = createAppSlice({
  name: 'order',
  initialState,
  reducers: {
    addCart: (state,action) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.order.push(action.payload);
      state.count += 1

      localStorage.setItem('order',JSON.stringify(state.order))
      localStorage.setItem('count',JSON.stringify(state.count))
    },
    subCart: (state) => {
      state.value -= 1
    },
    order: (state,action) => {
      state.order = action.payload;
    },
    inialityCount: (state,action) => {
      state.count = action.payload
    }
  },

})

// Action creators are generated for each case reducer function
export const { addCart, subCart, order, inialityCount } = orderSlice.actions
//export const { selectCount, selectStatus } = counterSlice.selectors;
export default orderSlice.reducer;