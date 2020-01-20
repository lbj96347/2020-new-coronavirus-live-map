import React ,  { Component } from 'react'
import { render } from 'react-dom'
import { Map, Marker, Popup, Circle, CircleMarker, TileLayer } from 'react-leaflet'

const position = [30.58333, 114.26667]
const map = (
  <Map noWrap={true}  scrollWheelZoom={true} maxZoom="18" className="map-container" center={position} zoom={5}>
    <TileLayer
      noWrap={true} 
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      id="mapbox/streets-v11"
    />
    <Marker position={position}>
        <Popup>武汉</Popup>
    </Marker>
    <CircleMarker color="red" fillColor="#f03" fillOpacity="0.5"  radius="20"  center={position}>
    </CircleMarker>
  </Map>
)


class VirusMap extends Component {
  render(){
    return map;
  }
}

export default VirusMap;
