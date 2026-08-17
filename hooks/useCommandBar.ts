"use client";

import { useCallback, useEffect, useMemo } from "react";
import { parseCommand } from "@/lib/commandParser";
import { useCommandStore } from "@/stores/commandStore";

const PARSER_DEBOUNCE_MS = 80;

export function useCommandBar() {
  const input = useCommandStore((state) => state.input);
  const parsed = useCommandStore((state) => state.parsed);
  const isOpen = useCommandStore((state) => state.isOpen);
  const isLoading = useCommandStore((state) => state.isLoading);
  const lastError = useCommandStore((state) => state.lastError);
  const setInput = useCommandStore((state) => state.setInput);
  const setParsed = useCommandStore((state) => state.setParsed);
  const setOpen = useCommandStore((state) => state.setOpen);

  const parseInput = useCallback(
    (value: string) => {
      setParsed(parseCommand(value));
    },
    [setParsed]
  );

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      parseInput(input);
    }, PARSER_DEBOUNCE_MS);

    return () => window.clearTimeout(timeout);
  }, [input, parseInput]);

  useEffect(() => {
    function onShortcut(event: KeyboardEvent): void {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(!isOpen);
      }
    }

    window.addEventListener("keydown", onShortcut);
    return () => window.removeEventListener("keydown", onShortcut);
  }, [isOpen, setOpen]);

  return useMemo(
    () => ({
      input,
      parsed,
      isOpen,
      isLoading,
      lastError,
      setInput,
      setOpen,
      parseInput,
    }),
    [input, parsed, isOpen, isLoading, lastError, setInput, setOpen, parseInput]
  );
}
