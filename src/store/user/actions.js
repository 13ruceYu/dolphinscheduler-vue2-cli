import io from '@/module/io'
import router from '@/router'

export default {
  /**
   * get userInfo
   */
  getUserInfo({ state }, payload) {
    return new Promise((resolve, reject) => {
      io.get('users/get-user-info', payload, (res) => {
        state.userInfo = res.data
        resolve(res.data)
      }).catch((e) => {
        reject(e)
      })
    })
  },
  /**
   * sign out
   */
  signOut() {
    io.post('signOut', (res) => {
      setTimeout(() => {
        // window.location.href = `${PUBLIC_PATH}/view/login/index.html`
        router.push({ name: 'login' })
      }, 100)
    }).catch((e) => {
      console.log(e)
    })
  },
  /**
   * get token list
   * User loginUser,
   * Integer pageNo,
   * String searchVal,
   * Integer pageSize
   */
  getTokenListP({ state }, payload) {
    return new Promise((resolve, reject) => {
      io.get('access-token/list-paging', payload, (res) => {
        resolve(res.data)
      }).catch((e) => {
        reject(e)
      })
    })
  },
  /**
   * create token
   * User loginUser,
   * int userId,
   * String expireTime,
   * String token
   */
  createToken({ state }, payload) {
    return new Promise((resolve, reject) => {
      io.post('access-token/create', payload, (res) => {
        resolve(res)
      }).catch((e) => {
        reject(e)
      })
    })
  },
  /**
   * update token
   * User loginUser,
   * int userId,
   * String expireTime,
   * String token
   */
  updateToken({ state }, payload) {
    return new Promise((resolve, reject) => {
      io.post('access-token/update', payload, (res) => {
        resolve(res)
      }).catch((e) => {
        reject(e)
      })
    })
  },
  /**
   * create token
   * User loginUser,
   * int userId,
   * String expireTime
   */
  generateToken({ state }, payload) {
    return new Promise((resolve, reject) => {
      io.post('access-token/generate', payload, (res) => {
        resolve(res.data)
      }).catch((e) => {
        reject(e)
      })
    })
  },
  /**
   * delete token
   * User loginUser,
   * int  id
   */
  deleteToken({ state }, payload) {
    return new Promise((resolve, reject) => {
      io.post('access-token/delete', payload, (res) => {
        resolve(res)
      }).catch((e) => {
        reject(e)
      })
    })
  },
}
