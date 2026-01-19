export function isLoggedIn(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("demo_logged_in") === "yes";
}

export function loginDemo() {
  localStorage.setItem("demo_logged_in", "yes");
}

export function logoutDemo() {
  localStorage.removeItem("demo_logged_in");
}

export function setDemoFirstName(name: string) {
  localStorage.setItem("demo_first_name", name.trim());
}

export function getDemoFirstName(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("demo_first_name");
}

type DemoLoginRecord = {
  firstName: string;
  timestamp: string;
};

const DEMO_LOG_KEY = "demo_login_log";
const TOUR_SEEN_KEY = "dailycheck_tour_seen";
const TOUR_STEP_KEY = "dailycheck_tour_step";

export function addDemoLoginRecord(firstName: string) {
  const trimmed = firstName.trim();
  if (!trimmed) return;
  const existing = localStorage.getItem(DEMO_LOG_KEY);
  const parsed: DemoLoginRecord[] = existing ? JSON.parse(existing) : [];
  const next: DemoLoginRecord[] = [
    { firstName: trimmed, timestamp: new Date().toISOString() },
    ...parsed,
  ].slice(0, 200);
  localStorage.setItem(DEMO_LOG_KEY, JSON.stringify(next));
}

export function getDemoLoginRecords(): DemoLoginRecord[] {
  if (typeof window === "undefined") return [];
  const existing = localStorage.getItem(DEMO_LOG_KEY);
  if (!existing) return [];
  try {
    return JSON.parse(existing) as DemoLoginRecord[];
  } catch {
    return [];
  }
}

export function primeTutorialIfNeeded() {
  if (typeof window === "undefined") return;
  const seen = localStorage.getItem(TOUR_SEEN_KEY);
  if (seen === "yes") return;
  localStorage.setItem(TOUR_STEP_KEY, "0");
  localStorage.removeItem(TOUR_SEEN_KEY);
}
