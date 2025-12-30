import { createAppSlice } from '../../createAppSlice'

const initialState = {
  count: 0,
  order: []
}

export const orderSlice = createAppSlice({
  name: 'order',
  initialState,
  reducers: {
    addCart: (state, action) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.order.push(action.payload);
      state.count += 1

      localStorage.setItem('order', JSON.stringify(state.order))
      localStorage.setItem('count', JSON.stringify(state.count))
    },
    subCart: (state, action) => {
      const id = action.payload
      state.order.forEach((e, index) => {
        if (e.id == id) {
          state.count = state.count - e.count;
          state.order.splice(index, 1);
          localStorage.setItem('order', JSON.stringify(state.order));
          localStorage.setItem('count', JSON.stringify(state.count));
        }
      });

    },
    sumarProduct: (state, action) => {
      const id = action.payload
      state.order.forEach((e) => {
        if (e.id == id) {
          e.count++;
        }
      });
      localStorage.setItem('order', JSON.stringify(state.order))
      localStorage.setItem('count', JSON.stringify(state.count++))

    },
    restarProduct: (state, action) => {
      const id = action.payload
      state.order.forEach((e) => {
        if (e.id == id) {
          e.count--;
        }
      });
      localStorage.setItem('order', JSON.stringify(state.order))
      localStorage.setItem('count', JSON.stringify(state.count--))

    },
    order: (state, action) => {
      state.order = action.payload;
    },
    inialityCount: (state, action) => {
      state.count = action.payload
    },
    reset: (state) => {
      state.order = []
      state.count = 0
    }
  },

})

// Action creators are generated for each case reducer function
export const { addCart, subCart, order, inialityCount, sumarProduct, restarProduct, reset } = orderSlice.actions
//export const { selectCount, selectStatus } = counterSlice.selectors;
export default orderSlice.reducer;