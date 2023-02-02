import type { ethers } from "ethers";
import { writable } from "svelte/store";

function createAccount() {
  const { subscribe, set, update } = writable("");
  return {
    subscribe,
    login: set,
    logout: () => set(""),
  };
}

function createProvider() {
  const { subscribe, set, update } = writable(
    null as ethers.providers.Web3Provider
  );
  return {
    subscribe,
    setProvider: (provider: ethers.providers.Web3Provider) => set(provider),
  };
}

function createDappazon() {
  const { subscribe, set, update } = writable(null as ethers.Contract);
  return {
    subscribe,
    setDappazon: set,
  };
}

export const account = createAccount();
export const provider = createProvider();
export const dappazon = createDappazon();
export const items = writable({});
