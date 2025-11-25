import reducer, {
  addTransaction,
  removeTransaction,
  editTransaction,
  setTransactions,
  clearAllTransactions,
  TransactionState,
  Transaction,
} from "@/features/transactions/transactionSlice";

const createInitialState = (): TransactionState => ({
  items: [],
});

it("should handle addTransaction", () => {
  const initialState = createInitialState();

  const newTx: Transaction = {
    id: "1",
    type: "income",
    amount: 100,
    categoryId: "salary",
    date: "2025-01-01",
    note: "Test transaction",
  };

  const nextState = reducer(initialState, addTransaction(newTx));

  expect(nextState.items).toHaveLength(1);

  expect(nextState.items[0]).toEqual(newTx);
});

it("should remove a transaction", () => {
  const initialState = createInitialState();

  const newTx1: Transaction = {
    id: "1",
    type: "income",
    amount: 3000,
    categoryId: "salary",
    date: "2025-01-01",
    note: "Test transaction",
  };

  const newTx2: Transaction = {
    id: "2",
    type: "expense",
    amount: 1100,
    categoryId: "trip",
    date: "2025-12-12",
    note: "Test transaction",
  };

  const newTx3: Transaction = {
    id: "3",
    type: "income",
    amount: 200,
    categoryId: "lessons",
    date: "2025-11-11",
    note: "Test transaction",
  };

  const populatedState: TransactionState = {
    ...initialState,
    items: [newTx1, newTx2, newTx3],
  };

  const nextState = reducer(populatedState, removeTransaction({ id: "2" }));

  expect(nextState.items).toHaveLength(2);
  expect(nextState.items.find((tx) => tx.id === "2")).toBeUndefined();
  expect(nextState.items.find((tx) => tx.id === "1")).toEqual(newTx1);
  expect(nextState.items.find((tx) => tx.id === "3")).toEqual(newTx3);
});

it("should edit the particular property of the transaction", () => {
  const initialState = createInitialState();

  const newTx1: Transaction = {
    id: "1",
    type: "income",
    amount: 1400,
    categoryId: "salary",
    date: "2025-01-01",
    note: "Test transaction",
  };

  const newTx2: Transaction = {
    id: "2",
    type: "expense",
    amount: 1100,
    categoryId: "trip",
    date: "2025-12-12",
    note: "Test transaction",
  };

  const populatedState: TransactionState = {
    ...initialState,
    items: [newTx1, newTx2],
  };

  const nextState = reducer(
    populatedState,
    editTransaction({ id: "1", changes: { amount: 2100 } })
  );

  const updatedTx = nextState.items.find((tx) => tx.id === "1");

  expect(updatedTx?.amount).toBe(2100);
  expect(updatedTx?.type).toBe("income");
  expect(updatedTx?.categoryId).toBe("salary");
  expect(updatedTx?.note).toBe("Test transaction");

  expect(nextState.items.find((tx) => tx.id === "2")).toEqual(newTx2);
});

it("should erase all the transactions", () => {
  const initialState = createInitialState();

  const newTx1: Transaction = {
    id: "1",
    type: "income",
    amount: 1400,
    categoryId: "salary",
    date: "2025-01-01",
    note: "Test transaction",
  };

  const newTx2: Transaction = {
    id: "2",
    type: "expense",
    amount: 1100,
    categoryId: "trip",
    date: "2025-12-12",
    note: "Test transaction",
  };

  const populatedState: TransactionState = {
    ...initialState,
    items: [newTx1, newTx2],
  };

  const nextState = reducer(populatedState, clearAllTransactions());

  expect(nextState.items).toEqual([]);
});

it("should not change state if transaction id does not exist", () => {
  const initialState = createInitialState();

  const newTx1: Transaction = {
    id: "1",
    type: "income",
    amount: 1400,
    categoryId: "salary",
    date: "2025-01-01",
  };

  const newTx2: Transaction = {
    id: "2",
    type: "expense",
    amount: 500,
    categoryId: "food",
    date: "2025-01-02",
  };

  const populatedState: TransactionState = {
    ...initialState,
    items: [newTx1, newTx2],
  };

  const nextState = reducer(
    populatedState,
    editTransaction({ id: "999", changes: { amount: 9999 } })
  );

  expect(nextState).toEqual(populatedState);
});

it("should not change state if transaction id does not exist", () => {
  const initialState = createInitialState();

  const newTx1: Transaction = {
    id: "1",
    type: "income",
    amount: 1400,
    categoryId: "salary",
    date: "2025-01-01",
  };

  const newTx2: Transaction = {
    id: "2",
    type: "expense",
    amount: 500,
    categoryId: "food",
    date: "2025-01-02",
  };

  const populatedState: TransactionState = {
    ...initialState,
    items: [newTx1, newTx2],
  };

  const nextState = reducer(populatedState, removeTransaction({ id: "999" }));

  expect(nextState).toEqual(populatedState);
});
