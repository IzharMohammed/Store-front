"use client"

import { create } from "zustand"

export type MockUser = {
  id: string
  name: string
  email: string
}

type AuthState = {
  user: MockUser | null
  login: (email: string) => void
  logout: () => void
  signup: (name: string, email: string) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  login: (email) => set({ user: { id: "u_demo", name: email.split("@")[0] || "User", email } }),
  logout: () => set({ user: null }),
  signup: (name, email) => set({ user: { id: "u_demo", name, email } }),
}))
