"use client"

export type User = {
  id: string
  email: string
  name?: string
  createdAt: number
}

const AUTH_KEY = "ccai:auth"
const USERS_KEY = "ccai:users"

function getUsers(): Record<string, User & { password: string }> {
  try {
    const raw = localStorage.getItem(USERS_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function setUsers(users: Record<string, User & { password: string }>) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function getCurrentUser(): User | null {
  try {
    const raw = localStorage.getItem(AUTH_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function getCurrentUserId(): string | null {
  return getCurrentUser()?.id ?? null
}

export function signUp(email: string, password: string, name?: string): User {
  const users = getUsers()
  const exists = Object.values(users).find((u) => u.email === email)
  if (exists) {
    throw new Error("An account already exists with this email.")
  }
  const id = `usr_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
  const user: User & { password: string } = {
    id,
    email,
    name,
    createdAt: Date.now(),
    password,
  }
  users[id] = user
  setUsers(users)
  const session: User = { id, email, name, createdAt: user.createdAt }
  localStorage.setItem(AUTH_KEY, JSON.stringify(session))
  return session
}

export function signIn(email: string, password: string): User {
  const users = getUsers()
  const found = Object.values(users).find((u) => u.email === email)
  if (!found) throw new Error("Account not found.")
  if (found.password !== password) throw new Error("Invalid credentials.")
  const session: User = { id: found.id, email: found.email, name: found.name, createdAt: found.createdAt }
  localStorage.setItem(AUTH_KEY, JSON.stringify(session))
  return session
}

export function signOut() {
  localStorage.removeItem(AUTH_KEY)
}
