import { useAuth } from "../auth/AuthContext";

export function SettingsPage() {
  const { username } = useAuth();
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Settings</h2>
        <p className="mt-1 text-sm text-slate-500">계정 및 시스템 설정</p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-base font-semibold text-slate-900">Account</h3>
        <dl className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Username
            </dt>
            <dd className="mt-1 text-slate-900">{username}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Role
            </dt>
            <dd className="mt-1 text-slate-900">Administrator</dd>
          </div>
        </dl>
      </div>

      <div className="rounded-xl border border-dashed border-slate-300 p-6 text-sm text-slate-500">
        추가 설정 (비밀번호 변경, 권한 관리 등)은 여기에서 구현됩니다.
      </div>
    </div>
  );
}
