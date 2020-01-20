import React ,  { Component } from 'react'
import { render } from 'react-dom'
import { Map, Marker, Popup, Circle, CircleMarker, TileLayer } from 'react-leaflet'

const WuhanPosition = [30.58333, 114.26667]

class VirusMap extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: null,
    };
  }

  componentDidMount() {
    fetch('http://localhost:8000/virus-data.json')
      .then(response => response.json())
      .then(data => this.setState({ data }));
  }

  render(){
      if(this.state.data){
        return  (
          <Map noWrap={true}  scrollWheelZoom={true} maxZoom="18" className="map-container" center={WuhanPosition} zoom={5}>
            <TileLayer
              noWrap={true} 
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              id="mapbox/streets-v11"
            />

            {this.state.data.sources.map( (item, key) => 
              <Marker key={key} position={item["position"]}>
                <Popup>{item["city"]} 新型冠状病毒感染个案：{item["number"]} </Popup>
              </Marker>
              
            )}

            {this.state.data.sources.map( (item, key) => 
              <CircleMarker key={key} color="red" fillColor="#f03" fillOpacity="0.5" radius="20"  center={item["position"]}>
              </CircleMarker>
            )}
            
          </Map>
        );
      }
      return null;
    }
}

export default VirusMap;
