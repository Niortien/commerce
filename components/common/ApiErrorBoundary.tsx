"use client";

import type { ErrorInfo, ReactNode } from "react";
import { Component } from "react";
import { Button } from "@heroui/react";

interface ApiErrorBoundaryProps {
  children: ReactNode;
}

interface ApiErrorBoundaryState {
  hasError: boolean;
  errorMessage?: string;
}

export class ApiErrorBoundary extends Component<ApiErrorBoundaryProps, ApiErrorBoundaryState> {
  state: ApiErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(error: Error): ApiErrorBoundaryState {
    return { hasError: true, errorMessage: error?.message ?? String(error) };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("ApiErrorBoundary caught:", error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="rounded-lg border border-out bg-[var(--color-out-dim)] p-5">
        <p className="text-sm text-text">Une erreur est survenue.</p>
        {this.state.errorMessage && (
          <p className="mt-1 font-mono text-xs text-text-muted break-all">{this.state.errorMessage}</p>
        )}
        <Button className="mt-3" color="danger" variant="flat" onPress={() => this.setState({ hasError: false, errorMessage: undefined })}>
          Reessayer
        </Button>
      </div>
    );
  }
}
