import { create } from 'zustand';

type UiState = {
  installDismissed: boolean;
  setInstallDismissed: (value: boolean) => void;
};

export const useUiStore = create<UiState>((set) => ({
  installDismissed: false,
  setInstallDismissed: (value) => set({ installDismissed: value }),
}));
