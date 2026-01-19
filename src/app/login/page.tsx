"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { loginDemo, primeTutorialIfNeeded } from "@/lib/demoAuth";
import { useLanguage } from "@/components/LanguageProvider";

type Strength = "none" | "weak" | "ok" | "strong";

const copy = {
  de: {
    title: "Anmelden",
    subtitle: "Einfach, sicher und kliniknah.",
    google: "Mit Google fortfahren",
    divider: "oder mit E-Mail",
    emailLabel: "E-Mail",
    passwordLabel: "Passwort",
    passwordHint: "Mindestens 11 Zeichen, eine Zahl und ein Sonderzeichen.",
    strength: { weak: "Schwach", ok: "Gut", strong: "Stark" },
    sendCode: "Code senden",
    verifyTitle: "E-Mail verifizieren",
    verifyBody: "Wir senden einen Code an",
    codeLabel: "Bestätigungscode",
    codeHint: "6-stelliger Code aus der E-Mail",
    verifyButton: "Bestätigen & anmelden",
    resend: "Code erneut senden",
    back: "Zurück",
    forgot: "Passwort vergessen?",
    resetTitle: "Passwort zurücksetzen",
    resetBody: "Wir senden einen Reset-Link an",
    resetButton: "Reset-Link senden",
    resetSent: "Reset-Link wurde gesendet an",
    senderNote: "E-Mails kommen von info@dailycheck.ch (später: noreply@dailycheck.ch).",
    demoNote: "Demo: Verifizierung läuft lokal, E-Mail-Versand ist noch nicht angebunden.",
    errors: {
      emailRequired: "Bitte eine E-Mail-Adresse eingeben.",
      emailInvalid: "Bitte eine gültige E-Mail-Adresse eingeben.",
      passwordRequired: "Bitte ein Passwort eingeben.",
      passwordRules: "Passwort erfüllt die Mindestanforderungen nicht.",
      codeRequired: "Bitte den Code eingeben.",
      codeInvalid: "Code stimmt nicht überein.",
    },
  },
  en: {
    title: "Sign in",
    subtitle: "Simple, secure, clinician-friendly.",
    google: "Continue with Google",
    divider: "or with email",
    emailLabel: "Email",
    passwordLabel: "Password",
    passwordHint: "At least 11 characters, one number, and one special symbol.",
    strength: { weak: "Weak", ok: "Good", strong: "Strong" },
    sendCode: "Send code",
    verifyTitle: "Verify email",
    verifyBody: "We sent a code to",
    codeLabel: "Verification code",
    codeHint: "6-digit code from the email",
    verifyButton: "Verify & sign in",
    resend: "Resend code",
    back: "Back",
    forgot: "Forgot password?",
    resetTitle: "Reset password",
    resetBody: "We will send a reset link to",
    resetButton: "Send reset link",
    resetSent: "Reset link sent to",
    senderNote: "Emails are sent from info@dailycheck.ch (later: noreply@dailycheck.ch).",
    demoNote: "Demo: verification is local; email sending is not connected yet.",
    errors: {
      emailRequired: "Please enter an email address.",
      emailInvalid: "Please enter a valid email address.",
      passwordRequired: "Please enter a password.",
      passwordRules: "Password does not meet the minimum requirements.",
      codeRequired: "Please enter the code.",
      codeInvalid: "Code does not match.",
    },
  },
  it: {
    title: "Accedi",
    subtitle: "Semplice, sicuro e clinico.",
    google: "Continua con Google",
    divider: "oppure con email",
    emailLabel: "Email",
    passwordLabel: "Password",
    passwordHint: "Almeno 11 caratteri, un numero e un simbolo speciale.",
    strength: { weak: "Debole", ok: "Buona", strong: "Forte" },
    sendCode: "Invia codice",
    verifyTitle: "Verifica email",
    verifyBody: "Abbiamo inviato un codice a",
    codeLabel: "Codice di verifica",
    codeHint: "Codice di 6 cifre dalla email",
    verifyButton: "Verifica e accedi",
    resend: "Invia di nuovo",
    back: "Indietro",
    forgot: "Password dimenticata?",
    resetTitle: "Reimposta password",
    resetBody: "Invieremo un link di reset a",
    resetButton: "Invia link di reset",
    resetSent: "Link di reset inviato a",
    senderNote: "Le email sono inviate da info@dailycheck.ch (poi: noreply@dailycheck.ch).",
    demoNote: "Demo: verifica locale; invio email non ancora connesso.",
    errors: {
      emailRequired: "Inserisci un'email.",
      emailInvalid: "Inserisci un'email valida.",
      passwordRequired: "Inserisci una password.",
      passwordRules: "La password non soddisfa i requisiti minimi.",
      codeRequired: "Inserisci il codice.",
      codeInvalid: "Il codice non corrisponde.",
    },
  },
  fr: {
    title: "Connexion",
    subtitle: "Simple, securise et clinique.",
    google: "Continuer avec Google",
    divider: "ou avec email",
    emailLabel: "Email",
    passwordLabel: "Mot de passe",
    passwordHint: "Au moins 11 caracteres, un chiffre et un symbole special.",
    strength: { weak: "Faible", ok: "Correct", strong: "Fort" },
    sendCode: "Envoyer le code",
    verifyTitle: "Verifier l'email",
    verifyBody: "Nous avons envoye un code a",
    codeLabel: "Code de verification",
    codeHint: "Code a 6 chiffres de l'email",
    verifyButton: "Verifier et se connecter",
    resend: "Renvoyer le code",
    back: "Retour",
    forgot: "Mot de passe oublie ?",
    resetTitle: "Reinitialiser le mot de passe",
    resetBody: "Nous enverrons un lien de reinitialisation a",
    resetButton: "Envoyer le lien",
    resetSent: "Lien envoye a",
    senderNote: "Les emails sont envoyes depuis info@dailycheck.ch (plus tard: noreply@dailycheck.ch).",
    demoNote: "Demo : verification locale, envoi email non connecte.",
    errors: {
      emailRequired: "Veuillez saisir un email.",
      emailInvalid: "Veuillez saisir un email valide.",
      passwordRequired: "Veuillez saisir un mot de passe.",
      passwordRules: "Le mot de passe ne respecte pas les exigences minimales.",
      codeRequired: "Veuillez saisir le code.",
      codeInvalid: "Le code ne correspond pas.",
    },
  },
} as const;

