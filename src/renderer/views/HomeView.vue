<script setup>
    import { onMounted } from 'vue'
    import { useHistoryStore } from '../stores/history.js'
    import { TrashIcon } from '@heroicons/vue/24/outline'
    import { useTabsStore } from '../stores/tabs.js'
    import Divider from '../components/Divider.vue'
    import Container from '../components/Container.vue'
    import { useSettingsStore } from '../stores/settings'

    const tabsStore = useTabsStore()
    const historyStore = useHistoryStore()
    const settingsStore = useSettingsStore()

    const props = defineProps({
        tab: {
            type: Object,
            default: () => {
                return {}
            },
        },
    })

    const updateTab = history => {
        let tab = props.tab
        tab.type = 'code'
        tab.path = history
        tab.name = history.split('/').pop()
        tabsStore.updateTab(tab)
    }

    onMounted(() => {})
</script>

<template>
    <Container class="flex items-center justify-center">
        <div class="w-full max-w-lg px-5">
            <div class="text-2xl">Tweaks</div>
            <Divider class="mt-3" />
            <div class="space-y-2 mt-3">
                <div class="flex items-center justify-between">
                    <button class="text-blue-500" @click="updateTab(settingsStore.settings.laravelPath)">
                        laravel
                    </button>
                </div>
                <div class="flex items-center justify-between" v-for="history in historyStore.history">
                    <button class="text-blue-500" @click="updateTab(history)">
                        {{ history }}
                    </button>
                    <button>
                        <TrashIcon @click="historyStore.removeHistory(history)" class="w-4 h-4 hover:text-red-600" />
                    </button>
                </div>
            </div>
        </div>
    </Container>
</template>
