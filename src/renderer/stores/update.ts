import { ref } from 'vue'
import { defineStore } from 'pinia'
import { UpdateInfo } from 'electron-updater'

export const useUpdateStore = defineStore('update', () => {
  const update = ref<UpdateInfo>()

  let storedUpdate = localStorage.getItem('update')
  if (storedUpdate) {
    update.value = JSON.parse(storedUpdate)
  }

  const updateAvailable = (info: UpdateInfo): void => {
    update.value = info
    localStorage.setItem('update', JSON.stringify(info))
  }

  return { update, updateAvailable }
})
