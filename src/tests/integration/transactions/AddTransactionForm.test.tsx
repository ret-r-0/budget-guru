import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AddTransactionForm from '@/app/wallets/[walletId]/transactions/new/page';

const mockPush = vi.fn();
let mockWalletId = 'w1';

vi.mock('next/navigation', () => {
  return {
    useRouter: () => ({
      push: mockPush,
    }),
    useParams: () => ({ walletId: mockWalletId }),
  };
});

const mockDispatch = vi.fn();
let walletCurrency = 'USD';

vi.mock('@/store/hooks', () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector(selector: (state: unknown) => unknown) {
    return selector({
      wallets: {
        items: [{ id: 'w1', name: 'Main', currency: walletCurrency }],
      },
    });
  },
}));

describe('AddTransactionForm', () => {
  beforeEach(() => {
    mockDispatch.mockClear();
    mockPush.mockClear();
    mockWalletId = 'w1';
  });

  it('renders form fields and submit button', () => {
    render(<AddTransactionForm />);

    const submitButton = screen.getByRole('button', {
      name: /add transaction/i,
    });

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  it('successfully submits and pushes to transactions list when form is valid', () => {
    render(<AddTransactionForm />);

    const nameInput = screen.getByLabelText(/name/i);
    const dateInput = screen.getByLabelText(/date/i);
    const amountInput = screen.getByLabelText(/amount/i);
    const submitButton = screen.getByRole('button', {
      name: /add transaction/i,
    });

    fireEvent.change(nameInput, { target: { value: 'Salary' } });
    fireEvent.change(dateInput, { target: { value: '2025-12-25' } });
    fireEvent.change(amountInput, { target: { value: '1500' } });

    fireEvent.click(submitButton);

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith('/wallets/w1/transactions/');
  });

  it('successfully submits an expense transaction', () => {
    render(<AddTransactionForm />);

    const nameInput = screen.getByLabelText(/name/i);
    const dateInput = screen.getByLabelText(/date/i);
    const amountInput = screen.getByLabelText(/amount/i);
    const typeSelect = screen.getByLabelText(/type/i);
    const submitButton = screen.getByRole('button', {
      name: /add transaction/i,
    });

    fireEvent.change(nameInput, { target: { value: 'Groceries' } });
    fireEvent.change(dateInput, { target: { value: '2025-12-26' } });
    fireEvent.change(amountInput, { target: { value: '200' } });
    fireEvent.change(typeSelect, { target: { value: 'expense' } });

    fireEvent.click(submitButton);

    expect(mockDispatch).toHaveBeenCalledTimes(1);

    const action = mockDispatch.mock.calls[0][0];

    expect(action.type).toBe('transactions/addTransaction');
    expect(action.payload).toMatchObject({
      type: 'expense',
      amount: 200,
      date: '2025-12-26',
      name: 'Groceries',
      currency: 'USD',
      walletId: 'w1',
    });
  });

  it('disables submit button when form is invalid', () => {
    render(<AddTransactionForm />);

    const submitButton = screen.getByRole('button', {
      name: /add transaction/i,
    });

    expect(submitButton).toBeDisabled();
  });

  it('enables submit button when form is valid', () => {
    render(<AddTransactionForm />);

    const nameInput = screen.getByLabelText(/name/i);
    const dateInput = screen.getByLabelText(/date/i);
    const amountInput = screen.getByLabelText(/amount/i);
    const submitButton = screen.getByRole('button', {
      name: /add transaction/i,
    });

    fireEvent.change(nameInput, { target: { value: 'Salary' } });
    fireEvent.change(dateInput, { target: { value: '2025-12-25' } });
    fireEvent.change(amountInput, { target: { value: '1500' } });

    expect(submitButton).not.toBeDisabled();
  });

  it('calls onCancel when cancel button is clicked', () => {
    render(<AddTransactionForm />);

    const cancelButton = screen.getByRole('button', {
      name: /cancel/i,
    });

    fireEvent.click(cancelButton);

    expect(mockPush).toHaveBeenCalledWith('/wallets/w1/transactions/');
  });

  it('shows wallet not found message if wallet does not exist', () => {
    mockWalletId = 'nonexistent';

    render(<AddTransactionForm />);

    expect(screen.getByText(/wallet not found/i)).toBeInTheDocument();
  });

  it('trims the name of transaction correctly', () => {
    render(<AddTransactionForm />);

    const nameInput = screen.getByLabelText(/name/i);
    const dateInput = screen.getByLabelText(/date/i);
    const amountInput = screen.getByLabelText(/amount/i);
    const submitButton = screen.getByRole('button', {
      name: /add transaction/i,
    });

    fireEvent.change(nameInput, { target: { value: '   Salary   ' } });
    fireEvent.change(dateInput, { target: { value: '2025-12-25' } });
    fireEvent.change(amountInput, { target: { value: '1500' } });

    fireEvent.click(submitButton);

    expect(mockDispatch).toHaveBeenCalledTimes(1);

    const action = mockDispatch.mock.calls[0][0];

    expect(action.type).toBe('transactions/addTransaction');
    expect(action.payload).toMatchObject({
      type: 'income',
      amount: 1500,
      date: '2025-12-25',
      name: 'Salary',
      currency: 'USD',
      walletId: 'w1',
    });
  });

  it('does not do push or dispatch while the form is invalid', () => {
    render(<AddTransactionForm />);

    const nameInput = screen.getByLabelText(/name/i);
    const dateInput = screen.getByLabelText(/date/i);
    const amountInput = screen.getByLabelText(/amount/i);
    const submitButton = screen.getByRole('button', {
      name: /add transaction/i,
    });

    fireEvent.change(nameInput, { target: { value: '' } });
    fireEvent.change(dateInput, { target: { value: '' } });
    fireEvent.change(amountInput, { target: { value: '0' } });

    fireEvent.click(submitButton);

    expect(mockDispatch).toHaveBeenCalledTimes(0);
    expect(mockPush).toHaveBeenCalledTimes(0);
  });

  it('takes wallet currency, rather then from initial value', () => {
    walletCurrency = 'JPY';
    render(<AddTransactionForm />);

    const nameInput = screen.getByLabelText(/name/i);
    const dateInput = screen.getByLabelText(/date/i);
    const amountInput = screen.getByLabelText(/amount/i);
    const submitButton = screen.getByRole('button', {
      name: /add transaction/i,
    });

    fireEvent.change(nameInput, { target: { value: 'Salary' } });
    fireEvent.change(dateInput, { target: { value: '2025-12-25' } });
    fireEvent.change(amountInput, { target: { value: '1500' } });

    fireEvent.click(submitButton);

    expect(mockDispatch).toHaveBeenCalledTimes(1);

    const action = mockDispatch.mock.calls[0][0];

    expect(action.type).toBe('transactions/addTransaction');
    expect(action.payload).toMatchObject({
      type: 'income',
      amount: 1500,
      date: '2025-12-25',
      name: 'Salary',
      currency: 'JPY',
      walletId: 'w1',
    });
  });
});
