const path = require('path')

module.exports = function (moduleOptions = {}) {
  const currentDir = __dirname

  // 🔧 修复：从 this.options 中获取配置，而不仅仅依赖 moduleOptions
  const smLoginConfig = this.options.smLogin || moduleOptions || {}

  // 添加插件，并确保配置正确传递
  this.addPlugin({
    src: path.resolve(currentDir, 'runtime/plugin.nuxt2.js'),
    mode: 'client',
    options: smLoginConfig // 传递最终配置给插件
  })

  // 将配置添加到运行时配置（Nuxt2 方式）
  this.options.publicRuntimeConfig = this.options.publicRuntimeConfig || {}
  this.options.publicRuntimeConfig.smLogin = smLoginConfig

  // 🔧 修复：同时添加到 privateRuntimeConfig，确保服务端也能访问
  this.options.privateRuntimeConfig = this.options.privateRuntimeConfig || {}
  this.options.privateRuntimeConfig.smLogin = smLoginConfig

  // 🔧 新增：直接将配置添加到 options 中，确保插件能访问
  this.options.smLogin = smLoginConfig

  // 🔧 确保在开发模式下输出调试信息
  if (this.options.dev) {
    console.log('🔍 [fg-login Nuxt2] 最终模块配置:', smLoginConfig)
    console.log(
      '🔍 [fg-login Nuxt2] publicRuntimeConfig.smLogin:',
      this.options.publicRuntimeConfig.smLogin
    )
    console.log(
      '🔍 [fg-login Nuxt2] privateRuntimeConfig.smLogin:',
      this.options.privateRuntimeConfig.smLogin
    )
  }

  // 🔧 输出配置摘要
  if (smLoginConfig && Object.keys(smLoginConfig).length > 0) {
    const hasFirebase = !!(
      smLoginConfig.firebase && smLoginConfig.firebase.apiKey
    )
    const hasGoogle = !!(smLoginConfig.google && smLoginConfig.google.client_id)
    // console.log(
    //   `📋 模块配置摘要: Firebase ${hasFirebase ? '✅' : '❌'}, Google ${
    //     hasGoogle ? '✅' : '❌'
    //   }`
    // );
  } else {
    console.warn(
      '⚠️ 模块未接收到任何配置，请检查 nuxt.config.js 中是否正确配置了 smLogin 对象'
    )
    console.warn('📖 配置示例:')
    console.warn('   smLogin: {')
    console.warn('     firebase: { apiKey: "...", authDomain: "..." },')
    console.warn('     google: { client_id: "..." }')
    console.warn('   }')
  }
}

// 添加模块元数据（Nuxt2 方式）
module.exports.meta = {
  name: 'fg-login',
  configKey: 'smLogin',
  compatibility: {
    nuxt: '^2.0.0'
  }
}
