import $ from 'jquery'
import JSP from './jsPlumbHandle'
/**
 * when and only ctrl or meta key pressing, we can select one or more dags to drag
 */
export default function () {
  // init
  let selectableObjects = []
  JSP.JspInstance.clearDragSelection()
  let ctrlPress = false

  let nodes = null
  const $window = $(window)

  $window.bind('keydown', function (event) {
    if (event.ctrlKey || event.metaKey) {
      if (nodes) {
        nodes.unbind('mousedown', select)
      }
      nodes = $('.jtk-draggable')
      nodes.bind('mousedown', select)
      ctrlPress = true
    }
  })
  $window.bind('keyup', function () {
    clear()
  })

  function select(event) {
    if (ctrlPress && event.button === 0) {
      let index = null
      if ((index = selectableObjects.indexOf(this)) !== -1) {
        selectableObjects.splice(index, 1)
        JSP.JspInstance.removeFromDragSelection(this)
        $(this).css('border-color', '')
      } else {
        selectableObjects.push(this)
        JSP.JspInstance.addToDragSelection(this)
        $(this).css('border-color', '#4af')
      }
    }
  }

  function clear() {
    ctrlPress = false
    selectableObjects.map((item) => {
      $(item).css('border-color', '')
    })
    selectableObjects = []
    JSP.JspInstance.clearDragSelection()
  }
}
