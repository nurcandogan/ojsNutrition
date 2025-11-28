import { create } from 'zustand';

interface AddressState {
  selectedAddressId: string | null;
  setSelectedAddressId: (id: string | null) => void;
}

export const useAddressStore = create<AddressState>((set) => ({
  selectedAddressId: null,
  setSelectedAddressId: (id) => set({ selectedAddressId: id }),
}));