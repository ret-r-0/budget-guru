"use client";

import { useAppSelector } from "@/store/hooks";
import { removeWallet } from "@/features/wallets/walletSlice";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { removeTransactionsByWallet } from "@/features/transactions/transactionSlice";
import { selectWalletsWithTotals } from "@/features/wallets/walletSelectors";
import { use, useEffect, useState } from "react";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { Pencil } from "lucide-react";
import { formatMoney } from "../utils/formatMoney";
import { updateWallet } from "@/features/wallets/walletSlice";
import InfoModal from "@/components/ui/InfoModal";
import RenameModal from "@/components/ui/RenameModal";
import { set } from "zod";
import { Currency } from "@/features/wallets/walletCurrencies";

export default function WalletsPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [walletName, setWalletName] = useState("My Wallet");
  const [isDeleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [isRenameModalOpen, setRenameModalOpen] = useState<boolean>(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState<boolean>(false);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(
    null,
  );
  const [selectedBalance, setSelectedBalance] = useState<number | null>(null);

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
    const trimmedName = (newName ? newName : draftName).trim();
    if (!trimmedName) return;

    dispatch(updateWallet({ id, changes: { name: trimmedName } }));
    setEditingId(null);
    setDraftName("");
  };

  /*   const handleRenameConfirm = (newName: string) => {
    setDraftName(newName);
    if (!isMobile) {
      if (editingId) {
        saveEdit(editingId);
      }
    } else {
      setRenameModalOpen(true); // Для мобильного экрана открываем модалку
    }
    setRenameModalOpen(false);
  }; */

  const cancelEdit = () => {
    setIsEditing(false);
    setRenameModalOpen(false);
    setEditingId(null);
    setDraftName("");
  };

  const handleInfo = (walletId: string) => {
    const balance = wallets.find((w) => w.wallet.id === walletId)?.balance;
    const currency = wallets.find((w) => w.wallet.id === walletId)?.wallet
      .currency;
    setSelectedBalance(balance || null);
    setSelectedCurrency(currency || null);
    setIsInfoModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-teal-500 to-blue-600 text-gray-800 px-6 py-20">
      <section className="max-w-3xl mx-auto bg-gray-200 shadow-lg rounded-2xl p-8 border-2 border-blue-950">
        <h1 className="text-4xl font-shadows font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-blue-600 mb-6 text-center">
          Wallets
        </h1>
        {wallets.length === 0 ? (
          <div>
            <p className="text-lg font-bold font-shadows text-center">
              No Wallets
            </p>
            <div className="flex justify-center">
              <Link href="/wallets/new">
                <button className="px-6 font-shadows py-3 mt-2.5 bg-[#BEFF00] hover:bg-lime-500 rounded-lg transition hover:scale-105  font-semibold rounded-xl focus:ring-2 hover:ring-2 shadow-md transition-all duration-200 ">
                  Add New Wallet
                </button>
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <ul>
              <li className="grid grid-cols-3 sm:grid-cols-4 font-shadows items-center p-3 bg-gradient-to-r from-teal-500 to-blue-600 text-blue-950 font-semibold rounded-t-lg">
                <span className="text-left">Name</span>
                <span className="text-center sm:block hidden">Currency</span>
                <span className="text-center sm:block hidden">Balance</span>

                <span className="text-center sm:text-right sm:hidden block">
                  Info
                </span>
                <span className="text-right">Actions</span>
              </li>
              {wallets.map((wallet) => {
                const id = wallet.wallet.id;
                const isEditing = editingId === id;

                return (
                  <li
                    key={wallet.wallet.id}
                    className="grid grid-cols-3 font-shadows sm:grid-cols-4 items-center p-3 text-black"
                  >
                    <span className="font-semibold text-left">
                      {!isEditing ? (
                        <div className="flex flex-col sm:flex-row sm:gap-2 min-w-0">
                          {/* На мобильных сначала кнопка карандаша, потом название */}
                          {isMobile ? (
                            <>
                              <button
                                className="px-1 py-1 text-sm bg-[#BEFF00] hover:bg-lime-500 rounded-lg transition hover:scale-110 mb-0"
                                onClick={() => startEdit(wallet.wallet.id)}
                                style={{ maxWidth: "20px" }}
                              >
                                <Pencil
                                  className="w-3 h-3 sm:w-4 sm:h-4"
                                  size={16}
                                />
                              </button>
                              <Link
                                href={`wallets/${wallet.wallet.id}/transactions`}
                                className="min-w-0"
                              >
                                <button className="text-center font-shadows text-sm sm:text-base hover:text-gray-400 block max-w-full truncate">
                                  {wallet.wallet.name}
                                </button>
                              </Link>
                            </>
                          ) : (
                            // На десктопе сначала название, потом кнопка карандаша
                            <>
                              <Link
                                href={`wallets/${wallet.wallet.id}/transactions`}
                                className="min-w-0"
                              >
                                <button className="text-center font-shadows text-sm sm:text-base hover:text-gray-400 block max-w-full truncate">
                                  {wallet.wallet.name}
                                </button>
                              </Link>
                              <button
                                className="px-1 py-1 text-sm rounded-lg bg-[#BEFF00] hover:bg-lime-500 transition hover:scale-110"
                                onClick={() => startEdit(wallet.wallet.id)}
                              >
                                <Pencil
                                  className="w-3 h-3 sm:w-4 sm:h-4"
                                  size={16}
                                />
                              </button>
                            </>
                          )}
                        </div>
                      ) : (
                        <div className="flex font-shadows items-center gap-2">
                          {isMobile ? (
                            <RenameModal
                              open={isRenameModalOpen}
                              currentName={wallet.wallet.name}
                              title="Rename Wallet"
                              message="Enter a new name for your wallet"
                              onConfirm={(newName) =>
                                saveEdit(wallet.wallet.id, newName)
                              }
                              onCancel={cancelEdit}
                            />
                          ) : (
                            <input
                              value={draftName}
                              onChange={(e) => setDraftName(e.target.value)}
                              className="w-full font-shadows min-w-[180px] px-3 py-2 border rounded-lg"
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

                    <span className="text-center sm:hidden">
                      <button
                        className="text-gray-600 bg-[#BEFF00] hover:bg-lime-500 p-2 rounded-full font-shadows"
                        onClick={() => handleInfo(wallet.wallet.id)}
                      >
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
                      {isEditing && !isMobile ? (
                        <>
                          <button
                            className="px-2 py-1 text-sm bg-[#BEFF00] hover:bg-lime-500 font-shadows rounded-lg tracking-tight transition-transform duration-350 hover:bg-amber-300 hover:scale-110"
                            onClick={() => saveEdit(wallet.wallet.id)}
                            disabled={!draftName.trim()}
                          >
                            Save
                          </button>
                          <button
                            className="px-2 py-1 text-sm bg-[#BEFF00] hover:bg-lime-500 font-shadows rounded-lg tracking-tight transition-transform duration-350 hover:bg-amber-300 hover:scale-110"
                            onClick={cancelEdit}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          className="justify-self-end px-3 font-shadows text-sm sm:text-[1em] bg-[#BEFF00] hover:bg-lime-500 rounded-2xl font-sans tracking-tight transition-transform duration-350 hover:bg-amber-300 hover:scale-110"
                          onClick={() => handleDeletion(wallet.wallet.id)}
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
                <button className="px-6 py-3 mt-6 bg-[#BEFF00] hover:bg-lime-500 font-shadows hover:ring-2 focus:ring-2 focus:outline-none focus:ring-lime-200 dark:focus:ring-lime-800 font-semibold rounded-xl shadow-md transition-all hover:scale-105 duration-200 ">
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
      <InfoModal
        open={isInfoModalOpen}
        currency={selectedCurrency || "USD"}
        balance={selectedBalance || 0}
        onClose={() => setIsInfoModalOpen(false)}
      />
    </div>
  );
}
