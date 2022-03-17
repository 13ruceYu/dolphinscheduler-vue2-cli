import i18n from '@/module/i18n'
import { resolveURL } from '@/module/io'

/**
 * download file
 */
const downloadFile = ($url, $obj) => {
  const param = {
    url: resolveURL($url),
    obj: $obj,
  }

  if (!param.url) {
    this.$message.warning(`${i18n.$t('Unable to download without proper url')}`)
    return
  }

  const formObj = document.createElement('form')
  formObj.action = param.url
  formObj.method = 'get'
  formObj.style.display = 'none'

  const generatorInput = function (obj) {
    const keyArr = Object.keys(obj)
    keyArr.forEach(function (key) {
      const formItem = document.createElement('input')
      formItem.name = key
      formItem.value = obj[key]
      formObj.appendChild(formItem)
    })
  }
  generatorInput(param.obj)

  document.body.appendChild(formObj)
  formObj.submit()
  document.body.removeChild(formObj)
}

export { downloadFile }
