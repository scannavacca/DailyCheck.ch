import type { ReactNode } from "react";
import { Container } from "@/components/landing/Container";

type SectionProps = {
  id?: string;
  children: ReactNode;
  className?: string;
  containerClassName?: string;
};

export function Section({ id, children, className = "", containerClassName = "" }: SectionProps) {
  return (
    <section id={id} className={`py-20 md:py-24 ${className}`}>
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}
