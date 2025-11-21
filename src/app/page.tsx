import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 bg-white text-gray-900">
      <h1 className="text-2xl font-semibold tracking-tight">
        BudgetGuru Dashboard
      </h1>

      <p className="text-sm text-gray-500">
        This is your development sandbox. Jump to Transactions to preview state.
      </p>

      <Link
        href="/transactions"
        className="inline-flex items-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-100 transition-colors"
      >
        Go to Transactions →
      </Link>
    </main>
  );
}
