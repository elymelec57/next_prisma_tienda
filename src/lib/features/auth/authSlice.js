import { createAppSlice } from '../../createAppSlice'

const initialState = {
  value: 0,
  auth: {},
  selectedSucursal: { id: 'main', nombre: 'Restaurante Principal' },
  selectedSucursalBuy: { id: 'main', nombre: 'Restaurante Principal' }
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
    auth: (state, action) => {
      state.auth = action.payload
    },
    addSucursalInAuth: (state, action) => {
      if (state.auth) {
        if (!Array.isArray(state.auth.sucursales)) {
          state.auth.sucursales = []
        }
        const existsIndex = state.auth.sucursales.findIndex(s => String(s.id) === String(action.payload.id))
        const sucursalObj = { id: action.payload.id, nombre: action.payload.nombre }
        if (existsIndex >= 0) {
          state.auth.sucursales[existsIndex] = sucursalObj
        } else {
          state.auth.sucursales.push(sucursalObj)
        }
      }
    },
    updateSucursalInAuth: (state, action) => {
      if (state.auth && Array.isArray(state.auth.sucursales)) {
        state.auth.sucursales = state.auth.sucursales.map(s => {
          if (String(s.id) === String(action.payload.id)) {
            return { ...s, nombre: action.payload.nombre }
          }
          return s
        })
      }
      if (state.selectedSucursal && String(state.selectedSucursal.id) === String(action.payload.id)) {
        state.selectedSucursal.nombre = action.payload.nombre
      }
    },
    removeSucursalFromAuth: (state, action) => {
      if (state.auth && Array.isArray(state.auth.sucursales)) {
        state.auth.sucursales = state.auth.sucursales.filter(s => String(s.id) !== String(action.payload))
      }
      if (state.selectedSucursal && String(state.selectedSucursal.id) === String(action.payload)) {
        state.selectedSucursal = { id: 'main', nombre: 'Restaurante Principal' }
      }
    },
    selectedSucursal: (state, action) => {
      state.selectedSucursal = JSON.parse(action.payload)
    },
    selectedSucursalBuy: (state, action) => {
      state.selectedSucursalBuy = JSON.parse(action.payload)
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
export const {
  increment,
  decrement,
  incrementByAmount,
  auth,
  addSucursalInAuth,
  updateSucursalInAuth,
  removeSucursalFromAuth,
  selectedSucursal,
  selectedSucursalBuy
} = authSlice.actions
//export const { selectCount, selectStatus } = counterSlice.selectors;
export default authSlice.reducer;