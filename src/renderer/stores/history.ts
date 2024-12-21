import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useHistoryStore = defineStore('history', () => {
  let defaultHistory = []
  let storedHistory = localStorage.getItem('history')
  if (storedHistory) {
    defaultHistory = JSON.parse(storedHistory)
  }
  const history = ref(defaultHistory)

  interface HistoryItem {
    path: string
  }

  const addHistory = (path: string): void => {
    // history must be unique
    let exists = history.value.find((item: HistoryItem) => item.path === path)
    if (exists) {
      return
    }
    history.value.push(path)
    localStorage.setItem('history', JSON.stringify(history.value))
  }

  interface RemoveHistory {
    (path: string): void
  }

  const removeHistory: RemoveHistory = (path: string): void => {
    let index = history.value.findIndex((item: HistoryItem) => item.path === path)
    if (index === -1) {
      return
    }
    history.value.splice(index, 1)
    localStorage.setItem('history', JSON.stringify(history.value))
  }

  return { history, addHistory, removeHistory }
})
