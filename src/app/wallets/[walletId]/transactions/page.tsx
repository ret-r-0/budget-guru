'use client';

import { useAppSelector } from '@/store/hooks';
import {
  removeTransaction,
  Transaction,
} from '@/features/transactions/transactionSlice';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import {
  selectTransactionsByWallet,
  selectTotalsWithFilters,
} from '@/features/transactions/transactionSelectors';
import { useEffect, useState } from 'react';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { useParams } from 'next/navigation';
import { formatMoney } from '@/app/utils/formatMoney';
import { ArrowBigLeft, Trash } from 'lucide-react';
import { is } from 'zod/locales';
import { selectWalletById } from '@/features/wallets/walletSelectors';
import StatsModal from '@/components/ui/StatsModal';

type FilterType = 'all' | 'income' | 'expense';

function filterTransactions(
  transactions: Transaction[],
  options: { filterType: FilterType; fromDate?: string; toDate?: string }
) {
  const { filterType, fromDate, toDate } = options;

  const byType =
    filterType === 'all'
      ? transactions
      : transactions.filter((tx) => tx.type === filterType);

  if (!fromDate && !toDate) return byType;

  return byType.filter((tx) => {
    const txTime = new Date(tx.date).getTime();

    if (fromDate) {
      const fromTime = new Date(fromDate).getTime();
      if (txTime < fromTime) return false;
    }

    if (toDate) {
      const toTime = new Date(toDate).getTime();
      if (txTime > toTime) return false;
    }

    return true;
  });
}

