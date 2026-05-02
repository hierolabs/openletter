import { useEffect, useState } from "react";
import { RefreshCw, Plus, Trash2, KeyRound, Pencil, Shield, ShieldCheck } from "lucide-react";
import { api, ApiError } from "../lib/api";
import { useAuth } from "../auth/AuthContext";

type AdminUser = {
  id: number;
  username: string;
  is_super_admin: boolean;
  created_at: string;
};

type ModalState =
  | { type: "create" }
  | { type: "edit"; admin: AdminUser }
  | { type: "reset"; admin: AdminUser }
  | { type: "delete"; admin: AdminUser }
  | null;

export function AdminsPage() {
  const { isSuperAdmin } = useAuth();
  const [admins, setAdmins] = useState<AdminUser[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState<ModalState>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const list = await api<AdminUser[]>("/admins");
      setAdmins(list);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load admins");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Admins</h2>
          <p className="mt-1 text-sm text-slate-500">어드민 계정 목록</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => void load()}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
          >
            <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          {isSuperAdmin && (
            <button
              type="button"
              onClick={() => setModal({ type: "create" })}
              className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
            >
              <Plus className="size-4" />
              Add Admin
            </button>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        {error && (
          <div className="border-b border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Username</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Created</th>
              {isSuperAdmin && <th className="px-4 py-3">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {admins === null ? (
              <SkeletonRows showActions={isSuperAdmin} />
            ) : admins.length === 0 ? (
              <tr>
                <td colSpan={isSuperAdmin ? 5 : 4} className="px-4 py-10 text-center text-slate-500">
                  어드민이 없습니다.
                </td>
              </tr>
            ) : (
              admins.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-mono text-xs text-slate-500">{a.id}</td>
                  <td className="px-4 py-3 font-medium text-slate-900">{a.username}</td>
                  <td className="px-4 py-3">
                    {a.is_super_admin ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                        <ShieldCheck className="size-3" />
                        Super Admin
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                        <Shield className="size-3" />
                        Admin
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {new Date(a.created_at).toLocaleString()}
                  </td>
                  {isSuperAdmin && (
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <ActionButton
                          icon={<Pencil className="size-3.5" />}
                          label="Edit"
                          onClick={() => setModal({ type: "edit", admin: a })}
                        />
                        <ActionButton
                          icon={<KeyRound className="size-3.5" />}
                          label="Reset password"
                          onClick={() => setModal({ type: "reset", admin: a })}
                        />
                        <ActionButton
                          icon={<Trash2 className="size-3.5" />}
                          label="Delete"
                          danger
                          onClick={() => setModal({ type: "delete", admin: a })}
                        />
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modal?.type === "create" && (
        <CreateModal onClose={() => setModal(null)} onDone={() => { setModal(null); void load(); }} />
      )}
      {modal?.type === "edit" && (
        <EditModal admin={modal.admin} onClose={() => setModal(null)} onDone={() => { setModal(null); void load(); }} />
      )}
      {modal?.type === "reset" && (
        <ResetPasswordModal admin={modal.admin} onClose={() => setModal(null)} onDone={() => setModal(null)} />
      )}
      {modal?.type === "delete" && (
        <DeleteModal admin={modal.admin} onClose={() => setModal(null)} onDone={() => { setModal(null); void load(); }} />
      )}
    </div>
  );
}

function ActionButton({
  icon, label, onClick, danger = false,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      title={label}
      onClick={onClick}
      className={`rounded p-1.5 transition ${
        danger
          ? "text-red-400 hover:bg-red-50 hover:text-red-600"
          : "text-slate-400 hover:bg-slate-100 hover:text-slate-700"
      }`}
    >
      {icon}
    </button>
  );
}

function SkeletonRows({ showActions }: { showActions: boolean }) {
  return (
    <>
      {[0, 1, 2].map((i) => (
        <tr key={i}>
          {Array.from({ length: showActions ? 5 : 4 }).map((_, j) => (
            <td key={j} className="px-4 py-4">
              <div className="h-3 w-3/4 animate-pulse rounded bg-slate-100" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

// ── Modals ────────────────────────────────────────────────────────────────────

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h3 className="text-base font-semibold text-slate-900">{title}</h3>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">×</button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-slate-600">{label}</label>
      {children}
    </div>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
    />
  );
}

function SubmitError({ msg }: { msg: string | null }) {
  if (!msg) return null;
  return <p className="text-sm text-red-600">{msg}</p>;
}

function CreateModal({ onClose, onDone }: { onClose: () => void; onDone: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setErr(null);
    try {
      await api("/admins", {
        method: "POST",
        body: JSON.stringify({ username, password, is_super_admin: isSuperAdmin }),
      });
      onDone();
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "Failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal title="Add Admin" onClose={onClose}>
      <form onSubmit={(e) => void submit(e)} className="space-y-4">
        <Field label="Username">
          <Input value={username} onChange={(e) => setUsername(e.target.value)} required minLength={3} />
        </Field>
        <Field label="Password">
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
        </Field>
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" checked={isSuperAdmin} onChange={(e) => setIsSuperAdmin(e.target.checked)} className="rounded" />
          Super Admin
        </label>
        <SubmitError msg={err} />
        <div className="flex justify-end gap-2 pt-1">
          <button type="button" onClick={onClose} className="rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Cancel</button>
          <button type="submit" disabled={submitting} className="rounded-md bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-700 disabled:opacity-60">
            {submitting ? "Creating…" : "Create"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function EditModal({ admin, onClose, onDone }: { admin: AdminUser; onClose: () => void; onDone: () => void }) {
  const [username, setUsername] = useState(admin.username);
  const [isSuperAdmin, setIsSuperAdmin] = useState(admin.is_super_admin);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setErr(null);
    try {
      await api(`/admins/${admin.id}`, {
        method: "PATCH",
        body: JSON.stringify({ username, is_super_admin: isSuperAdmin }),
      });
      onDone();
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "Failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal title="Edit Admin" onClose={onClose}>
      <form onSubmit={(e) => void submit(e)} className="space-y-4">
        <Field label="Username">
          <Input value={username} onChange={(e) => setUsername(e.target.value)} required minLength={3} />
        </Field>
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" checked={isSuperAdmin} onChange={(e) => setIsSuperAdmin(e.target.checked)} className="rounded" />
          Super Admin
        </label>
        <SubmitError msg={err} />
        <div className="flex justify-end gap-2 pt-1">
          <button type="button" onClick={onClose} className="rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Cancel</button>
          <button type="submit" disabled={submitting} className="rounded-md bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-700 disabled:opacity-60">
            {submitting ? "Saving…" : "Save"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function ResetPasswordModal({ admin, onClose, onDone }: { admin: AdminUser; onClose: () => void; onDone: () => void }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setErr("Passwords do not match");
      return;
    }
    setSubmitting(true);
    setErr(null);
    try {
      await api(`/admins/${admin.id}/reset-password`, {
        method: "POST",
        body: JSON.stringify({ password }),
      });
      onDone();
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "Failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal title={`Reset Password — ${admin.username}`} onClose={onClose}>
      <form onSubmit={(e) => void submit(e)} className="space-y-4">
        <Field label="New Password">
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
        </Field>
        <Field label="Confirm Password">
          <Input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required minLength={8} />
        </Field>
        <SubmitError msg={err} />
        <div className="flex justify-end gap-2 pt-1">
          <button type="button" onClick={onClose} className="rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Cancel</button>
          <button type="submit" disabled={submitting} className="rounded-md bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-700 disabled:opacity-60">
            {submitting ? "Resetting…" : "Reset"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function DeleteModal({ admin, onClose, onDone }: { admin: AdminUser; onClose: () => void; onDone: () => void }) {
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function confirm() {
    setSubmitting(true);
    setErr(null);
    try {
      await api(`/admins/${admin.id}`, { method: "DELETE" });
      onDone();
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "Failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal title="Delete Admin" onClose={onClose}>
      <div className="space-y-4">
        <p className="text-sm text-slate-700">
          <strong>{admin.username}</strong> 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
        </p>
        <SubmitError msg={err} />
        <div className="flex justify-end gap-2 pt-1">
          <button type="button" onClick={onClose} className="rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Cancel</button>
          <button type="button" onClick={() => void confirm()} disabled={submitting} className="rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700 disabled:opacity-60">
            {submitting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
