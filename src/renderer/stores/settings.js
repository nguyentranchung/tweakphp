import { defineStore } from 'pinia'
import * as monaco from 'monaco-editor'
import nordTheme from '../assets/editor-themes/nord.json'
import drakulaTheme from '../assets/editor-themes/dracula.json'
import monokaiTheme from '../assets/editor-themes/monokai.json'
import githubLightTheme from '../assets/editor-themes/github-light.json'
import catppuccinTheme from '../assets/editor-themes/catppuccin.json'
import { computed, ref } from 'vue'

const themeColors = {
    'nord': nordTheme.colors,
    'dracula': drakulaTheme.colors,
    'monokai': monokaiTheme.colors,
    'github-light': githubLightTheme.colors,
    'catppuccin': catppuccinTheme.colors,
}

export const useSettingsStore = defineStore('settings', () => {
    // get keys of themeColors object
    const themes = ref(Object.keys(themeColors))

    let defaultSettings = {
        laravelPath: '',
        php: '/opt/homebrew/bin/php',
        phpVersion: '',
        theme: 'dracula',
        editorFontSize: 15,
        editorWordWrap: 'on',
        layout: 'vertical',
    }

    const settings = ref(defaultSettings)

    const colors = computed(() => {
        return themeColors[settings.value.theme]
    })

    const update = () => {
        // clone settings json
        let json = JSON.parse(JSON.stringify(settings.value))
        window.ipcRenderer.send('settings.store', json)
    }

    const defineEditorThemes = () => {
        monaco.editor.defineTheme('nord', nordTheme)
        monaco.editor.defineTheme('dracula', drakulaTheme)
        monaco.editor.defineTheme('monokai', monokaiTheme)
        monaco.editor.defineTheme('github-light', githubLightTheme)
        monaco.editor.defineTheme('catppuccin', catppuccinTheme)
    }

    return { settings, themes, update, colors, defineEditorThemes }
})
