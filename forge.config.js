const { FusesPlugin } = require('@electron-forge/plugin-fuses')
const { FuseV1Options, FuseVersion } = require('@electron/fuses')
const path = require('path')
const glob = require('glob')

const clientFiles = glob.sync(path.join(__dirname, 'assets/clients', '*.phar'))

module.exports = {
    packagerConfig: {
        name: 'TweakPHP',
        icon: './assets/icon',
        asar: true,
        appCategoryType: 'public.app-category.developer-tools',
        extraResource: [...clientFiles, './assets/phpactor.phar', './.vite/build/laravel'],
        osxUniversal: true,
    },
    rebuildConfig: {},
    makers: [
        {
            name: '@electron-forge/maker-squirrel',
            config: {},
        },
        // {
        //     name: '@electron-forge/maker-zip',
        //     platforms: ['darwin'],
        // },
        {
            name: '@electron-forge/maker-deb',
            config: {},
        },
        {
            name: '@electron-forge/maker-rpm',
            config: {},
        },
        {
            name: '@electron-forge/maker-dmg',
            config: {
                name: 'TweakPHP-Installer',
                icon: './assets/icon.icns',
                format: 'ULFO',
                overwrite: true, // Force overwrite existing DMG
                additionalDMGOptions: {
                    // 'background': './assets/dmg-background.png',
                    volname: 'TweakPHP-Installer',
                },
            },
        },
    ],
    plugins: [
        {
            name: '@electron-forge/plugin-vite',
            config: {
                // `build` can specify multiple entry builds, which can be Main process, Preload scripts, Worker process, etc.
                // If you are familiar with Vite configuration, it will look really familiar.
                build: [
                    {
                        // `entry` is just an alias for `build.lib.entry` in the corresponding file of `config`.
                        entry: 'src/main.js',
                        config: 'vite.main.config.mjs',
                    },
                    {
                        entry: 'src/preload.js',
                        config: 'vite.preload.config.mjs',
                    },
                ],
                renderer: [
                    {
                        name: 'main_window',
                        config: 'vite.renderer.config.mjs',
                    },
                ],
            },
        },
        {
            name: '@electron-forge/plugin-auto-unpack-natives',
            config: {},
        },
        // Fuses are used to enable/disable various Electron functionality
        // at package time, before code signing the application
        new FusesPlugin({
            version: FuseVersion.V1,
            [FuseV1Options.RunAsNode]: true,
            [FuseV1Options.EnableCookieEncryption]: true,
            [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
            [FuseV1Options.EnableNodeCliInspectArguments]: false,
            [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
            [FuseV1Options.OnlyLoadAppFromAsar]: false,
        }),
    ],
}
