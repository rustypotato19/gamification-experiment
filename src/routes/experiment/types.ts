import type { ReactNode } from "react";

export type Step = {
  title: ReactNode;
  text: ReactNode;
  isFinal?: boolean;
};

export type Choice = "a" | "b" | "c";

export type Question = {
  id: number;
  prompt: string;
  options: {
    a: string;
    b: string;
    c: string;
  };
  correct: Choice;
  image?: string;
};
