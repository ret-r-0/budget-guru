"use client";

import { useAppSelector } from "@/store/hooks";
import { removeWallet } from "@/features/wallets/walletSlice";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { removeTransactionsByWallet } from "@/features/transactions/transactionSlice";
import {
  selectWallets,
  selectWalletsWithTotals,
} from "@/features/wallets/walletSelectors";
import { useState } from "react";
import ConfirmModal from "@/components/ui/ConfirmModal";

export default function WalletsPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);

  const wallets = useAppSelector(selectWalletsWithTotals);

  const dispatch = useDispatch();

  const handleDeletion = (id: string) => {
    setSelectedId(id);
    setModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedId) {
      dispatch(removeTransactionsByWallet({ walletId: selectedId }));
      dispatch(removeWallet({ id: selectedId }));
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

  return (
    <div className="min-h-screen bg-linear-to-br from-amber-50 to-amber-100 text-gray-800 px-6 py-12">
      <section className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-8 border border-amber-200">
        <h1 className="text-4xl font-extrabold text-amber-800 mb-6 text-center">
          Wallets
        </h1>
        {wallets.length === 0 ? (
          <div>
            <p className="text-lg font-bold text-center">No Wallets</p>
            <div className="flex justify-center">
              <Link href="/wallets/new">
                <button className="px-6 py-3 mt-2.5 bg-amber-400 hover:bg-amber-700 text-white font-semibold rounded-xl shadow-md transition-all duration-200 ">
                  Add New Wallet
                </button>
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <ul>
              <li className="grid grid-cols-4 items-center p-3 bg-gray-500 text-white font-semibold rounded-t-lg">
                <span className="text-left">Name</span>
                <span className="text-center">Currency</span>
                <span className="text-center">Balance</span>
                <span className="text-right">Actions</span>
              </li>
              {wallets.map((wallet) => (
                <li
                  key={wallet.wallet.id}
                  className="grid grid-cols-4 items-center p-3 text-black"
                >
                  <span className="font-semibold text-left">
                    <Link href={`wallets/${wallet.wallet.id}/transactions`}>
                      <button className="text-center underline hover:text-gray-400">
                        {wallet.wallet.name}
                      </button>
                    </Link>
                  </span>
                  <span className="text-center">{wallet.wallet.currency}</span>
                  <span className="text-center">{wallet.balance}</span>
                  <button
                    className="justify-self-end px-3 bg-gray-500 rounded-2xl font-sans tracking-tight transition-transform duration-350 hover:bg-amber-300 hover:scale-110"
                    onClick={() => {
                      handleDeletion(wallet.wallet.id);
                    }}
                  >
                    Delete Wallet
                  </button>
                </li>
              ))}
            </ul>
            <div className="flex justify-center">
              <Link href="/wallets/new">
                <button className="px-6 py-3 mt-6 bg-gray-500 hover:bg-amber-400 text-white font-semibold rounded-xl shadow-md transition-all duration-200 ">
                  Add New Wallet
                </button>
              </Link>
            </div>
          </div>
        )}
      </section>
      <ConfirmModal
        open={isModalOpen}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        title="Delete wallet"
        message="Are you sure you want to delete this wallet? All the transactions in the wallet will be deleted as well"
      />
    </div>
  );
}
