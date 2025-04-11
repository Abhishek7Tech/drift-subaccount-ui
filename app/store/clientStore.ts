import { create } from "zustand";

interface ClientStoreState {
  subIds: undefined | number[];
}

interface ClientStoreAction {
  setSubIds: (ids: ClientStoreState["subIds"]) => void;
}

const useClientStore = create<ClientStoreState & ClientStoreAction>((set) => ({
  subIds: undefined,
  setSubIds: (ids) => set(() => ({ subIds: ids })),
}));

export default useClientStore;