function validateEmail(email: string) {
  return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email);
}

function passwordScore(password: string) {
  const lengthOk = password.length >= 11;
  const numberOk = /\\d/.test(password);
  const specialOk = /[^A-Za-z0-9]/.test(password);
  const score = [lengthOk, numberOk, specialOk].filter(Boolean).length;
  const level: Strength = score === 0 ? "none" : score === 1 ? "weak" : score === 2 ? "ok" : "strong";
  return { score, level, lengthOk, numberOk, specialOk };
}

export default function LoginPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const t = copy[language];

  const [view, setView] = useState<"credentials" | "verify" | "reset">("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [sentCode, setSentCode] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);

  const strength = useMemo(() => passwordScore(password), [password]);
  const strengthLabel =
    strength.level === "strong"
      ? t.strength.strong
      : strength.level === "ok"
        ? t.strength.ok
        : strength.level === "weak"
          ? t.strength.weak
          : "";

  function sendVerificationCode() {
    setError(null);
    setNotice(null);

    if (!email.trim()) return setError(t.errors.emailRequired);
    if (!validateEmail(email)) return setError(t.errors.emailInvalid);
    if (!password.trim()) return setError(t.errors.passwordRequired);
    if (strength.score < 3) return setError(t.errors.passwordRules);

    const nextCode = String(Math.floor(100000 + Math.random() * 900000));
    setSentCode(nextCode);
    setCode("");
    setView("verify");
    setNotice(`${t.verifyBody} ${email}. ${t.senderNote} ${t.demoNote}`);
  }

  function verifyCode() {
    setError(null);
    if (!code.trim()) return setError(t.errors.codeRequired);
    if (!sentCode || code.trim() !== sentCode) return setError(t.errors.codeInvalid);

    primeTutorialIfNeeded();
    loginDemo();
    router.push("/app/dashboard");
  }

  function resendCode() {
    sendVerificationCode();
  }

  function handleReset() {
    setError(null);
    setNotice(null);
    if (!email.trim()) return setError(t.errors.emailRequired);
    if (!validateEmail(email)) return setError(t.errors.emailInvalid);
    setResetSent(true);
    setNotice(`${t.resetSent} ${email}. ${t.senderNote} ${t.demoNote}`);
  }

  return (
    <div className="mx-auto max-w-xl space-y-6 rounded-3xl border bg-white/80 p-8 shadow-sm backdrop-blur">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">{t.title}</h1>
        <p className="text-sm text-gray-700">{t.subtitle}</p>
      </div>

      {notice ? (
        <div className="rounded-2xl border bg-gray-50 px-4 py-3 text-xs text-gray-600">{notice}</div>
      ) : null}
      {error ? <div className="text-xs font-semibold text-red-600">{error}</div> : null}

      {view === "credentials" ? (
        <div className="space-y-4">
          <button
            className="flex w-full items-center justify-center gap-2 rounded-2xl border bg-white px-4 py-2 text-sm font-semibold hover:bg-gray-50"
            onClick={() => {
              primeTutorialIfNeeded();
              loginDemo();
              router.push("/app/dashboard");
            }}
          >
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-gray-100 text-xs font-bold">
              G
            </span>
            {t.google}
          </button>

          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className="h-px flex-1 bg-gray-200" />
            {t.divider}
            <span className="h-px flex-1 bg-gray-200" />
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-gray-700">{t.emailLabel}</label>
              <input
                className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                autoComplete="email"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700">{t.passwordLabel}</label>
              <input
                className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                autoComplete="current-password"
              />
              <div className="mt-2 text-xs text-gray-500">{t.passwordHint}</div>
              <div className="mt-2 h-2 w-full rounded-full bg-gray-100">
                <div
                  className={`h-2 rounded-full transition-all ${
                    strength.level === "strong"
                      ? "bg-green-500"
                      : strength.level === "ok"
                        ? "bg-orange-400"
                        : strength.level === "weak"
                          ? "bg-red-500"
                          : "bg-transparent"
                  }`}
                  style={{ width: `${(strength.score / 3) * 100}%` }}
                />
              </div>
              {strengthLabel ? (
                <div className="mt-1 text-xs text-gray-600">{strengthLabel}</div>
              ) : null}
            </div>

            <button
              className="w-full rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              onClick={sendVerificationCode}
            >
              {t.sendCode}
            </button>

            <button
              className="text-xs font-semibold text-gray-600 hover:underline"
              onClick={() => {
                setView("reset");
                setResetSent(false);
                setNotice(null);
                setError(null);
              }}
            >
              {t.forgot}
            </button>
          </div>
        </div>
      ) : null}

      {view === "verify" ? (
        <div className="space-y-4">
          <div className="space-y-1">
            <div className="text-sm font-semibold">{t.verifyTitle}</div>
            <div className="text-xs text-gray-600">
              {t.verifyBody} <span className="font-semibold">{email}</span>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700">{t.codeLabel}</label>
            <input
              className="mt-1 w-full rounded-xl border px-3 py-2 text-sm tracking-widest"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="••••••"
              inputMode="numeric"
            />
            <div className="mt-1 text-xs text-gray-500">{t.codeHint}</div>
          </div>

          <button
            className="w-full rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            onClick={verifyCode}
          >
            {t.verifyButton}
          </button>

          <div className="flex items-center gap-3 text-xs text-gray-500">
            <button className="hover:underline" onClick={resendCode}>
              {t.resend}
            </button>
            <span className="text-gray-300">|</span>
            <button
              className="hover:underline"
              onClick={() => {
                setView("credentials");
                setNotice(null);
                setError(null);
              }}
            >
              {t.back}
            </button>
          </div>
        </div>
      ) : null}

      {view === "reset" ? (
        <div className="space-y-4">
          <div className="space-y-1">
            <div className="text-sm font-semibold">{t.resetTitle}</div>
            <div className="text-xs text-gray-600">
              {t.resetBody} <span className="font-semibold">{email || "..."}</span>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700">{t.emailLabel}</label>
            <input
              className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              autoComplete="email"
            />
          </div>

          <button
            className="w-full rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            onClick={handleReset}
          >
            {t.resetButton}
          </button>

          {resetSent ? <div className="text-xs text-gray-600">{t.senderNote}</div> : null}

          <button
            className="text-xs font-semibold text-gray-600 hover:underline"
            onClick={() => {
              setView("credentials");
              setNotice(null);
              setError(null);
            }}
          >
            {t.back}
          </button>
        </div>
      ) : null}
    </div>
  );
}
