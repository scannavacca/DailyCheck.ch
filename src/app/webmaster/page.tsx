"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getDemoLoginRecords } from "@/lib/demoAuth";

type TodoItem = { id: string; text: string; done: boolean; children?: TodoItem[] };
type FinanceByMonth = Record<string, string>;

const TODO_KEY = "webmaster_todos";
const DEMO_LOG_KEY = "demo_login_log";
const FINANCE_KEY = "webmaster_finance";

function formatFileStamp(date: Date) {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}-${pad(
    date.getHours()
  )}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
}

export default function WebmasterPage() {
  const router = useRouter();
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [dragId, setDragId] = useState<string | null>(null);
  const [finance, setFinance] = useState<FinanceByMonth>({});
  const [selectedMonth, setSelectedMonth] = useState("");
  const skipTodosWriteRef = useRef(true);

  const months = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 6 }, (_, index) => {
      const date = new Date(now.getFullYear(), now.getMonth() - index, 1);
      const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      return { value, label: value };
    });
  }, []);

  useEffect(() => {
    const authed = localStorage.getItem("webmaster_authed") === "yes";
    if (!authed) {
      router.push("/webmaster-access");
      return;
    }
    const existing = localStorage.getItem(TODO_KEY);
    if (existing) {
      try {
        const parsed = JSON.parse(existing) as TodoItem[];
        const normalize = (items: TodoItem[]): TodoItem[] =>
          items.map((item) => ({
            done: false,
            children: [],
            ...item,
            children: item.children ? normalize(item.children) : [],
          }));
        setTodos(normalize(parsed));
      } catch {
        setTodos([]);
      }
    }
    const storedFinance = localStorage.getItem(FINANCE_KEY);
    if (storedFinance) {
      try {
        setFinance(JSON.parse(storedFinance));
      } catch {
        setFinance({});
      }
    }
  }, [router]);

  useEffect(() => {
    if (skipTodosWriteRef.current) {
      skipTodosWriteRef.current = false;
      return;
    }
    localStorage.setItem(TODO_KEY, JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    if (!selectedMonth && months.length) {
      setSelectedMonth(months[0].value);
    }
  }, [months, selectedMonth]);

  useEffect(() => {
    localStorage.setItem(FINANCE_KEY, JSON.stringify(finance));
  }, [finance]);

  const records = useMemo(() => getDemoLoginRecords(), []);
  const removeTodoById = (items: TodoItem[], id: string): TodoItem[] =>
    items
      .filter((item) => item.id !== id)
      .map((item) => ({
        ...item,
        children: item.children ? removeTodoById(item.children, id) : [],
      }));

  const findTodoById = (items: TodoItem[], id: string): TodoItem | null => {
    for (const item of items) {
      if (item.id === id) return item;
      if (item.children?.length) {
        const found = findTodoById(item.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const insertChildTodo = (items: TodoItem[], parentId: string, child: TodoItem): TodoItem[] =>
    items.map((item) => {
      if (item.id === parentId) {
        const nextChildren = item.children ? [...item.children, child] : [child];
        return { ...item, children: nextChildren };
      }
      if (item.children?.length) {
        return { ...item, children: insertChildTodo(item.children, parentId, child) };
      }
      return item;
    });

  const handleDrop = (parentId: string) => {
    if (!dragId || dragId === parentId) return;
    const dragged = findTodoById(todos, dragId);
    if (!dragged) return;
    const removed = removeTodoById(todos, dragId);
    const nested = insertChildTodo(removed, parentId, dragged);
    setTodos(nested);
    setDragId(null);
  };
  const currentRevenue = selectedMonth ? finance[selectedMonth] ?? "" : "";

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">Webmaster page</h1>
        <p className="mt-2 text-sm text-gray-700">
          Excel-Ansicht der Demo-Logins (lokal gespeichert).
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            className="rounded-xl bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            onClick={() => {
              const headers = ["First Name", "Timestamp"];
              const rows = records.map((record) => [
                record.firstName,
                new Date(record.timestamp).toISOString(),
              ]);
              const csv = [headers, ...rows]
                .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","))
                .join("\n");
              const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
              const url = URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.href = url;
              link.download = `webmaster-logins-${formatFileStamp(new Date())}.csv`;
              link.click();
              URL.revokeObjectURL(url);
            }}
          >
            Export
          </button>
          <button
            className="rounded-xl border px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
            onClick={() => {
              localStorage.removeItem(DEMO_LOG_KEY);
              window.location.reload();
            }}
          >
            delete
          </button>
        </div>
        <div className="mt-4 overflow-hidden rounded-xl border">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs font-semibold uppercase text-gray-500">
              <tr>
                <th className="px-3 py-2">First Name</th>
                <th className="px-3 py-2">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {records.length === 0 ? (
                <tr>
                  <td className="px-3 py-3 text-sm text-gray-500" colSpan={2}>
                    Noch keine Logins erfasst.
                  </td>
                </tr>
              ) : (
                records.map((record, index) => (
                  <tr key={`${record.firstName}-${record.timestamp}-${index}`} className="border-t">
                    <td className="px-3 py-2">{record.firstName}</td>
                    <td className="px-3 py-2">{new Date(record.timestamp).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Agentic SEO</h2>
        <p className="mt-2 text-sm text-gray-700">
          Interne Planung fuer automatisierte Recherche, strukturierte Landingpages und messbare Updates.
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-700">
          <li>Content-Plan fuer 30-90 Tage</li>
          <li>Drafts fuer Landingpages und FAQ-Module</li>
          <li>On-page Checks mit Fix-Vorschlaegen</li>
          <li>Reporting-Snapshots pro Iteration</li>
          <li>Google Ads Statistic (Inhalt TBD)</li>
        </ul>
      </div>

      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">SEO Hinweise</h2>
        <div className="mt-3 grid gap-4 md:grid-cols-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Growth</div>
            <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-gray-700">
              <li>Fokussierte Landingpages pro Persona und Use-Case</li>
              <li>Interne Verlinkung zwischen Features, FAQ und Pricing</li>
              <li>Regelmaessige Updates mit klaren CTA-Optimierungen</li>
              <li>FAQ-Module mit strukturierten Daten (Schema)</li>
            </ul>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Tracking</div>
            <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-gray-700">
              <li>Search Console fuer Index-Status und Queries</li>
              <li>GA4 Events fuer CTA-Klicks und Formular-Abschluesse</li>
              <li>UTM-Standards fuer Kampagnen und Partner</li>
              <li>Keyword-Rankings und Seiten-Health monatlich pruefen</li>
            </ul>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
              Monetization
            </div>
            <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-gray-700">
              <li>Conversion-nahe Inhalte in Pricing/FAQ verlinken</li>
              <li>Lead-Magnet fuer klinische Templates testen</li>
              <li>Trial/Pilot-CTA pro Region variieren</li>
              <li>Retargeting-Listen fuer Newsletter und Demo</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">DailyCheck.ch-app stats</h2>
        <p className="mt-2 text-sm text-gray-700">
          Placeholder for consent-based app metrics. No patient data is shared unless the user opts in.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {[
            { label: "Consented patients", value: "TBA" },
            { label: "Active protocols", value: "TBA" },
            { label: "Last sync", value: "TBA" },
          ].map((item) => (
            <div key={item.label} className="rounded-xl border bg-gray-50 px-4 py-3">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                {item.label}
              </div>
              <div className="mt-2 text-lg font-semibold text-gray-900">{item.value}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-xs text-gray-500">
          TBA: mood, sleep, drinking, calendar, ABC analysis, sport, nutrition, and other protocol data.
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Finance</h2>
        <p className="mt-2 text-sm text-gray-700">Monatliche Einnahmen (lokal gespeichert).</p>
        <div className="mt-4 grid gap-3 md:grid-cols-[200px_1fr] md:items-center">
          <label className="text-sm font-medium text-gray-700" htmlFor="finance-month">
            Monat
          </label>
          <select
            id="finance-month"
            className="w-full rounded-xl border px-3 py-2 text-sm"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            {months.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>

          <label className="text-sm font-medium text-gray-700" htmlFor="finance-revenue">
            Einnahmen (CHF)
          </label>
          <input
            id="finance-revenue"
            className="w-full rounded-xl border px-3 py-2 text-sm"
            inputMode="decimal"
            placeholder="0"
            value={currentRevenue}
            onChange={(e) => {
              const value = e.target.value;
              if (!selectedMonth) return;
              setFinance((prev) => ({ ...prev, [selectedMonth]: value }));
            }}
          />
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">To-do</h2>
        <div className="mt-3 space-y-3">
          <div className="flex flex-wrap gap-2">
            <input
              className="w-full rounded-xl border px-3 py-2 text-sm md:flex-1"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Neuer Eintrag..."
            />
            <button
              className="rounded-xl border px-3 py-2 text-sm font-semibold hover:bg-gray-50"
              onClick={() => {
                const text = newTodo.trim();
                if (!text) return;
                setTodos((prev) => [...prev, { id: `${Date.now()}`, text, done: false }]);
                setNewTodo("");
              }}
            >
              Add item
            </button>
          </div>

          {todos.map((item) => (
            <div
              key={item.id}
              className="space-y-2"
              draggable
              onDragStart={() => setDragId(item.id)}
              onDragEnd={() => setDragId(null)}
            >
              <div
                className="flex items-center gap-2 rounded-xl border px-3 py-2"
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(item.id)}
              >
                <input
                  type="checkbox"
                  checked={item.done}
                  onChange={(e) =>
                    setTodos((prev) =>
                      prev.map((todo) =>
                        todo.id === item.id ? { ...todo, done: e.target.checked } : todo
                      )
                    )
                  }
                />
                <div className={`flex-1 text-sm ${item.done ? "text-gray-400" : "text-gray-900"}`}>
                  {item.text}
                </div>
                <button
                  className="rounded-lg border px-2 py-1 text-xs font-semibold hover:bg-gray-50"
                  onClick={async () => {
                    await navigator.clipboard.writeText(item.text);
                  }}
                >
                  Copy
                </button>
                <button
                  className="rounded-lg border px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
                  onClick={() => setTodos((prev) => removeTodoById(prev, item.id))}
                  aria-label="Delete"
                >
                  X
                </button>
              </div>
              {item.children?.length ? (
                <div className="space-y-2 pl-6">
                  {item.children.map((child) => (
                    <div
                      key={child.id}
                      className="flex items-center gap-2 rounded-xl border px-3 py-2"
                    >
                      <input
                        type="checkbox"
                        checked={child.done}
                        onChange={(e) =>
                          setTodos((prev) =>
                            prev.map((todo) =>
                              todo.id === item.id
                                ? {
                                    ...todo,
                                    children: (todo.children ?? []).map((entry) =>
                                      entry.id === child.id
                                        ? { ...entry, done: e.target.checked }
                                        : entry
                                    ),
                                  }
                                : todo
                            )
                          )
                        }
                      />
                      <div
                        className={`flex-1 text-sm ${
                          child.done ? "text-gray-400" : "text-gray-900"
                        }`}
                      >
                        {child.text}
                      </div>
                      <button
                        className="rounded-lg border px-2 py-1 text-xs font-semibold hover:bg-gray-50"
                        onClick={async () => {
                          await navigator.clipboard.writeText(child.text);
                        }}
                      >
                        Copy
                      </button>
                      <button
                        className="rounded-lg border px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
                        onClick={() => setTodos((prev) => removeTodoById(prev, child.id))}
                        aria-label="Delete"
                      >
                        X
                      </button>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
