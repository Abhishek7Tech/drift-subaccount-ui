import { create } from "zustand";

interface WalletStoreState {
    isConnected: boolean,
}

interface WalletStoreAction {
    setIsConnected: (connection: WalletStoreState["isConnected"]) => void

}

const useWalletStore = create<WalletStoreState & WalletStoreAction>((set) => ({
  isConnected: false,
  setIsConnected: (isConnected) =>
    set(() => ({ isConnected: isConnected })),
}));

export default useWalletStore;