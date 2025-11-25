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
