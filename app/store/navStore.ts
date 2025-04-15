import { create } from "zustand";

const navItemsArray = [
  {
    name: "Search Account",
    active: true,
  },
  {
    name: "Initialize Account",
    active: false,
  },
  {
    name: "Deposite",
    active: false,
  },
  {
    name: "Withdraw",
    active: false,
  },
  {
    name: "My SubAccounts",
    active: false,
  },
  {
    name: "Market Order",
    active: false,
  },
  {
    name: "Limit Order",
    active: false,
  },
];

interface NavStoreState {
  navItems: { name: string; active: boolean }[];
  activeNavItem: string;
}

interface NavStoreAction {
  setNavItems: (activeNavItem: string) => void;
}

const useNavStore = create<NavStoreState & NavStoreAction>((set, get) => ({
  navItems: navItemsArray,
  activeNavItem: "Search Account",
  setNavItems: (activeNavItem: string) =>
      set(() => ({
        activeNavItem: activeNavItem,
        navItems: get().navItems.map((item) =>
          item.name === activeNavItem
            ? { ...item, active: true }
            : { ...item, active: false }
        ),
      }))
  
}));

export default useNavStore;
