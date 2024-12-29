import { Ref, ref } from 'vue'
import { defineStore } from 'pinia'
import { Tab } from '../types/tab.type'

export const useTabsStore = defineStore('tabs', () => {
  // setup tabs
  let defaultTabs = [
    {
      id: Date.now(),
      type: 'home',
      name: 'home',
      path: '',
      remote_path: '',
      remote_phar_client: '',
      code: '<?php\n\n',
      result: '',
      info: {
        name: '',
        version: '',
        php_version: '',
      },
      docker: {
        enable: false,
        php: '',
        container_name: '',
        container_id: '',
        php_version: '',
      },
    },
  ]
  let storedTabs = localStorage.getItem('tabs')
  if (storedTabs) {
    defaultTabs = JSON.parse(storedTabs).map((tab: any) => ({
      ...tab,
      docker: tab.docker || defaultTabs[0].docker,
    }))
  }
  const tabs: Ref<Tab[]> = ref(defaultTabs)
  const current: Ref<Tab | null> = ref(null)

  const setCurrent = (tab: Tab) => {
    current.value = tab
  }

  const addTab = (data: { id?: number | null; type: string; path?: string } = { type: 'home' }) => {
    if (!data.id) {
      data.id = Date.now()
    }
    const pathSplitter = window.platformInfo.getPlatform() === 'win32' ? '\\' : '/'
    let tab: Tab = {
      id: data.id,
      type: data.type,
      name: data.type === 'home' ? 'home' : data.path?.split(pathSplitter).pop(),
      path: data.path,
      remote_phar_client: '',
      remote_path: '',
      code: '<?php\n\n',
      result: '',
      info: {
        name: '',
        version: '',
        php_version: '',
      },
      docker: {
        enable: false,
        php: '',
        container_id: '',
        container_name: '',
        php_version: '',
      },
    }
    let tabExists = tabs.value.find(t => t.id === tab.id)
    if (tabExists) {
      return tabExists
    }
    tabs.value.push(tab)
    localStorage.setItem('tabs', JSON.stringify(tabs.value))
    setCurrent(tab)
    return tab
  }

  const removeTab = (id: number) => {
    let index = tabs.value.findIndex(tab => tab.id === id)
    tabs.value.splice(index, 1)
    localStorage.setItem('tabs', JSON.stringify(tabs.value))
    if (tabs.value.length > 0) {
      setCurrent(tabs.value[tabs.value.length - 1])
      return tabs.value[tabs.value.length - 1]
    }
    return addTab({
      id: Date.now(),
      type: 'home',
      path: '',
    })
  }

  const updateTab = (tab: Tab) => {
    let index = tabs.value.findIndex(t => t.id === tab.id)
    tabs.value[index] = tab
    localStorage.setItem('tabs', JSON.stringify(tabs.value))
  }

  const findTab = (id: number | null = null) => {
    if (!id) {
      if (tabs.value.length > 0) {
        return tabs.value[tabs.value.length - 1]
      }
      id = Date.now()
    }
    let index = tabs.value.findIndex(t => t.id == id)
    let tab = tabs.value[index]
    if (!tab) {
      tab = addTab({
        id: id,
        type: 'home',
        path: '',
      })
    }
    return tab
  }

  return {
    tabs,
    current,
    addTab,
    removeTab,
    updateTab,
    findTab,
    setCurrent,
  }
})
