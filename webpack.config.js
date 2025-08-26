const createExpoWebpackConfigAsync = require('@expo/webpack-config')

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(
    {
      ...env,
      babel: {
        dangerouslyAllowMultipleEntries: true,
      },
    },
    argv
  )

  // Add resolve alias for react-native-maps to avoid web issues
  config.resolve.alias = {
    ...config.resolve.alias,
    'react-native-maps$': 'react-native-web-maps',
  }

  // Add fallbacks for native modules
  config.resolve.fallback = {
    ...config.resolve.fallback,
    'react-native/Libraries/Utilities/codegenNativeCommands': false,
  }

  return config
}