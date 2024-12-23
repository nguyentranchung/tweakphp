<script setup lang="ts">
  import { ArrowPathIcon } from '@heroicons/vue/24/outline'
  import Container from '../components/Container.vue'
  import Title from '../components/Title.vue'
  import Divider from '../components/Divider.vue'
  import { useSettingsStore } from '../stores/settings'
  import SelectInput from '../components/SelectInput.vue'
  import TextInput from '../components/TextInput.vue'
  import { ref } from 'vue'
  import PrimaryButton from '../components/PrimaryButton.vue'
  import { useUpdateStore } from '../stores/update'

  const saved = ref(false)
  const settingsStore = useSettingsStore()
  const updateStore = useUpdateStore()
  const checkingForUpdates = ref(false)

  const saveSettings = () => {
    saved.value = true
    settingsStore.update()
    setTimeout(() => {
      saved.value = false
    }, 2000)
  }

  const checkForUpdates = () => {
    checkingForUpdates.value = true
    window.ipcRenderer.send('update.check')
  }
</script>

<template>
  <Container class="pt-[38px]">
    <div class="max-w-2xl mx-auto p-10">
      <div class="flex items-center justify-between">
        <Title>Settings</Title>
        <span :class="{ 'opacity-0': !saved, 'opacity-65': saved }" class="transition-all duration-300"
          >Changes Saved</span
        >
      </div>
      <Divider class="mt-3" />
      <div class="mt-3 grid grid-cols-2 items-center">
        <div>App version</div>
        <div class="flex items-center justify-between">
          {{ settingsStore.settings.version }}
          <div
            class="flex items-center"
            v-if="updateStore.update && updateStore.update.version !== settingsStore.settings.version"
          >
            <button class="mr-2 text-sm underline" v-tippy="`Version ${updateStore.update.version} changelog`">
              Changelog
            </button>
            <PrimaryButton v-tippy="`Update to ${updateStore.update.version}`">
              <ArrowPathIcon class="w-5 h-5" />
            </PrimaryButton>
          </div>
          <div v-else>
            <button class="mr-2 text-sm underline" @click="checkForUpdates">Check for updates</button>
          </div>
        </div>
      </div>
      <Divider class="mt-3" />
      <div class="mt-3 grid grid-cols-2 items-center">
        <div>PHP path</div>
        <TextInput id="php" v-model="settingsStore.settings.php" @change="saveSettings()" />
      </div>
      <Divider class="mt-3" />
      <div class="mt-3 grid grid-cols-2 items-center">
        <div>Theme</div>
        <SelectInput id="theme" v-model="settingsStore.settings.theme" @change="saveSettings()">
          <option v-for="theme in settingsStore.themes" :value="theme">
            {{ theme }}
          </option>
        </SelectInput>
      </div>
      <Divider class="mt-3" />
      <div class="mt-3 grid grid-cols-2 items-center">
        <div>Editor font size</div>
        <TextInput id="editor-font-size" v-model="settingsStore.settings.editorFontSize" @change="saveSettings()" />
      </div>
      <Divider class="mt-3" />
      <div class="mt-3 grid grid-cols-2 items-center">
        <div>Editor word wrap</div>
        <SelectInput id="editor-word-wrap" v-model="settingsStore.settings.editorWordWrap" @change="saveSettings()">
          <option value="on">Wrap</option>
          <option value="off">No Wrap</option>
        </SelectInput>
      </div>
    </div>
  </Container>
</template>

<style scoped></style>
