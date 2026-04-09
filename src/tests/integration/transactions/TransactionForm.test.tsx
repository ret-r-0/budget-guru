import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TransactionForm from '@/app/transactions/TransactionForm';

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

describe('TransactionForm', () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockDispatch.mockClear();
    walletCurrency = 'USD';
    mockWalletId = 'w1';
  });

  it('renders form with initial values and submits correctly', () => {
    const mockOnSubmit = vi.fn();
    const mockOnCancel = vi.fn();

    render(
      <TransactionForm
        title="Add Transaction"
        submitLabel="Add"
        initialValues={{
          name: 'Salary',
          amount: 1650,
          date: '2026-07-27',
          type: 'income',
          currency: 'USD',
        }}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const submitButton = screen.getByRole('button', { name: /add/i });

    expect((screen.getByLabelText(/name/i) as HTMLInputElement).value).toBe(
      'Salary'
    );
    expect((screen.getByLabelText(/date/i) as HTMLInputElement).value).toBe(
      '2026-07-27'
    );
    expect((screen.getByLabelText(/type/i) as HTMLSelectElement).value).toBe(
      'income'
    );
    expect((screen.getByLabelText(/amount/i) as HTMLInputElement).value).toBe(
      '1650'
    );

    fireEvent.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    expect(mockOnSubmit).toHaveBeenCalledWith({
      name: 'Salary',
      amount: 1650,
      date: '2026-07-27',
      type: 'income',
      currency: 'USD',
    });
  });

  it('checks if name is trimmed correctly', () => {
    const mockOnSubmit = vi.fn();

    render(
      <TransactionForm
        title="Add Transaction"
        submitLabel="Add"
        initialValues={{
          name: ' Salary    ',
          amount: 1650,
          date: '2026-07-27',
          type: 'income',
          currency: 'USD',
        }}
        onSubmit={mockOnSubmit}
        onCancel={vi.fn()}
      />
    );
    const submitButton = screen.getByRole('button', { name: /add/i });

    fireEvent.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith({
      name: 'Salary',
      amount: 1650,
      date: '2026-07-27',
      type: 'income',
      currency: 'USD',
    });
  });

  it('does not add the transaction in case of cancel button', () => {
    const mockOnCancel = vi.fn();

    render(
      <TransactionForm
        title="Add Transaction"
        submitLabel="Add"
        initialValues={{
          name: 'Salary',
          amount: 1650,
          date: '2026-07-27',
          type: 'income',
          currency: 'USD',
        }}
        onSubmit={vi.fn()}
        onCancel={mockOnCancel}
      />
    );
    const cancelButton = screen.getByRole('button', { name: /cancel/i });

    fireEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it('onSubmit is not called unless the form is completely correct', () => {
    const mockOnSubmit = vi.fn();

    render(
      <TransactionForm
        title="Add Transaction"
        submitLabel="Add"
        initialValues={{
          name: '   ',
          amount: 0,
          date: '2026-07-27',
          type: 'income',
          currency: 'USD',
        }}
        onSubmit={mockOnSubmit}
        onCancel={vi.fn()}
      />
    );

    const submitButton = screen.getByRole('button', { name: /add/i });

    expect(submitButton).toBeDisabled();
    expect(mockOnSubmit).toHaveBeenCalledTimes(0);
  });

  it('takes wallets currency but not from initial values', () => {
    walletCurrency = 'JPY';
    const mockOnSubmit = vi.fn();

    render(
      <TransactionForm
        title="Add Transaction"
        submitLabel="Add"
        initialValues={{
          name: 'Salary',
          amount: 1600,
          date: '2026-07-27',
          type: 'income',
          currency: 'USD',
        }}
        onSubmit={mockOnSubmit}
        onCancel={vi.fn()}
      />
    );

    const submitButton = screen.getByRole('button', { name: /add/i });

    fireEvent.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith({
      name: 'Salary',
      amount: 1600,
      date: '2026-07-27',
      type: 'income',
      currency: 'JPY',
    });
  });

  it('passes the change of type of transaction', () => {
    const mockOnSubmit = vi.fn();

    render(
      <TransactionForm
        title="Add Transaction"
        submitLabel="Add"
        initialValues={{
          name: 'Journey',
          amount: 500,
          date: '2026-07-27',
          type: 'income',
          currency: 'USD',
        }}
        onSubmit={mockOnSubmit}
        onCancel={vi.fn()}
      />
    );

    const submitButton = screen.getByRole('button', { name: /add/i });

    fireEvent.change(screen.getByLabelText(/type/i), {
      target: { value: 'expense' },
    });

    fireEvent.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith({
      name: 'Journey',
      amount: 500,
      date: '2026-07-27',
      type: 'expense',
      currency: 'USD',
    });
  });

  it('renders Wallet not found while walletID is not found', () => {
    mockWalletId = 'nonexistent';

    render(
      <TransactionForm
        title="Add Transaction"
        submitLabel="Add"
        initialValues={{
          name: 'Salary',
          amount: 1600,
          date: '2026-07-27',
          type: 'income',
          currency: 'USD',
        }}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />
    );

    expect(screen.getByText(/wallet not found/i)).toBeInTheDocument();
  });

  it('activate the add button even when the initial values are changed', () => {
    render(
      <TransactionForm
        title="Add Transaction"
        submitLabel="Add"
        initialValues={{
          name: '',
          amount: 0,
          date: '2026-07-27',
          type: 'income',
          currency: 'USD',
        }}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />
    );

    const submitButton = screen.getByRole('button', { name: /add/i });

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: 'Bonus' },
    });

    fireEvent.change(screen.getByLabelText(/amount/i), {
      target: { value: '300' },
    });

    fireEvent.change(screen.getByLabelText(/date/i), {
      target: { value: '2026-05-28' },
    });

    expect(submitButton).not.toBeDisabled();
  });

  it('can be rerendered with new initialValues', () => {
    const { rerender } = render(
      <TransactionForm
        title="Add Transaction"
        submitLabel="Add"
        initialValues={{
          name: 'Salary',
          amount: 1600,
          date: '2026-07-27',
          type: 'income',
          currency: 'USD',
        }}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />
    );

    const nameInput = screen.getByLabelText(/name/i) as HTMLInputElement;
    const dateInput = screen.getByLabelText(/date/i) as HTMLInputElement;
    const amountInput = screen.getByLabelText(/amount/i) as HTMLInputElement;

    expect(nameInput.value).toBe('Salary');
    expect(dateInput.value).toBe('2026-07-27');
    expect(amountInput.value).toBe('1600');

    rerender(
      <TransactionForm
        title="Add Transaction"
        submitLabel="Add"
        initialValues={{
          name: 'Bonus',
          amount: 300,
          date: '2026-05-28',
          type: 'income',
          currency: 'JPY',
        }}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />
    );

    expect(nameInput.value).toBe('Bonus');
    expect(dateInput.value).toBe('2026-05-28');
    expect(amountInput.value).toBe('300');
  });
});
