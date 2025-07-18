import vue from 'rollup-plugin-vue'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { babel } from '@rollup/plugin-babel'
import { defineConfig } from 'rollup'
import postcss from 'rollup-plugin-postcss'
import postcssCustomProperties from 'postcss-custom-properties'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import path from 'path'
import alias from '@rollup/plugin-alias'
import sass from 'sass'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// 组件列表 - 仅用于Vue3/ESM
const components = [
  'ThirdPartyLoginModal',
  'OAuthButton',
  'EmailInput',
  'VerificationCodeInput'
]

// Vue3组件配置 - 仅ESM格式
const createComponentConfig = (name) => ({
  input: `src/components/${name}.vue`,
  output: [
    {
      dir: `dist/components/${name.toLowerCase()}`,
      entryFileNames: 'index.js',
      format: 'esm',
      exports: 'named',
      inlineDynamicImports: true
    }
  ],
  external: ['vue'],
  plugins: [
    peerDepsExternal(),
    alias({
      entries: [{ find: '@', replacement: path.resolve(__dirname, 'src') }]
    }),
    vue({
      preprocessStyles: true,
      css: true,
      compileTemplate: true,
      template: {
        isProduction: true,
        optimizeSSR: false
      },
      style: {
        preprocessOptions: {
          scss: {
            implementation: sass
          }
        }
      }
    }),
    postcss({
      plugins: [postcssCustomProperties()],
      extract: true,
      minimize: true,
      modules: false,
      use: ['sass'],
      sassOptions: {
        implementation: sass,
        outputStyle: 'compressed'
      }
    }),
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**',
      extensions: ['.js', '.jsx', '.vue'],
      presets: [
        [
          '@babel/preset-env',
          {
            targets: {
              node: '14'
            },
            useBuiltIns: 'usage',
            corejs: 3,
            modules: false
          }
        ]
      ]
    }),
    nodeResolve({
      extensions: ['.mjs', '.js', '.jsx', '.vue']
    }),
    commonjs()
  ]
})

// 基础插件 - 用于Vue3/ESM
const basePluginsVue3 = [
  peerDepsExternal(),
  alias({
    entries: [{ find: '@', replacement: path.resolve(__dirname, 'src') }]
  }),
  vue({
    preprocessStyles: true,
    css: true,
    compileTemplate: true,
    template: {
      isProduction: true,
      optimizeSSR: false
    },
    style: {
      preprocessOptions: {
        scss: {
          implementation: sass
        }
      }
    }
  }),
  postcss({
    plugins: [postcssCustomProperties()],
    extract: true,
    minimize: true,
    modules: false,
    use: ['sass'],
    sassOptions: {
      implementation: sass,
      outputStyle: 'compressed'
    }
  }),
  babel({
    babelHelpers: 'bundled',
    exclude: 'node_modules/**',
    extensions: ['.js', '.jsx', '.vue'],
    presets: [
      [
        '@babel/preset-env',
        {
          targets: {
            node: '14'
          },
          useBuiltIns: 'usage',
          corejs: 3,
          modules: false
        }
      ]
    ]
  }),
  nodeResolve({
    extensions: ['.mjs', '.js', '.jsx', '.vue']
  }),
  commonjs()
]

// 基础插件 - 用于Vue2/CommonJS (无Vue组件)
const basePluginsVue2 = [
  peerDepsExternal(),
  alias({
    entries: [{ find: '@', replacement: path.resolve(__dirname, 'src') }]
  }),
  babel({
    babelHelpers: 'bundled',
    exclude: 'node_modules/**',
    extensions: ['.js', '.jsx'],
    presets: [
      [
        '@babel/preset-env',
        {
          targets: {
            browsers: ['> 1%', 'last 2 versions', 'not dead', 'not ie <= 11']
          },
          useBuiltIns: 'usage',
          corejs: 3,
          modules: false
        }
      ]
    ]
  }),
  nodeResolve({
    extensions: ['.mjs', '.js', '.jsx']
  }),
  commonjs()
]

