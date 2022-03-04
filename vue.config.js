module.exports = {
  devServer: {
    proxy: {
      '/dolphinscheduler': {
        timeout: 1800000,
        target: 'http://127.0.0.1:12345',
        changeOrigin: true,
      },
    },
  },
}
