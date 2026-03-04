import { create } from "zustand";
import { SourceContent, RepurposedAsset } from "./types";
import { MOCK_LIBRARY, generateMockAssets } from "./mock-data";

interface ContentStore {
  sources: SourceContent[];
  currentSource: SourceContent | null;
  setCurrentSource: (source: SourceContent | null) => void;
  addSource: (source: SourceContent) => void;
  updateSource: (id: string, updates: Partial<SourceContent>) => void;
  updateAsset: (
    sourceId: string,
    assetId: string,
    updates: Partial<RepurposedAsset>
  ) => void;
  getSourceById: (id: string) => SourceContent | undefined;
  initializeMockData: () => void;
}

export const useContentStore = create<ContentStore>((set, get) => ({
  sources: [],
  currentSource: null,

  setCurrentSource: (source) => set({ currentSource: source }),

  addSource: (source) =>
    set((state) => ({ sources: [source, ...state.sources] })),

  updateSource: (id, updates) =>
    set((state) => ({
      sources: state.sources.map((s) =>
        s.id === id ? { ...s, ...updates } : s
      ),
      currentSource:
        state.currentSource?.id === id
          ? { ...state.currentSource, ...updates }
          : state.currentSource,
    })),

  updateAsset: (sourceId, assetId, updates) =>
    set((state) => ({
      sources: state.sources.map((s) =>
        s.id === sourceId
          ? {
              ...s,
              assets: s.assets.map((a) =>
                a.id === assetId ? { ...a, ...updates } : a
              ),
            }
          : s
      ),
    })),

  getSourceById: (id) => get().sources.find((s) => s.id === id),

  initializeMockData: () => {
    const current = get().sources;
    if (current.length === 0) {
      set({ sources: MOCK_LIBRARY });
    }
  },
}));

export function createNewSource(
  title: string,
  type: SourceContent["type"],
  url?: string,
  fileName?: string
): SourceContent {
  const id = `src-${Date.now()}`;
  return {
    id,
    title,
    type,
    url,
    fileName,
    createdAt: new Date().toISOString(),
    status: "processing",
    assets: [],
  };
}

export function completeProcessing(sourceId: string): RepurposedAsset[] {
  return generateMockAssets(sourceId);
}
