
import { createAppSlice } from '../../createAppSlice'

const initialState = {
    currentTable: null,
    ordersByTable: {}, // { tableId: { activeAccount: number, accounts: [ { id: string, name: string, items: [], activeOrderId: number | null } ] } }
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
                    accounts: [{ id: Date.now().toString(), name: 'Cuenta 1', items: [], activeOrderId: null }]
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
                    items: [],
                    activeOrderId: null
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
        loadOrderIntoAccount: (state, action) => {
            const { tableId, pedido } = action.payload;
            if (!state.ordersByTable[tableId]) {
                state.ordersByTable[tableId] = {
                    activeAccount: 0,
                    accounts: []
                };
            }
            const tableData = state.ordersByTable[tableId];

            // Group items from the pedido by plato.id
            const groupedItemsMap = {};
            pedido.items.forEach(item => {
                const platoId = item.plato.id;
                if (!groupedItemsMap[platoId]) {
                    groupedItemsMap[platoId] = {
                        id: platoId,
                        nombre: item.plato.nombre,
                        precio: item.precioUnitario,
                        image: item.plato.mainImage?.url || item.plato.mainImageId,
                        quantity: 0,
                        notes: [],
                        selectedContornos: []
                    };
                }
                groupedItemsMap[platoId].quantity += item.cantidad;
                // Add the note for each unit in this item row
                const itemNote = item.nota || "";
                for (let i = 0; i < item.cantidad; i++) {
                    groupedItemsMap[platoId].notes.push(itemNote);
                }
            });

            const items = Object.values(groupedItemsMap);

            const existingAccIndex = tableData.accounts.findIndex(acc => acc.activeOrderId === pedido.id);

            if (existingAccIndex > -1) {
                tableData.activeAccount = existingAccIndex;
            } else {
                tableData.accounts.push({
                    id: Date.now().toString(),
                    name: pedido.nombreCliente || `Edición #${pedido.id}`,
                    items: items,
                    activeOrderId: pedido.id
                });
                tableData.activeAccount = tableData.accounts.length - 1;
            }
        },
        addItemToOrder: (state, action) => {
            const { tableId, item } = action.payload;

            if (!state.ordersByTable[tableId]) {
                state.ordersByTable[tableId] = {
                    activeAccount: 0,
                    accounts: [{ id: Date.now().toString(), name: 'Cuenta 1', items: [], activeOrderId: null }]
                };
            }

            const tableData = state.ordersByTable[tableId];
            const activeAcc = tableData.accounts[tableData.activeAccount];

            const existingItemIndex = activeAcc.items.findIndex(
                (i) => i.id === item.id && JSON.stringify(i.selectedContornos) === JSON.stringify(item.selectedContornos)
            );

            if (existingItemIndex > -1) {
                activeAcc.items[existingItemIndex].quantity += 1;
                if (!activeAcc.items[existingItemIndex].notes) {
                    activeAcc.items[existingItemIndex].notes = Array(activeAcc.items[existingItemIndex].quantity - 1).fill("");
                }
                activeAcc.items[existingItemIndex].notes.push("");
            } else {
                activeAcc.items.push({ ...item, quantity: 1, notes: [""] });
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
                    const newQuantity = Math.max(1, item.quantity + amount);
                    if (newQuantity > item.quantity) {
                        // Increase
                        if (!item.notes) item.notes = Array(item.quantity).fill("");
                        for (let i = 0; i < amount; i++) item.notes.push("");
                    } else if (newQuantity < item.quantity) {
                        // Decrease
                        for (let i = 0; i < Math.abs(amount); i++) item.notes.pop();
                    }
                    item.quantity = newQuantity;
                }
            }
        },
        updateItemNote: (state, action) => {
            const { tableId, itemId, noteIndex, note } = action.payload;
            const tableData = state.ordersByTable[tableId];
            if (tableData) {
                const activeAcc = tableData.accounts[tableData.activeAccount];
                const item = activeAcc.items.find(i => i.id === itemId);
                if (item) {
                    if (!item.notes) item.notes = Array(item.quantity).fill("");
                    item.notes[noteIndex] = note;
                }
            }
        },
        clearActiveAccount: (state, action) => {
            const tableId = action.payload;
            const tableData = state.ordersByTable[tableId];
            if (tableData) {
                const activeAcc = tableData.accounts[tableData.activeAccount];
                activeAcc.items = [];
                activeAcc.activeOrderId = null;
            }
        },
        clearTable: (state, action) => {
            const tableId = action.payload;
            delete state.ordersByTable[tableId];
            if (state.currentTable?.id === tableId) {
                state.currentTable = null;
            }
        },
        updateTableStatus: (state, action) => {
            const { tableId, status } = action.payload;
            if (state.currentTable?.id === tableId) {
                state.currentTable.estado = status;
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
    updateItemNote,
    clearActiveAccount,
    loadOrderIntoAccount,
    clearTable,
    updateTableStatus,
    resetWaiter
} = waiterSlice.actions;

export default waiterSlice.reducer;
