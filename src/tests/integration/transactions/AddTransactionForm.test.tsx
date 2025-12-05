import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import AddTransactionForm from "@/app/transactions/new/page";

const mockPush = vi.fn();
vi.mock("next/navigation", () => {
  return {
    useRouter: () => ({
      push: mockPush,
    }),
  };
});

const mockDispatch = vi.fn();
vi.mock("@/store/hooks", () => ({
  useAppDispatch: () => mockDispatch,
}));

describe("AddTransactionForm", () => {
  beforeEach(() => {
    mockDispatch.mockClear();
  });

  it("disables submit button when form is invalid", () => {
    render(<AddTransactionForm />);

    const [submitButton] = screen.getAllByRole("button", {
      name: /add the transaction/i,
    });

    expect(submitButton).toBeDisabled();
  });

  it("enables submit button when form is valid", () => {
    render(<AddTransactionForm />);

    const noteInput = screen.getByLabelText(/note/i);
    const dateInput = screen.getByLabelText(/date/i);
    const amountInput = screen.getByLabelText(/amount/i);
    const [submitButton] = screen.getAllByRole("button", {
      name: /add the transaction/i,
    });

    fireEvent.change(noteInput, { target: { value: "Salary" } });
    fireEvent.change(dateInput, { target: { value: "2025-12-25" } });
    fireEvent.change(amountInput, { target: { value: "1500" } });

    expect(submitButton).not.toBeDisabled();
  });

  it("dispatches addTransaction with correct payload on submit", () => {
    render(<AddTransactionForm />);

    const noteInput = screen.getByLabelText(/note/i);
    const dateInput = screen.getByLabelText(/date/i);
    const amountInput = screen.getByLabelText(/amount/i);
    const [submitButton] = screen.getAllByRole("button", {
      name: /add the transaction/i,
    });

    fireEvent.change(noteInput, { target: { value: "Salary" } });
    fireEvent.change(dateInput, { target: { value: "2025-12-25" } });
    fireEvent.change(amountInput, { target: { value: "1500" } });

    fireEvent.click(submitButton);

    expect(mockDispatch).toHaveBeenCalledTimes(1);

    const action = mockDispatch.mock.calls[0][0];

    expect(action.type).toBe("transactions/addTransaction");
    expect(action.payload).toMatchObject({
      type: "income",
      amount: 1500,
      categoryId: "default",
      date: "2025-12-25",
      note: "Salary",
    });
  });
});
