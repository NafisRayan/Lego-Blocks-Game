import type { Brick } from "@/components/v0-blocks/events"

const LOCAL_STORAGE_KEY = "v0-blocks-state"

export interface LocalStorageState {
  bricks: Brick[]
  width: number
  height: number
  selectedColor: string
  currentTheme: string
  creationId?: string
  creationName?: string
}

export function saveToLocalStorage(state: LocalStorageState): boolean {
  try {
    const serializedState = JSON.stringify(state)
    localStorage.setItem(LOCAL_STORAGE_KEY, serializedState)
    return true
  } catch (error) {
    console.error("Error saving to localStorage:", error)
    return false
  }
}

export function loadFromLocalStorage(): LocalStorageState | null {
  try {
    const serializedState = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (!serializedState) return null
    return JSON.parse(serializedState) as LocalStorageState
  } catch (error) {
    console.error("Error loading from localStorage:", error)
    return null
  }
}

export function clearLocalStorage(): boolean {
  try {
    localStorage.removeItem(LOCAL_STORAGE_KEY)
    return true
  } catch (error) {
    console.error("Error clearing localStorage:", error)
    return false
  }
}

export function isLocalStorageAvailable(): boolean {
  try {
    const testKey = "__test__"
    localStorage.setItem(testKey, testKey)
    localStorage.removeItem(testKey)
    return true
  } catch (e) {
    return false
  }
}
