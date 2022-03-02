if (typeof window === 'undefined') {
  throw new Error('For browser use only.')
}

const root = window
const storage = root.localStorage

const localStorage = {
  setItem: function (skey, sval) {
    try {
      return storage.setItem(skey, sval)
    } catch (e) {
      console.info(e)
    }
  },
  getItem: function (skey) {
    try {
      return storage.getItem(skey)
    } catch (e) {
      console.info(e)
      return null
    }
  },
  removeItem: function (skey) {
    try {
      return storage.removeItem(skey)
    } catch (e) {
      console.info(e)
      return null
    }
  },
  getJSON: function (skey, p) {
    try {
      let d = storage.getItem(skey)
      if (d) {
        d = JSON.parse(d)
        return p ? d[p] : d
      }
    } catch (e) {
      console.info(e)
    }
  },
  setJSON: function (skey, val, p) {
    try {
      let f = storage.getItem(skey)
      f = f ? JSON.parse(f) : {}
      p ? (f[p] = val) : (f = val)
      storage.setItem(skey, JSON.stringify(f))
    } catch (e) {
      console.info(e)
    }
  },
  removeJSON: function (skey, p) {
    try {
      let d = storage.getItem(skey)
      if (d) {
        d = JSON.parse(d)
        delete d[p]
        storage.setItem(skey, JSON.stringify(d))
      }
    } catch (e) {
      console.info(e)
    }
  },
}

export default localStorage
