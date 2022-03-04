import d3 from 'd3'
import $ from 'jquery'
const DragZoom = function () {
  this.element = {}
  this.zoom = {}
  this.scale = 1
}

DragZoom.prototype.init = function () {
  const $canvas = $('#canvas')
  this.element = d3.select('#canvas')
  this.zoom = d3.behavior
    .zoom()
    .scaleExtent([0.5, 2])
    .on('zoom', () => {
      this.scale = d3.event.scale
      $canvas.css('transform', 'scale(' + this.scale + ')')
      $canvas.css('transform-origin', '0 0')
    })
  this.element.call(this.zoom).on('dblclick.zoom', null)
}

export default new DragZoom()
