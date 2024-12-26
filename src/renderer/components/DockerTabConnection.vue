<script setup lang="ts">
  import { onMounted, onUnmounted, PropType, ref } from 'vue'
  import { Tab } from '../types/tab.type.ts'
  import DockerIcon from './icons/DockerIcon.vue'
  import { useTabsStore } from '../stores/tabs.ts'

  const tabsStore = useTabsStore()

  const connected = ref<boolean>(false)

  const props = defineProps({
    tab: {
      type: Object as PropType<Tab>,
      default: () => {
        return {}
      },
    },
  })

  const toggleDockerConnection = () => {
    if (!tabsStore.current) {
      return
    }

    const currentTab = tabsStore.current

    currentTab.docker.enable = !tabsStore.current.docker.enable

    connected.value = tabsStore.current.docker.enable

    tabsStore.updateTab(currentTab)
  }

  const handleDockerCheckPHPVersionResponse = (e: string) => {
    if (tabsStore.current?.docker.enable) {
      connected.value = e.toString() !== ''

      return
    }

    connected.value = false
  }

  const handleDockerCheckPHPVersionError = () => {
    connected.value = false
  }

  onMounted(() => {
    if (!props.tab.docker.container_id) {
      return
    }

    window.ipcRenderer.send('docker-check-php-version', {
      container_id: props.tab.docker.container_id,
    })

    window.ipcRenderer.on('docker-check-php-version-response', handleDockerCheckPHPVersionResponse)
    window.ipcRenderer.on('docker-check-php-version-error', handleDockerCheckPHPVersionError)
  })

  onUnmounted(() => {
    window.ipcRenderer.removeListener('docker-check-php-version-response', handleDockerCheckPHPVersionResponse)
    window.ipcRenderer.removeListener('docker-check-php-version-error', handleDockerCheckPHPVersionError)
  })
</script>

<template>
  <div>
    <div v-if="tab.docker.container_id" class="px-2 flex items-center gap-2">
      <DockerIcon
        :class="{ '!text-green-400': connected }"
        @click="toggleDockerConnection"
        class="w-4 text-red-500 cursor-pointer"
      />
      {{ tab.docker.container_name }}
    </div>
  </div>
</template>
