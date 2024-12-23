import { ref } from 'vue'
import { defineStore } from 'pinia'
import { UpdateInfo } from 'electron-updater'

export const useUpdateStore = defineStore('update', () => {
  const update = ref<UpdateInfo>()
  const checking = ref(true)

  let storedUpdate = localStorage.getItem('update')
  if (storedUpdate) {
    update.value = JSON.parse(storedUpdate)
  }

  const setUpdate = (info: UpdateInfo): void => {
    checking.value = false
    update.value = info
    localStorage.setItem('update', JSON.stringify(info))
  }

  const setChecking = (value: boolean): void => {
    checking.value = value
  }

  return { update, setUpdate, checking, setChecking }
})
