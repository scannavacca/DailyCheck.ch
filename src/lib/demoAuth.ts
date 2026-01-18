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
