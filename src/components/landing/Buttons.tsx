import Link from "next/link";
import type { ReactNode } from "react";

type ButtonProps = {
  href?: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
};

export function PrimaryButton({ href, children, className = "", onClick }: ButtonProps) {
  const classes = `inline-flex h-12 items-center justify-center rounded-xl bg-[color:#111111] px-5 text-sm font-semibold text-[color:#ffffff] transition hover:bg-[color:#1c1c1c] ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={classes}>
      {children}
    </button>
  );
}

export function SecondaryButton({ href, children, className = "", onClick }: ButtonProps) {
  const classes = `inline-flex h-12 items-center justify-center rounded-xl border bg-white px-5 text-sm font-semibold transition hover:bg-gray-50 ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
