import _ from 'lodash'
import { setUrlParams } from '@/util/routerUtil'
/**
 * Mainly used for data list paging url param handle
 * @param _getList => api function(required)
 */
export default {
  watch: {
    // watch pageNo
    searchParams: {
      deep: true,
      handler() {
        setUrlParams(this.searchParams)
        this._debounceGET()
      },
    },
  },
  created() {
    // Routing parameter merging
    if (!_.isEmpty(this.$route.query)) {
      this.searchParams = _.assign(this.searchParams, this.$route.query)
    }
  },
  mounted() {
    this._debounceGET()
  },
  methods: {
    /**
     * Anti-shake request interface
     * @desc Prevent function from being called multiple times
     */
    _debounceGET: _.debounce(
      function (flag) {
        this._getList(flag)
      },
      100,
      {
        leading: false,
        trailing: true,
      }
    ),
  },
}
