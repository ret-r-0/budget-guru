'use client';

import React from 'react';
import { useAppDispatch } from '@/store/hooks';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { addWallet } from '@/features/wallets/walletSlice';
import { Currency } from '@/features/wallets/walletCurrencies';

const AddWalletForm = () => {
  const dispatch = useAppDispatch();

  const router = useRouter();

  const [name, setName] = useState('');
  const [currency, setCurrency] = useState<Currency>('USD');
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
    router.push('/wallets');
  };

  useEffect(() => {
    setIsFormValid(validateForm());
  }, [name, currency]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-teal-500 to-blue-600 text-gray-800 px-6 py-12">
      <section className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-8 border border-amber-200">
        <h1 className="max-w-full font-shadows font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-blue-600 mb-6 text-center mt-5 font-serif text-amber-800">
          Form of Addition of New Wallets
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col space-y-4">
            <label htmlFor="note" className="font-shadows text-black mb-2">
              Name:
            </label>
            <input
              id="note"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-b font-shadows border-black focus:outline-0"
            />
            <label htmlFor="type" className="font-shadows text-black mb-2">
              Currency:
            </label>
            <select
              id="type"
              name="type"
              value={currency}
              onChange={(e) => setCurrency(e.target.value as Currency)}
              className="border-0 border-black font-shadows text-black-800 focus:ring-0 focus:border-none focus:outline-0"
            >
              <option value="USD" className="font-shadows text-black">
                USD
              </option>
              <option value="EUR" className="font-shadows text-black">
                EUR
              </option>
              <option value="GBP" className="font-shadows text-black">
                GBP
              </option>
              <option value="JPY" className="font-shadows text-black">
                JPY
              </option>
              <option value="UAH" className="font-shadows text-black">
                UAH
              </option>
              <option value="CHY" className="font-shadows text-black">
                CHY
              </option>
              <option value="CHF" className="font-shadows text-black">
                CH{' '}
              </option>
            </select>
            <section className="flex justify-center gap-5 mt-25">
              <button
                type="button"
                onClick={() => router.push('/wallets')}
                className="px-6 py-2 bg-gray-500 text-white font-shadows focus:ring-2 hover:ring-2 rounded-xl hover:bg-gray-600 hover:scale-105"
              >
                Cancel
              </button>
              <button
                disabled={!isFormValid}
                type="submit"
                className="px-6 py-2 bg-[#BEFF00] hover:bg-lime-500 font-shadows hover:ring-2 focus:ring-2 focus:outline-none focus:ring-lime-200 dark:focus:ring-lime-800 hover:scale-105 font-semibold rounded-xl shadow-md transition-all duration-200"
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
