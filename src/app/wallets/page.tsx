"use client";

import { useAppSelector } from "@/store/hooks";
import { removeWallet } from "@/features/wallets/walletSlice";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { removeTransactionsByWallet } from "@/features/transactions/transactionSlice";
import { selectWalletsWithTotals } from "@/features/wallets/walletSelectors";
import { useState } from "react";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { Pencil } from "lucide-react";
import { formatMoney } from "../utils/formatMoney";
import { updateWallet } from "@/features/wallets/walletSlice";

export default function WalletsPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState<string>("");

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

  const startEdit = (id: string, currentName: string) => {
    setEditingId(id);
    setDraftName(currentName);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraftName("");
  };

  const saveEdit = (id: string) => {
    const trimmedName = draftName.trim();
    if (!trimmedName) return;

    dispatch(updateWallet({ id, changes: { name: trimmedName } }));
    setEditingId(null);
    setDraftName("");
  };

  /*   if (editingId === selectedId) {
    setEditingId(null);
    setDraftName("");
  } */

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
              {wallets.map((wallet) => {
                const id = wallet.wallet.id;
                const isEditing = editingId === id;

                return (
                  <li
                    key={wallet.wallet.id}
                    className="grid grid-cols-4 items-center p-3 text-black"
                  >
                    <span className="font-semibold text-left">
                      {!isEditing ? (
                        <div className="flex items-center gap-2">
                          <Link
                            href={`wallets/${wallet.wallet.id}/transactions`}
                          >
                            <button className="text-center underline hover:text-gray-400">
                              {wallet.wallet.name}
                            </button>
                          </Link>{" "}
                          <button
                            className="px-1 py-1 text-sm bg-amber-200 rounded-lg hover:bg-amber-300 transition hover:scale-110"
                            onClick={() =>
                              startEdit(wallet.wallet.id, wallet.wallet.name)
                            }
                          >
                            <Pencil className="w-4 h-4" size={16} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <input
                            value={draftName}
                            onChange={(e) => setDraftName(e.target.value)}
                            className="w-full min-w-[180px] px-3 py-2 border rounded-lg"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === "Enter") saveEdit(wallet.wallet.id);
                              if (e.key === "Escape") cancelEdit();
                            }}
                          />
                        </div>
                      )}
                    </span>
                    <span className="text-center">
                      {wallet.wallet.currency}
                    </span>
                    <span className="text-center">
                      {formatMoney(wallet.balance, wallet.wallet.currency)}
                    </span>
                    <div className="justify-self-end flex items-center gap-2">
                      {isEditing ? (
                        <>
                          <button
                            className="px-2 py-1 text-sm bg-gray-500 text-white rounded-lg tracking-tight transition-transform duration-350 hover:bg-amber-300 hover:scale-110"
                            onClick={() => saveEdit(wallet.wallet.id)}
                            disabled={!draftName.trim()}
                          >
                            Save
                          </button>
                          <button
                            className="px-2 py-1 text-sm bg-gray-200 rounded-lg tracking-tight transition-transform duration-350 hover:bg-amber-300 hover:scale-110"
                            onClick={cancelEdit}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          className="justify-self-end px-3 bg-gray-500 rounded-2xl font-sans tracking-tight transition-transform duration-350 hover:bg-amber-300 hover:scale-110"
                          onClick={() => {
                            handleDeletion(wallet.wallet.id);
                          }}
                        >
                          Delete Wallet
                        </button>
                      )}
                    </div>
                  </li>
                );
              })}
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
