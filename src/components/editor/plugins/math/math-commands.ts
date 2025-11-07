import { createCommand, LexicalCommand } from "lexical";

export type InsertMathPayload = {
  latex: string;
  inline: boolean;
};

export const INSERT_MATH_COMMAND: LexicalCommand<InsertMathPayload> =
  createCommand("INSERT_MATH_COMMAND");