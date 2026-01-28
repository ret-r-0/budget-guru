"use client";

import { useAppSelector } from "@/store/hooks";
import { removeWallet } from "@/features/wallets/walletSlice";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { removeTransactionsByWallet } from "@/features/transactions/transactionSlice";
import { selectWalletsWithTotals } from "@/features/wallets/walletSelectors";
import { useEffect, useState } from "react";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { Pencil } from "lucide-react";
import { formatMoney } from "../utils/formatMoney";
import { updateWallet } from "@/features/wallets/walletSlice";
import RenameModal from "@/components/ui/RenameModal";
import { set } from "zod";

export default function WalletsPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [walletName, setWalletName] = useState("My Wallet");
  const [isDeleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [isRenameModalOpen, setRenameModalOpen] = useState<boolean>(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [draftName, setDraftName] = useState<string>("");

  const [isMobile, setIsMobile] = useState<boolean>(false);

  const checkScreenSize = () => {
    if (window.innerWidth <= 640) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  };

  useEffect(() => {
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  const wallets = useAppSelector(selectWalletsWithTotals);
  const dispatch = useDispatch();

  const handleDeletion = (id: string) => {
    setSelectedId(id);
    setDeleteModalOpen(true);
  };

  const handleRename = (newName: string) => {
    if (newName.trim()) {
      setWalletName(newName);
      setRenameModalOpen(false);
    }
  };

  const confirmDelete = () => {
    if (selectedId) {
      dispatch(removeTransactionsByWallet({ walletId: selectedId }));
      dispatch(removeWallet({ id: selectedId }));
      setDeleteModalOpen(false);
      setSelectedId(null);
    } else {
      return;
    }
  };

  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setSelectedId(null);
  };

  const startEdit = (id: string) => {
    setEditingId(id); // Устанавливаем кошелек для редактирования
    setIsEditing(true);
    setDraftName(
      wallets.find((wallet) => wallet.wallet.id === id)?.wallet.name || "",
    );
    if (isMobile) {
      setRenameModalOpen(true); // Модалка на мобильном
    }
  };

  const saveEdit = (id: string, newName?: string) => {
    const trimmedName = draftName.trim();
    if (newName) {
      const trimmedName = newName.trim();
    }

    if (!trimmedName) return;

    dispatch(updateWallet({ id, changes: { name: trimmedName } }));
    setEditingId(null);
    setDraftName("");
  };

  const handleRenameConfirm = (newName: string) => {
    setDraftName(newName);
    if (!isMobile) {
      // Если это не мобильный экран, сохраняем сразу
      if (editingId) {
        saveEdit(editingId);
      }
    } else {
      // Для мобильного экрана открываем модалку, если нужно
      setRenameModalOpen(true);
    }
    setRenameModalOpen(false);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setRenameModalOpen(false);
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
              <li className="grid grid-cols-3 sm:grid-cols-4 items-center p-3 bg-gray-500 text-white font-semibold rounded-t-lg">
                <span className="text-left">Name</span>
                <span className="text-center sm:block hidden">Currency</span>
                <span className="text-center sm:block hidden">Balance</span>
                <span className="text-center sm:text-right">Actions</span>
                <span className="text-right sm:hidden block">Info</span>
              </li>
              {wallets.map((wallet) => {
                const id = wallet.wallet.id;
                const isEditing = editingId === id;

                return (
                  <li
                    key={wallet.wallet.id}
                    className="grid grid-cols-3 sm:grid-cols-4 items-center p-3 text-black"
                  >
                    {
                      <span className="font-semibold text-left">
                        {!isEditing ? (
                          <div className="flex items-center gap-2">
                            <Link
                              href={`wallets/${wallet.wallet.id}/transactions`}
                            >
                              <button className="text-center text-sm sm:text-lg underline hover:text-gray-400">
                                {wallet.wallet.name}
                              </button>
                            </Link>{" "}
                            <button
                              className="px-1 py-1 text-sm bg-amber-200 rounded-lg hover:bg-amber-300 transition hover:scale-110"
                              onClick={() => startEdit(wallet.wallet.id)}
                            >
                              <Pencil
                                className="w-3 h-3 sm:w-4 sm:h-4"
                                size={16}
                              />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            {isMobile ? (
                              <RenameModal
                                open={isRenameModalOpen}
                                currentName={wallet.wallet.name}
                                title="Rename Wallet"
                                message="Enter a new name for your wallet"
                                onConfirm={(newName) => {
                                  saveEdit(wallet.wallet.id, newName);
                                }}
                                onCancel={cancelEdit}
                              />
                            ) : (
                              <input
                                value={draftName}
                                onChange={(e) => setDraftName(e.target.value)}
                                className="w-full min-w-[180px] px-3 py-2 border rounded-lg"
                                autoFocus
                                onKeyDown={(e) => {
                                  if (e.key === "Enter")
                                    saveEdit(wallet.wallet.id);
                                  if (e.key === "Escape") cancelEdit();
                                }}
                              />
                            )}
                          </div>
                        )}
                      </span>
                    }

                    <span className="text-center sm:hidden">
                      <button className="text-gray-600 bg-gray-200 p-2 rounded-full hover:bg-gray-300">
                        i
                      </button>
                    </span>
                    <span className="text-center sm:block hidden">
                      {wallet.wallet.currency}
                    </span>
                    <span className="text-center sm:block hidden">
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
        open={isDeleteModalOpen}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        title="Delete wallet"
        message="Are you sure you want to delete this wallet? All the transactions in the wallet will be deleted as well"
      />
    </div>
  );
}
