import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 bg-[#0A4C68]">
      <h1 className="text-5xl font-semibold tracking-tight bg-clip-text text-center text-transparent bg-gradient-to-r from-teal-500 to-blue-600">
        BudgetGuru Dashboard
      </h1>

      <p className="w-[80%] text-md text-center bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-blue-600">
        Jump to Wallets to preview state.
      </p>

      <Link href="/wallets">
        <div className="group inline-flex">
          <button className="relative inline-flex items-center justify-center p-2 text-md overflow-hidden font-medium text-heading rounded-3xl group bg-gradient-to-br group-hover:from-teal-100 group-hover:to-lime-500 dark:text-white dark:hover:text-heading focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-lime-800 transition-all duration-500 ease-in-out hover:scale-105">
            <span className="relative px-4 py-2.5 transition-all ease-in-out duration-500 bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-blue-600 bg-neutral-primary-soft rounded-base group-hover:bg-transparent group-hover:dark:bg-transparent leading-5 ">
              Go to Wallets →
            </span>
          </button>
        </div>
      </Link>
    </main>
  );
}
