import React from 'react';
import { beforeEach, vi, describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import EditTransactionForm from '@/app/transactions/EditTransactionForm';

const mockPush = vi.fn();
let mockWalletId = 'w1';
let mockTransactionId = 't1';

vi.mock('next/navigation', () => {
  return {
    useRouter: () => ({ push: mockPush }),
    useParams: () => ({
      walletId: mockWalletId,
      transactionId: mockTransactionId,
    }),
  };
});

const mockDispatch = vi.fn();
const walletCurrency = 'USD';

let transactionState = {
  id: mockTransactionId,
  type: 'income',
  amount: 1000,
  date: '2025-01-01',
  name: 'Test transaction',
  walletId: mockWalletId,
};

vi.mock('@/store/hooks', () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector(selector: (state: unknown) => unknown) {
    return selector({
      wallets: {
        items: [{ id: mockWalletId, name: 'Main', currency: walletCurrency }],
      },
      transactions: {
        items: [transactionState],
      },
    });
  },
}));

describe('EditTransactionForm', () => {
  beforeEach(() => {
    mockDispatch.mockClear();
    mockPush.mockClear();
    mockWalletId = 'w1';
    mockTransactionId = 't1';

    transactionState = {
      id: mockTransactionId,
      type: 'income',
      amount: 1600,
      date: '2026-01-07',
      name: 'Salary',
      walletId: mockWalletId,
    };
  });

  it('renders prefilled values for existing transaction', () => {
    render(<EditTransactionForm />);

    const nameInput = screen.getByLabelText(/name/i);
    const dateInput = screen.getByLabelText(/date/i);
    const amountInput = screen.getByLabelText(/amount/i);
    const typeInput = screen.getByLabelText(/type/i);
    const changeButton = screen.getByRole('button', { name: /save changes/i });
    const cancelButton = screen.getByRole('button', { name: /cancel/i });

    expect(
      screen.getByRole('heading', { name: /edit transaction/i })
    ).toBeInTheDocument();
    expect(changeButton).toBeEnabled();
    expect(cancelButton).toBeEnabled();

    expect(nameInput).toHaveValue('Salary');
    expect(amountInput).toHaveValue(1600);
    expect(dateInput).toHaveValue('2026-01-07');
    expect(typeInput).toHaveValue('income');
  });

  it('dispatches editTransaction with id + changes submit', () => {
    render(<EditTransactionForm />);

    const nameInput = screen.getByLabelText(/name/i);
    const dateInput = screen.getByLabelText(/date/i);
    const amountInput = screen.getByLabelText(/amount/i);
    const changeButton = screen.getByRole('button', { name: /save changes/i });

    fireEvent.change(nameInput, { target: { value: 'Return On Investments' } });
    fireEvent.change(amountInput, { target: { value: 5000 } });
    fireEvent.change(dateInput, { target: { value: '2026-12-12' } });

    fireEvent.click(changeButton);

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    const action = mockDispatch.mock.calls[0][0];
    expect(action.type).toBe('transactions/editTransaction');
    expect(action.payload).toMatchObject({
      id: mockTransactionId,
      changes: {
        name: 'Return On Investments',
        amount: 5000,
        date: '2026-12-12',
        type: 'income',
      },
    });

    expect(mockPush).toHaveBeenCalledWith(
      `/wallets/${mockWalletId}/transactions/`
    );
  });

  it('does not dispatch form in case of invalid form', () => {
    render(<EditTransactionForm />);

    const nameInput = screen.getByLabelText(/name/i);
    const amountInput = screen.getByLabelText(/amount/i);
    const changeButton = screen.getByRole('button', { name: /save changes/i });

    fireEvent.change(nameInput, { target: { value: '' } });
    fireEvent.change(amountInput, { target: { value: 0 } });

    fireEvent.click(changeButton);

    expect(mockDispatch).toHaveBeenCalledTimes(0);
    expect(mockPush).toHaveBeenCalledTimes(0);
  });

  it('navigates back on cancel without dispatch', () => {
    render(<EditTransactionForm />);

    const cancelButton = screen.getByRole('button', { name: /cancel/i });

    fireEvent.click(cancelButton);

    expect(mockDispatch).toHaveBeenCalledTimes(0);
    expect(mockPush).toHaveBeenCalledWith(
      `/wallets/${mockWalletId}/transactions/`
    );
  });

  it('does not render form when transaction is missing', () => {
    mockTransactionId = 't2';
    render(<EditTransactionForm />);

    const changeButton = screen.queryByRole('button', {
      name: /save changes/i,
    });
    const cancelButton = screen.queryByRole('button', { name: /cancel/i });

    expect(changeButton).not.toBeInTheDocument();
    expect(cancelButton).not.toBeInTheDocument();
  });

  it('uses current walletId in redirect path on submit and cancel', () => {
    mockWalletId = 'w2';
    mockTransactionId = 't2';
    transactionState = {
      id: 't2',
      type: 'income',
      amount: 900,
      date: '2026-03-01',
      name: 'Bonus',
      walletId: 'w2',
    };

    render(<EditTransactionForm />);

    fireEvent.click(screen.getByRole('button', { name: /save changes/i }));
    expect(mockPush).toHaveBeenCalledWith('/wallets/w2/transactions/');

    mockPush.mockClear();

    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(mockPush).toHaveBeenCalledWith('/wallets/w2/transactions/');
  });

  it('changes expense type and includes it in changes', () => {
    render(<EditTransactionForm />);

    const typeInput = screen.getByLabelText(/type/i);

    const changeButton = screen.getByRole('button', {
      name: /save changes/i,
    });

    fireEvent.change(typeInput, { target: { value: 'expense' } });

    fireEvent.click(changeButton);

    const action = mockDispatch.mock.calls[0][0];

    expect(action.type).toBe('transactions/editTransaction');
    expect(action.payload.id).toBe(mockTransactionId);
    expect(action.payload.changes.type).toBe('expense');
  });
});
