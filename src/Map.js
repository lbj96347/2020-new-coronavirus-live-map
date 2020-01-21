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
                url="https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiY2FzaGxlZSIsImEiOiJjazVsdjcyejYwcXBqM2Vxa2E2aGQ2eHI2In0.Uhid4EEYMyB8iFarVody3A"
                id="mapbox/streets-v11"
                attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>Mapbox</a>"
              />

              {this.state.data.sources.map( (item, key) => 
                <Marker key={key} position={item["position"]}>
                  <Popup>{item["city"]} 新型冠状病毒感染个案（含怀疑）：{item["number"]} </Popup>
                </Marker>
              )}

              {this.state.data.sources.map( (item, key) => 
                <CircleMarker key={key} color={ (item["confirmed"] ?  "red" : "yellow") } fillColor={ (item["confirmed"] ? "#f03" : "#ffcf00")} fillOpacity="0.5" radius={ ((item["number"] > 20) ? 20 : item["number"]) }  center={item["position"]}>
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
