import * as _ from 'lodash'
import * as L from 'leaflet'
import sphericalmercator from '@mapbox/sphericalmercator'

declare let tileLayerCordova: any


export class MapModel {

  public tileLayer
  private sphericalMercator
  public cacheZoom: number = 17
  public center
  private centerBounds: any
  public trace
  public traceBounds: any

  constructor(options: any = {}) {

    /*this.sphericalMercator = new sphericalmercator({
      size: options.tileSize || 256
    })*/
  }

  initialize(options?): any {
    options = options || {};
    return new Promise((resolve, reject) => {
      tileLayerCordova(L)
      this.tileLayer = L['tileLayerCordova'](_.get(options, 'layerUrl', 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'), {
        folder: _.get(options, 'folder', 'ecoreleve'),
        name: 'tile',
        autocache : true
      }, () => {
        resolve()
      })
    })
  }

  setCenter(lat, lng) {
    this.center = {
      lat: lat,
      lng: lng
    }

    let startPt = this.px(this.center, this.cacheZoom)
    let winRadiusX = window.innerWidth / 2
    let winRadiusY = window.innerHeight / 2

    let startBoundsMin = this.ll({
      x: startPt.x - winRadiusX,
      y: startPt.y + winRadiusY
    }, this.cacheZoom)

    let startBoundsMax = this.ll({
      x: startPt.x + winRadiusX,
      y: startPt.y - winRadiusY
    }, this.cacheZoom)

    this.centerBounds = {
      minLat: startBoundsMin.lat,
      maxLat: startBoundsMax.lat,
      minLng: startBoundsMin.lng,
      maxLng: startBoundsMax.lng
    }
  }

  setTrace(coordinates) {
    this.trace = _.clone(coordinates)
    //this.trace = coordinates
    this.traceBounds = this.getTraceBounds(coordinates)
  }

  getTraceBounds(coordinates) {
    let minLng = 500
    let maxLng = -500
    let minLat = 500
    let maxLat = -500
    for (let i = 0; i < coordinates.coordinates.length; i++) {
      let pt = coordinates.coordinates[i]
      let lng = pt[0]
      let lat = pt[1]
      minLat = Math.min(minLat, lat)
      maxLat = Math.max(maxLat, lat)
      minLng = Math.min(minLng, lng)
      maxLng = Math.max(maxLng, lng)
    }

    return {
      minLat: minLat,
      maxLat: maxLat,
      minLng: minLng,
      maxLng: maxLng
    }
  }

  getCacheBounds() {
    if (this.centerBounds && !this.traceBounds) {
      return _.clone(this.centerBounds)
      //return this.centerBounds
    } else if (!this.centerBounds && this.traceBounds) {
      return _.clone(this.traceBounds)
      //return this.traceBounds
    } else if (this.centerBounds && this.traceBounds) {
      let obj = {
        minLng: Math.min(this.traceBounds.minLng, this.centerBounds.minLng),
        maxLng: Math.max(this.traceBounds.maxLng, this.centerBounds.maxLng),
        minLat: Math.min(this.traceBounds.minLat, this.centerBounds.minLat),
        maxLat: Math.max(this.traceBounds.maxLat, this.centerBounds.maxLat)
      }
      return obj
    }
    return null
  }

  getCacheTileBounds() {
    let cacheBounds = this.getCacheBounds()
    let minX = this.tileLayer.getX(cacheBounds.minLng, this.cacheZoom)
    let maxX = this.tileLayer.getX(cacheBounds.maxLng, this.cacheZoom)
    let minY = this.tileLayer.getY(cacheBounds.minLat, this.cacheZoom)
    let maxY = this.tileLayer.getY(cacheBounds.maxLat, this.cacheZoom)

    let swTileBounds = this.bbox({ x: minX, y: minY }, this.cacheZoom)
    let neTileBounds = this.bbox({ x: maxX, y: maxY }, this.cacheZoom)

    return L.latLngBounds(L.latLng(swTileBounds.south, swTileBounds.west), L.latLng(neTileBounds.north, neTileBounds.east))
  }

  isInCacheTileBounds(options) {
    return this.getCacheTileBounds().contains(options);
  }

  px(latlng, z) {
    let pt = this.sphericalMercator.px([latlng.lng, latlng.lat], z)
    return {
      x: pt[0],
      y: pt[1]
    }
  }

  ll(pt, z) {
    let latlng = this.sphericalMercator.ll([pt.x, pt.y], z)
    return {
      lat: latlng[1],
      lng: latlng[0]
    }
  }

  bbox(pt, z) {
    let bbox = this.sphericalMercator.bbox(pt.x, pt.y, this.cacheZoom)

    return {
      north: bbox[3],
      south: bbox[1],
      east: bbox[2],
      west: bbox[0]
    }
  }

  downloadTiles(options=null, minZoom=null,maxZoom=null) {
    return new Promise((resolve, reject) => {
      let cacheBounds,minZoomLoad, maxZoomLoad
      if(options) {
        cacheBounds = options
      } else {
        cacheBounds = this.getCacheBounds()
      }
      if(minZoom){
        minZoomLoad = minZoom
      }else {
        minZoomLoad = this.cacheZoom
      }

      if(maxZoom){
        maxZoomLoad = maxZoom
      }else {
        maxZoomLoad = this.cacheZoom
      }

      let tileList = this.tileLayer.calculateXYZListFromBounds({
        getNorthWest: function () {
          return {
            lat: cacheBounds.maxLat,
            lng: cacheBounds.minLng
          }
        },
        getSouthEast: function () {
          return {
            lat: cacheBounds.minLat,
            lng: cacheBounds.maxLng
          }
        }
      }, minZoomLoad, maxZoomLoad)
      this.tileLayer.downloadXYZList(tileList,
        // Overwrite existing tiles on disk? if no then a tile already on disk will be kept, which can be a big time saver
        false,
        // Progress callback
        (done, total) => {
          var percent = Math.round(100 * done / total)
          console.log('downloadTiles Progress', done + " / " + total + " = " + percent + "%")
        },
        // Complete callback
        () => {
          this.tileLayer.getDiskUsage((filecount, bytes) => {
            let kilobytes = Math.round(bytes / 1024);
            console.log('downloadTiles Done', filecount + " files" + " : " + kilobytes + " kB");
          });
          console.log('Done')
          resolve()
        },
        // Error callback
        (error) => {
          console.log("downloadTiles Failed: ", error)
          //reject();
          resolve()
        }
      )
    })
  }
}
