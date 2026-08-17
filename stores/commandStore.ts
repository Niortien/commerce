import { create } from "zustand";
import type { ParsedCommand } from "@/types";

interface CommandState {
  input: string;
  parsed: ParsedCommand | null;
  isOpen: boolean;
  isLoading: boolean;
  lastError: string | null;
  setInput: (input: string) => void;
  setParsed: (parsed: ParsedCommand | null) => void;
  setOpen: (open: boolean) => void;
  setLoading: (loading: boolean) => void;
  setLastError: (error: string | null) => void;
}

export const useCommandStore = create<CommandState>((set) => ({
  input: "",
  parsed: null,
  isOpen: false,
  isLoading: false,
  lastError: null,
  setInput: (input) => set({ input }),
  setParsed: (parsed) => set({ parsed }),
  setOpen: (isOpen) => set({ isOpen }),
  setLoading: (isLoading) => set({ isLoading }),
  setLastError: (lastError) => set({ lastError }),
}));
