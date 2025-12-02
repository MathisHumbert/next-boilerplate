"use client";

import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  type ReactNode,
} from "react";
import Lenis from "lenis";

import { events } from "@/libs/utils";

type StoreState = {
  isMenuOpened: boolean;
  isPageVisible: boolean;
  lenis: Lenis | null;
  isLenisReady: boolean;
  areFontsLoaded: boolean;
};

type StoreAction =
  | { type: "SET_MENU_OPENED"; payload: boolean }
  | { type: "SET_PAGE_VISIBLE"; payload: boolean }
  | { type: "SET_LENIS"; payload: Lenis | null }
  | { type: "SET_LENIS_READY"; payload: boolean }
  | { type: "SET_FONTS_LOADED"; payload: boolean };

type StoreContextType = {
  isMenuOpened: boolean;
  setIsMenuOpened: (value: boolean) => void;
  isPageVisible: boolean;
  setPageVisible: (value: boolean) => void;
  lenis: Lenis | null;
  setLenis: (lenis: Lenis | null) => void;
  isLenisReady: boolean;
  setLenisReady: (ready: boolean) => void;
  areFontsLoaded: boolean;
  setAreFontsLoaded: (loaded: boolean) => void;
};

const StoreContext = createContext<StoreContextType>({} as StoreContextType);

const initialState: StoreState = {
  isMenuOpened: false,
  isPageVisible: false,
  lenis: null,
  isLenisReady: false,
  areFontsLoaded: false,
};

function reducer(state: StoreState, action: StoreAction): StoreState {
  switch (action.type) {
    case "SET_MENU_OPENED":
      return { ...state, isMenuOpened: action.payload };
    case "SET_PAGE_VISIBLE":
      return { ...state, isPageVisible: action.payload };
    case "SET_LENIS":
      return { ...state, lenis: action.payload };
    case "SET_LENIS_READY":
      return { ...state, isLenisReady: action.payload };
    case "SET_FONTS_LOADED":
      return { ...state, areFontsLoaded: action.payload };
    default:
      return state;
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    events.on("showPage", () => setPageVisible(true));
    events.on("hidePage", () => setPageVisible(false));
  }, []);

  const setIsMenuOpened = (value: boolean) => {
    dispatch({ type: "SET_MENU_OPENED", payload: value });
  };

  const setPageVisible = (value: boolean) => {
    dispatch({ type: "SET_PAGE_VISIBLE", payload: value });
  };

  const setLenis = (lenis: Lenis | null) => {
    dispatch({ type: "SET_LENIS", payload: lenis });
  };

  const setLenisReady = (ready: boolean) => {
    dispatch({ type: "SET_LENIS_READY", payload: ready });
  };

  const setAreFontsLoaded = (loaded: boolean) => {
    dispatch({ type: "SET_FONTS_LOADED", payload: loaded });
  };

  const value: StoreContextType = {
    isMenuOpened: state.isMenuOpened,
    setIsMenuOpened,
    isPageVisible: state.isPageVisible,
    setPageVisible,
    lenis: state.lenis,
    setLenis,
    isLenisReady: state.isLenisReady,
    setLenisReady,
    areFontsLoaded: state.areFontsLoaded,
    setAreFontsLoaded,
  };

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function useStore(): StoreContextType {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}
