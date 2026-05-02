import { useEffect, useState } from "react";
import { Users, Activity, Database, ArrowUpRight } from "lucide-react";
import { api } from "../lib/api";

type AdminUser = {
  ID: number;
  CreatedAt: string;
  username: string;
};

type Health = { status: string; scope?: string };

export function DashboardPage() {
  const [userCount, setUserCount] = useState<number | null>(null);
  const [health, setHealth] = useState<Health | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([api<AdminUser[]>("/users"), api<Health>("/health")])
      .then(([users, h]) => {
        setUserCount(users.length);
        setHealth(h);
      })
      .catch((err) => setError(String(err.message ?? err)));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Dashboard</h2>
        <p className="mt-1 text-sm text-slate-500">
          시스템 현황 및 주요 지표
        </p>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard
          label="총 사용자"
          value={userCount === null ? "—" : userCount.toLocaleString()}
          icon={<Users className="size-5" />}
          delta="+0% vs last week"
        />
        <StatCard
          label="DB 상태"
          value={health?.status === "ok" ? "Healthy" : "—"}
          icon={<Database className="size-5" />}
          delta={health?.status === "ok" ? "All systems operational" : ""}
          tone={health?.status === "ok" ? "good" : "neutral"}
        />
        <StatCard
          label="API 활성 라우트"
          value="6"
          icon={<Activity className="size-5" />}
          delta="2 admin · 4 public"
        />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-semibold text-slate-900">Quick actions</h3>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <ActionLink href="/users" label="Users 관리로 이동" />
          <ActionLink
            href="http://localhost:8080/health"
            label="Backend 상태 확인 (새 탭)"
            external
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  delta,
  tone = "neutral",
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  delta?: string;
  tone?: "good" | "neutral";
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
          {label}
        </span>
        <div className="flex size-9 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
          {icon}
        </div>
      </div>
      <div className="mt-3 text-2xl font-semibold text-slate-900">{value}</div>
      {delta && (
        <div
          className={`mt-1 text-xs ${
            tone === "good" ? "text-emerald-600" : "text-slate-500"
          }`}
        >
          {delta}
        </div>
      )}
    </div>
  );
}

function ActionLink({
  href,
  label,
  external,
}: {
  href: string;
  label: string;
  external?: boolean;
}) {
  const props = external
    ? { href, target: "_blank", rel: "noreferrer" }
    : { href };
  return (
    <a
      {...props}
      className="flex items-center justify-between rounded-md border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-900 hover:bg-slate-50"
    >
      {label}
      <ArrowUpRight className="size-4 text-slate-400" />
    </a>
  );
}
