import localStore from '@/util/localStorage'

export default {
  userInfo: localStore.getJSON('user') || {},
  sessionId: '',
}
