/* НАДА ДОБАВИТЬ БАЛАНС!!!!!!!!!!!!!!!!*/

"use client";
import React from "react";
import { useAppDispatch } from "@/store/hooks";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { addWallet } from "@/features/wallets/walletSlice";
import { Currency } from "@/features/wallets/walletCurrencies";

const AddWalletForm = () => {
  const dispatch = useAppDispatch();

  const router = useRouter();

  const [name, setName] = useState("");
  const [currency, setCurrency] = useState<Currency>("USD");
  const [isFormValid, setIsFormValid] = useState<boolean>(false);

  const validateForm = () => {
    if (name && currency) {
      return true;
    } else {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    const wallet = {
      id: Date.now().toString(),
      name: name,
      currency: currency,
    };

    dispatch(addWallet(wallet));
    router.push("/wallets");
  };

  useEffect(() => {
    setIsFormValid(validateForm());
  }, [name, currency]);

  return (
    <div className="min-h-screen bg-linear-to-br from-amber-50 to-amber-100 text-gray-800 px-6 py-12">
      <section className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-8 border border-amber-200">
        <h1 className="max-w-full font-bold mb-6 text-center mt-5 font-serif text-amber-800">
          Form of Addition of New Wallets
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col space-y-4">
            <label htmlFor="note" className="font-serif text-amber-800 mb-2">
              Name:
            </label>
            <input
              id="note"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-b border-black focus:outline-0"
            />
            <label htmlFor="type" className="font-serif text-amber-800 mb-2">
              Currency:
            </label>
            <select
              id="type"
              name="type"
              value={currency}
              onChange={(e) => setCurrency(e.target.value as Currency)}
              className="border-0 border-black font-serif text-black-800 focus:ring-0 focus:border-none focus:outline-0"
            >
              <option value="USD" className="font-serif text-amber-800">
                USD
              </option>
              <option value="EUR" className="font-serif text-amber-800">
                EUR
              </option>
              <option value="GBP" className="font-serif text-amber-800">
                GBP
              </option>
              <option value="JPY" className="font-serif text-amber-800">
                JPY
              </option>
              <option value="UAH" className="font-serif text-amber-800">
                UAH
              </option>
              <option value="CHY" className="font-serif text-amber-800">
                CHY
              </option>
              <option value="CHF" className="font-serif text-amber-800">
                CHF
              </option>
            </select>
            <section className="flex justify-center mt-25">
              <button
                disabled={!isFormValid}
                type="submit"
                className="px-6 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors"
              >
                Add the Wallet
              </button>
            </section>
          </div>
        </form>
      </section>
    </div>
  );
};

export default AddWalletForm;
