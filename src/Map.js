import React ,  { Component } from 'react'
import { render } from 'react-dom'
import { Map, Marker, Popup, Circle, CircleMarker, TileLayer } from 'react-leaflet'
import ReactList from 'react-list';

const WuhanPosition = [30.58333, 114.26667]
const ENV = "dev" // dis   

class VirusMap extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: null,
    };
  }

  componentDidMount() {
    const sourceUrl = (ENV == "dis") ? "https://lbj96347.github.io/2020-virus-map/virus-data.json" : "http://localhost:8000/virus-data.json" 
    fetch(sourceUrl)
      .then(response => response.json())
      .then(data => this.setState({ data }));
  }

  componentWillUnmount() {

  }

  renderItem(index, key) {
    return <div class="item" key={key}>
      <a href={this.state.data.sources[index].news}>
        {this.state.data.sources[index].city}  点击查看最新进展  
      </a>
      </div>;
  }

  render(){
      if(this.state.data){
        return  (
          <div>
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

            <div class="scroll-list">
              <ReactList
                itemRenderer={this.renderItem.bind(this)}
                length={this.state.data.sources.length}
                type='uniform'
              />
            </div>
          </div>
        );
      }
      return null;
    }
}

export default VirusMap;
