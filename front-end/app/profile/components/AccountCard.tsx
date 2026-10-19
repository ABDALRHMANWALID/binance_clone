"use client";

import type { Account } from "@/app/lib/accountApi";

interface Props {
  user: Account["user"];
  onLogout: () => void;
}

export default function AccountCard({ user, onLogout }: Props) {
  const initial = (user.name ?? user.email).charAt(0).toUpperCase();

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-yellow-400 text-xl font-bold text-slate-950">
            {initial}
          </div>

          <div className="min-w-0">
            <p className="truncate text-lg font-semibold text-white">
              {user.name ?? "No name set"}
            </p>
            <p className="truncate text-sm text-slate-400">{user.email}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-red-400 hover:text-red-400"
        >
          Log out
        </button>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 border-t border-slate-800 pt-5 text-sm sm:grid-cols-2">
        <div>
          <p className="text-xs text-slate-500">Email</p>
          <p className="mt-1 break-all text-white">{user.email}</p>
        </div>

        <div>
          <p className="text-xs text-slate-500">Name</p>
          <p className="mt-1 text-white">{user.name ?? "-"}</p>
        </div>

        {user.createdAt && (
          <div>
            <p className="text-xs text-slate-500">Member since</p>
            <p className="mt-1 text-white">{new Date(user.createdAt).toLocaleDateString()}</p>
          </div>
        )}
      </div>
    </div>
  );
}
