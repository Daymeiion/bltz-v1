"use client";

import { useEffect, useMemo, useState } from "react";
import type { IdentityDraft } from "@/types/locker";
import type { LockerBlockDraft } from "@/types/blocks";
import type { OnboardingPath } from "@/lib/constants/paths";

type Store = {
  pathSelected: OnboardingPath | null;
  identity: IdentityDraft | null;
  handle: string | null;
  blocks: LockerBlockDraft[] | null;

  setPathSelected: (p: OnboardingPath) => void;
  setIdentity: (i: IdentityDraft) => void;
  setHandle: (h: string) => void;
  setBlocks: (b: LockerBlockDraft[]) => void;
  reset: () => void;
};

const KEY = "bltz_onboarding_v1";

function read(): Partial<Store> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function writeState(next: Partial<Store>) {
  if (typeof window === "undefined") return;
  try {
    const current = read();
    const merged = { ...current, ...next };
    window.localStorage.setItem(KEY, JSON.stringify(merged));
  } catch {
    // ignore
  }
}

export function useOnboardingStore(): Store {
  const [hydrated, setHydrated] = useState(false);
  const [pathSelected, setPathSelectedState] = useState<OnboardingPath | null>(null);
  const [identity, setIdentityState] = useState<IdentityDraft | null>(null);
  const [handle, setHandleState] = useState<string | null>(null);
  const [blocks, setBlocksState] = useState<LockerBlockDraft[] | null>(null);

  useEffect(() => {
    const s = read();
    setPathSelectedState((s as any).pathSelected ?? null);
    setIdentityState((s as any).identity ?? null);
    setHandleState((s as any).handle ?? null);
    setBlocksState((s as any).blocks ?? null);
    setHydrated(true);
  }, []);

  const store = useMemo<Store>(() => ({
    pathSelected,
    identity,
    handle,
    blocks,

    setPathSelected: (p) => {
      setPathSelectedState(p);
      writeState({ pathSelected: p } as any);
    },
    setIdentity: (i) => {
      setIdentityState(i);
      writeState({ identity: i } as any);
    },
    setHandle: (h) => {
      setHandleState(h);
      writeState({ handle: h } as any);
    },
    setBlocks: (b) => {
      setBlocksState(b);
      writeState({ blocks: b } as any);
    },
    reset: () => {
      setPathSelectedState(null);
      setIdentityState(null);
      setHandleState(null);
      setBlocksState(null);
      if (typeof window !== "undefined") window.localStorage.removeItem(KEY);
    },
  }), [pathSelected, identity, handle, blocks]);

  // If not hydrated yet, return safe defaults (prevents flicker bugs)
  if (!hydrated) {
    return {
      pathSelected: null,
      identity: null,
      handle: null,
      blocks: null,
      setPathSelected: () => {},
      setIdentity: () => {},
      setHandle: () => {},
      setBlocks: () => {},
      reset: () => {},
    };
  }

  return store;
}
