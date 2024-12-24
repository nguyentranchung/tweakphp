<script setup lang="ts">
  import { ref, defineProps } from 'vue'
  import { TransitionRoot, TransitionChild, DialogPanel, DialogTitle, Dialog } from '@headlessui/vue'
  import { useSettingsStore } from '../stores/settings.ts'
  import { XMarkIcon } from '@heroicons/vue/24/outline'

  const settingsStore = useSettingsStore()

  const props = defineProps({
    title: {
      type: String,
      default: '',
    },
  })

  const isModalOpen = ref(false)
  const closeModal = () => {
    isModalOpen.value = false
  }

  const openModal = () => {
    isModalOpen.value = true
  }

  defineExpose({ openModal })
</script>

<template>
  <div>
    <TransitionRoot appear :show="isModalOpen" as="template">
      <Dialog as="div" @close="closeModal" class="relative z-50">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black/25" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-start justify-center p-4 text-center mt-20">
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel
                class="w-full max-w-md transform overflow-hidden rounded-lg p-6 text-left align-middle shadow-xl transition-all"
                :style="{
                  backgroundColor: settingsStore.colors.background,
                  color: settingsStore.colors.foreground,
                }"
              >
                <DialogTitle as="h3" class="text-lg font-medium leading-6 mb-5 flex items-center justify-between">
                  {{ props.title }}
                  <XMarkIcon class="size-5 cursor-pointer hover:opacity-70" @click="closeModal()" />
                </DialogTitle>
                <slot />
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<style scoped></style>