export default defineConfig([
  // Vue3/ESM 完整包配置 (包含组件)
  {
    input: 'src/index.js',
    output: [
      {
        file: 'dist/fg-login.es.js',
        format: 'esm',
        exports: 'named'
      }
    ],
    external: ['vue', 'firebase/app', 'firebase/auth'],
    plugins: basePluginsVue3
  },
  // Vue2/ESM 纯方法包配置 (不包含组件)
  {
    input: 'src/methods-index.js',
    output: [
      {
        file: 'dist/fg-login.vue2.esm.js',
        format: 'esm',
        exports: 'named'
      }
    ],
    external: ['firebase/app', 'firebase/auth'],
    plugins: basePluginsVue2
  },
  // Vue2/CommonJS 纯方法包配置 (不包含组件)
  {
    input: 'src/methods-only.js',
    output: [
      {
        file: 'dist/fg-login.umd.cjs',
        format: 'cjs',
        exports: 'auto',
        globals: {
          'firebase/app': 'firebase',
          'firebase/auth': 'firebase.auth'
        }
      }
    ],
    external: ['firebase/app', 'firebase/auth'],
    plugins: basePluginsVue2
  },
  // Vue3组件索引文件 (仅ESM)
  {
    input: 'src/components/index.js',
    output: [
      {
        file: 'dist/components/index.js',
        format: 'esm',
        exports: 'named'
      }
    ],
    external: ['vue', 'firebase/app', 'firebase/auth'],
    plugins: basePluginsVue3
  },
  // Nuxt 3 模块配置
  {
    input: 'src/module.js',
    output: { file: 'dist/module.mjs', format: 'esm' },
    external: [
      '@nuxt/kit',
      '@nuxt/schema',
      'vue',
      'firebase/app',
      'firebase/auth'
    ],
    plugins: [
      ...basePluginsVue3,
      postcss({
        plugins: [],
        extract: 'style.css',
        minimize: true,
        modules: false,
        use: ['sass'],
        sassOptions: {
          implementation: sass,
          outputStyle: 'compressed'
        }
      })
    ]
  },
  // Nuxt 3 插件配置
  {
    input: 'src/runtime/plugin.js',
    output: { file: 'dist/runtime/plugin.js', format: 'esm' },
    external: ['#app', 'vue', 'firebase/app', 'firebase/auth'],
    plugins: basePluginsVue3
  },
  // Nuxt 2 模块配置
  {
    input: 'src/module.nuxt2.js',
    output: {
      file: 'dist/module.nuxt2.js',
      format: 'cjs',
      exports: 'auto'
    },
    external: ['path'],
    plugins: basePluginsVue2
  },
  // Nuxt 2 插件配置
  {
    input: 'src/runtime/plugin.nuxt2.js',
    output: {
      dir: 'dist/runtime',
      entryFileNames: 'plugin.nuxt2.js',
      format: 'esm'
    },
    external: [],
    plugins: basePluginsVue2
  },
  // 样式文件配置
  {
    input: 'src/theme/index.scss',
    output: { file: 'dist/theme.css' },
    plugins: [
      postcss({
        plugins: [postcssCustomProperties()],
        extract: true,
        autoModules: true,
        minimize: true,
        modules: false,
        to: 'dist/theme.css',
        use: ['sass'],
        sassOptions: {
          implementation: sass,
          outputStyle: 'compressed'
        }
      })
    ]
  },
  // 单独的style.css样式文件
  {
    input: 'src/style.css',
    output: { file: 'dist/style.css' },
    plugins: [
      postcss({
        plugins: [postcssCustomProperties()],
        extract: true,
        autoModules: true,
        minimize: true,
        modules: false,
        to: 'dist/style.css',
        use: ['sass'],
        sassOptions: {
          implementation: sass,
          outputStyle: 'compressed'
        }
      })
    ]
  },
  // Vue3组件配置 (仅ESM)
  ...components.map(createComponentConfig)
])
