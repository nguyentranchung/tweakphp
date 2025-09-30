<script setup lang="ts">
  import { ref } from 'vue'
  import Modal from '../components/Modal.vue'
  import PrimaryButton from '../components/PrimaryButton.vue'
  import SecondaryButton from '../components/SecondaryButton.vue'

  withDefaults(
    defineProps<{
      modalFirstTitle: string
      modalFirstTitleContent: string
      modalSecondTitle: string
      modalSecondTitleContent: string
      labelActionConfirm: string
      labelConfirmTitle: string
      modalFirstSubTitleContent?: string
      modalSecondSubTitleContent?: string
      labelCancelAction?: string
      labelEndAction?: string
    }>(),
    {
      labelCancelAction: 'Cancel',
    }
  )

  const emit = defineEmits<{
    (e: 'confirm'): void
  }>()

  const firstModal = ref()
  const secondModal = ref()

  function runAction() {
    firstModal.value.closeModal()
    emit('confirm')
    secondModal.value.openModal()
  }
</script>

<template>
  <div>
    <slot name="openFirstModal" :firstModal="firstModal">
      <PrimaryButton @click="firstModal.openModal()"> Open Modal </PrimaryButton>
    </slot>

    <Modal ref="firstModal" :title="modalFirstTitle">
      <p class="text-sm opacity-80 mb-5">
        {{ modalFirstTitleContent }}
        <b v-if="modalFirstSubTitleContent"><br />{{ modalFirstSubTitleContent }}</b>
      </p>

      <div class="mt-6 flex justify-end space-x-3">
        <SecondaryButton @click="firstModal.closeModal()">
          {{ labelCancelAction }}
        </SecondaryButton>
        <PrimaryButton @click="runAction">
          {{ labelActionConfirm }}
        </PrimaryButton>
      </div>
    </Modal>

    <Modal ref="secondModal" :title="modalSecondTitle">
      <p class="text-sm opacity-80 mb-5">
        {{ modalSecondTitleContent }}
        <b v-if="modalSecondSubTitleContent"><br />{{ modalSecondSubTitleContent }}</b>
      </p>
      <div class="flex justify-end">
        <SecondaryButton @click="secondModal.closeModal()">
          {{ labelEndAction }}
        </SecondaryButton>
      </div>
    </Modal>
  </div>
</template>