export default function TransactionPage() {
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>(
    'all'
  );
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');

  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState<boolean>(false);
  const [kindOfStat, setKindOfStat] = useState<string>('income');

  const checkScreenSize = () => {
    if (window.innerWidth <= 640) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  };

  useEffect(() => {
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
  }, []);

  const params = useParams<{ walletId: string }>();
  const walletId = params.walletId;

  const wallet = useAppSelector((state) => selectWalletById(state, walletId));

  const transactions = useAppSelector((state) =>
    selectTransactionsByWallet(state, walletId)
  );

  const dispatch = useDispatch();

  const filteredTransactions = filterTransactions(transactions, {
    filterType,
    fromDate,
    toDate,
  });

  const handleStats = (stat: 'income' | 'expense' | 'balance') => {
    setKindOfStat(stat);
    setIsStatsModalOpen(true);
  };

  const cancelStats = () => {
    setIsStatsModalOpen(false);
  };

  const handleDeletion = (id: string) => {
    setSelectedId(id);
    setModalOpen(true);
    /*   dispatch(removeTransaction({ id })); */
  };

  const confirmDelete = () => {
    if (selectedId) {
      dispatch(removeTransaction({ id: selectedId }));
      setModalOpen(false);
      setSelectedId(null);
    } else {
      return;
    }
  };

  const cancelDelete = () => {
    setModalOpen(false);
    setSelectedId(null);
  };

  /*   if (transactions === null) {
    return <p>Loading...</p>;
  } */

  const { income, expense, balance } = useAppSelector((state) =>
    selectTotalsWithFilters(state, {
      from: fromDate || undefined,
      to: toDate || undefined,
      filterType,
      walletId,
    })
  );

  return (
    <div className="min-h-screen bg-gradient-to-r from-teal-500 to-blue-600 text-gray-800 px-6 py-20">
      <section className="max-w-3xl mx-auto flex flex-wrap justify-center bg-gray-200 shadow-lg rounded-2xl p-8 border-2 border-blue-950">
        <div className="w-full flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between mb-6">
          <div className="text-center sm:w-1/3">
            <Link href={`/wallets/`}>
              <button className="flex mr-0 bg-[#BEFF00] hover:bg-lime-500 px-5 py-3 text-md rounded-lg hover:ring-2 focus:ring-2 font-shadows focus:ring-lime-200 dark:focus:ring-lime-800 font-semibold shadow-md transition-all duration-300 transform hover:scale-105">
                <ArrowBigLeft className="w-4 h-4 sm:hidden" />
                <span className="hidden sm:block">Back To Wallets</span>
              </button>
            </Link>
          </div>
          {/* <Link href={`/wallets/`}>
            <button className="bg-[#BEFF00] hover:bg-lime-500 px-4 py-2 mb-4 text-md rounded-lg hover:ring-2 focus:ring-2 font-shadows focus:ring-lime-200 dark:focus:ring-lime-800 font-semibold shadow-md transition-all duration-300 transform hover:scale-105">
              <ArrowBigLeft className="w-5 h-5 sm:w-4 sm:h-4" />
            </button>
          </Link> */}
          <div className="text-center sm:w-1/3">
            <h1 className="flex-1 text-2xl sm:text-4xl font-shadows font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-blue-600 text-center">
              Transactions
            </h1>
          </div>
          <div className="hidden sm:block sm:w-1/3"></div>
        </div>

        {transactions.length === 0 ? (
          <div>
            <div>
              <p className="text-lg font-shadows font-bold text-center">
                No Transactions
              </p>
              <div className="flex justify-center">
                <Link href={`/wallets/${walletId}/transactions/new`}>
                  <button className="px-3 py-3 mt-6 sm:px-6 bg-[#BEFF00] hover:bg-lime-500 font-shadows hover:ring-2 focus:ring-2 focus:outline-none focus:ring-lime-200 dark:focus:ring-lime-800 font-semibold rounded-xl shadow-md transition-all hover:scale-105 duration-200 ">
                    Add New Transaction
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-[105%]">
            <div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-end mb-4">
                {/* dates */}
                <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:gap-2 sm:mr-6 w-full sm:w-auto">
                  <div className="flex flex-col">
                    <label className="text-xs sm:text-sm font-shadows text-gray-600">
                      From:
                    </label>
                    <input
                      type="date"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                      className="w-full px-2 py-2 sm:px-3 sm:py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="text-xs sm:text-sm font-shadows text-gray-600">
                      To:
                    </label>
                    <input
                      type="date"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                      className="w-full px-2 py-2 sm:px-3 sm:py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                  </div>
                </div>

                {/* select */}
                <select
                  value={filterType}
                  onChange={(e) =>
                    setFilterType(
                      e.target.value as 'all' | 'income' | 'expense'
                    )
                  }
                  className="w-full sm:w-auto px-2 py-2 sm:px-4 sm:py-2 rounded-lg border text-sm font-shadows border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
                >
                  <option value="all">All</option>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>
              <ul>
                <li
                  className={`grid ${isMobile ? 'grid-cols-4' : 'grid-cols-5'} items-center p-3  font-shadows items-center bg-gradient-to-r from-teal-500 to-blue-600 text-blue-950 font-semibold rounded-t-lg`}
                >
                  <span className="text-left hidden sm:block">Type</span>
                  <span className={`text-center text-sm sm:text-l`}>
                    Subject
                  </span>
                  <span className="text-center text-sm sm:text-l">Amount</span>
                  <span className="text-center text-sm sm:text-l">Date</span>
                  <span className="text-right text-sm sm:text-l">Actions</span>
                </li>
                {filteredTransactions.map((tx) => (
                  <li
                    key={tx.id}
                    className={`grid ${isMobile ? 'grid-cols-4' : 'sm:grid-cols-5'}  font-shadows items-center p-3 text-white ${
                      tx.type === 'income' ? 'bg-[#77EB2C]' : 'bg-[#F44336]'
                    }`}
                  >
                    <span className="font-semibold text-left hidden sm:block">
                      {tx.type}
                    </span>
                    <span className="text-center">
                      <Link
                        href={`/wallets/${walletId}/transactions/${tx.id}/edit`}
                      >
                        <button className="text-center underline hover:text-gray-400">
                          {tx.name}
                        </button>
                      </Link>
                    </span>
                    <span className="text-center">
                      {/*   {formatMoney(tx.amount, wallet.currency)} */}
                      {tx.amount}
                    </span>
                    <span className="text-center text-sm">{tx.date}</span>
                    {isMobile ? (
                      <button
                        className="justify-self-end text-xs sm:text-lg px-3 bg-gray-500 rounded-2xl font-shadows tracking-tight transition-transform duration-350 bg-gradient-to-r hover:from-teal-500 hover:to-blue-600 hover:scale-110"
                        onClick={() => {
                          handleDeletion(tx.id);
                        }}
                      >
                        <Trash className="w-5 h-5 sm:w-4 sm:h-4" />
                      </button>
                    ) : (
                      <button
                        className="justify-self-end text-xs sm:text-base px-3 bg-gray-500 rounded-2xl font-shadows tracking-tight transition-transform duration-350 bg-gradient-to-r hover:from-teal-500 hover:to-blue-600 hover:scale-110"
                        onClick={() => {
                          handleDeletion(tx.id);
                        }}
                      >
                        Delete Transaction
                      </button>
                    )}
                  </li>
                ))}
              </ul>
              {!isMobile ? (
                <div className="flex justify-between mt-6 px-5 gap-x-4">
                  <div className="flex gap-y-1 flex-col flex-1 bg-[#77EB2C] rounded-full border-2">
                    <p className="text-sm font-medium font-shadows text-center">
                      Income:
                    </p>
                    <p className="text-xl font-bold font-shadows text-center">
                      {income.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex flex-col gap-y-1 flex-1 bg-[#F44336] rounded-full border-2">
                    <p className="text-sm font-medium font-shadows text-center">
                      Expense:
                    </p>
                    <p className="text-xl font-bold font-shadows text-center">
                      {expense.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex flex-col gap-y-1 flex-1 bg-gradient-to-r from-teal-500 to-blue-600 rounded-full border-2">
                    <p className="text-sm font-medium font-shadows text-center">
                      Total:
                    </p>
                    <p className="text-xl font-bold font-shadows text-center">
                      {balance.toFixed(2)}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between mt-6 px-5 gap-x-4">
                  <div className="flex flex-col flex-1 bg-[#77EB2C] rounded-full border-2 h-full">
                    <Link href="#" onClick={() => handleStats('income')}>
                      <button className="text-sm font-medium font-shadows text-center flex items-center justify-center w-full h-full">
                        Income
                      </button>
                    </Link>
                  </div>
                  <div className="flex flex-col flex-1 bg-[#F44336] rounded-full border-2 h-full">
                    <Link href="#" onClick={() => handleStats('expense')}>
                      <button className="text-sm font-medium font-shadows text-center flex items-center justify-center w-full h-full">
                        Expense
                      </button>
                    </Link>
                  </div>
                  <div className="flex flex-col flex-1 bg-gradient-to-r from-teal-500 to-blue-600 rounded-full border-2 h-full">
                    <Link href="#" onClick={() => handleStats('balance')}>
                      <button className="text-sm font-medium font-shadows text-center flex items-center justify-center w-full h-full">
                        Total
                      </button>
                    </Link>
                  </div>
                </div>
              )}

              <div className="flex justify-center">
                <Link href={`/wallets/${walletId}/transactions/new`}>
                  <button className="px-6 py-3 mt-8 bg-[#BEFF00] hover:bg-lime-500 font-shadows hover:ring-2 focus:ring-2 focus:outline-none focus:ring-lime-200 dark:focus:ring-lime-800 font-semibold rounded-xl shadow-md transition-all hover:scale-105 duration-200 ">
                    Add New Transaction
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </section>
      <ConfirmModal
        open={isModalOpen}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        title="Delete transaction"
        message="Are you sure you want to delete this transaction?"
      />
      <StatsModal
        open={isStatsModalOpen}
        title={
          kindOfStat === 'income'
            ? 'Total Income'
            : kindOfStat === 'expense'
              ? 'Total Expense'
              : 'Total Balance'
        }
        currency={wallet?.currency || 'USD'}
        sum={
          kindOfStat === 'income'
            ? income
            : kindOfStat === 'expense'
              ? expense
              : balance
        }
        onClose={cancelStats}
      />
    </div>
  );
}
