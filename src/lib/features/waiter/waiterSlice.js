
import { createAppSlice } from '../../createAppSlice'

const initialState = {
    currentTable: null,
    ordersByTable: {}, // { tableId: { activeAccount: number, accounts: [ { id: string, name: string, items: [] } ] } }
}

export const waiterSlice = createAppSlice({
    name: 'waiter',
    initialState,
    reducers: {
        setCurrentTable: (state, action) => {
            state.currentTable = action.payload
            if (action.payload && !state.ordersByTable[action.payload.id]) {
                state.ordersByTable[action.payload.id] = {
                    activeAccount: 0,
                    accounts: [{ id: Date.now().toString(), name: 'Cuenta 1', items: [] }]
                }
            }
        },
        addAccountToTable: (state, action) => {
            const tableId = action.payload;
            if (state.ordersByTable[tableId]) {
                const count = state.ordersByTable[tableId].accounts.length;
                state.ordersByTable[tableId].accounts.push({
                    id: Date.now().toString(),
                    name: `Cuenta ${count + 1}`,
                    items: []
                });
                state.ordersByTable[tableId].activeAccount = count;
            }
        },
        removeAccountFromTable: (state, action) => {
            const { tableId, accountIndex } = action.payload;
            const tableData = state.ordersByTable[tableId];
            if (tableData && tableData.accounts.length > 1) {
                tableData.accounts.splice(accountIndex, 1);
                tableData.activeAccount = Math.max(0, tableData.activeAccount - 1);
            }
        },
        setActiveAccount: (state, action) => {
            const { tableId, accountIndex } = action.payload;
            if (state.ordersByTable[tableId]) {
                state.ordersByTable[tableId].activeAccount = accountIndex;
            }
        },
        updateAccountName: (state, action) => {
            const { tableId, accountIndex, name } = action.payload;
            const tableData = state.ordersByTable[tableId];
            if (tableData && tableData.accounts[accountIndex]) {
                tableData.accounts[accountIndex].name = name;
            }
        },
        addItemToOrder: (state, action) => {
            const { tableId, item } = action.payload;

            if (!state.ordersByTable[tableId]) {
                state.ordersByTable[tableId] = {
                    activeAccount: 0,
                    accounts: [{ id: Date.now().toString(), name: 'Cuenta 1', items: [] }]
                };
            }

            const tableData = state.ordersByTable[tableId];
            const activeAcc = tableData.accounts[tableData.activeAccount];

            const existingItemIndex = activeAcc.items.findIndex(
                (i) => i.id === item.id && JSON.stringify(i.selectedContornos) === JSON.stringify(item.selectedContornos)
            );

            if (existingItemIndex > -1) {
                activeAcc.items[existingItemIndex].quantity += 1;
            } else {
                activeAcc.items.push({ ...item, quantity: 1 });
            }
        },
        removeItemFromOrder: (state, action) => {
            const { tableId, itemId } = action.payload;
            const tableData = state.ordersByTable[tableId];
            if (tableData) {
                const activeAcc = tableData.accounts[tableData.activeAccount];
                activeAcc.items = activeAcc.items.filter(i => i.id !== itemId);
            }
        },
        updateItemQuantity: (state, action) => {
            const { tableId, itemId, amount } = action.payload;
            const tableData = state.ordersByTable[tableId];
            if (tableData) {
                const activeAcc = tableData.accounts[tableData.activeAccount];
                const item = activeAcc.items.find(i => i.id === itemId);
                if (item) {
                    item.quantity = Math.max(1, item.quantity + amount);
                }
            }
        },
        clearActiveAccount: (state, action) => {
            const tableId = action.payload;
            const tableData = state.ordersByTable[tableId];
            if (tableData) {
                const activeAcc = tableData.accounts[tableData.activeAccount];
                activeAcc.items = [];

                // Si solo hay una cuenta y está vacía, podríamos cerrar la mesa, 
                // pero mejor dejar que el UI decida.
            }
        },
        clearTable: (state, action) => {
            const tableId = action.payload;
            delete state.ordersByTable[tableId];
            if (state.currentTable?.id === tableId) {
                state.currentTable = null;
            }
        },
        resetWaiter: (state) => {
            state.currentTable = null;
            state.ordersByTable = {};
        }
    }
})

export const {
    setCurrentTable,
    addAccountToTable,
    removeAccountFromTable,
    setActiveAccount,
    updateAccountName,
    addItemToOrder,
    removeItemFromOrder,
    updateItemQuantity,
    clearActiveAccount,
    clearTable,
    resetWaiter
} = waiterSlice.actions;

export default waiterSlice.reducer;
