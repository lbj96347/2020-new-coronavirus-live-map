import React ,  { Component } from 'react'
// import { render } from 'react-dom'
import { Map, Marker, Popup, CircleMarker, TileLayer } from 'react-leaflet'
// import ReactList from 'react-list';

const WuhanPosition = [30.58333, 114.26667]
const ENV = "dis" // dis   

class VirusMap extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: null,
      nationIndex: 0
    };
  }

  componentDidMount() {
    const sourceUrl = (ENV === "dis") ? "https://lbj96347.github.io/2020-virus-map/virus-data.json" : "http://localhost:8000/virus-data-nation.json" 
    fetch(sourceUrl)
      .then(response => response.json())
      .then(data => this.setState({ data }));
  }

  componentWillUnmount() {

  }

  handleFocusNation (index){
    this.setState({
      nationIndex: index
    })
  }

  render(){
      if(this.state.data){
        return  (
          <div>

            <div className="item">
              <p>新型冠状病毒地图 - 数据来源央视新闻或者地方卫生部门网站</p>
              <p>更新时间 Last update：{this.state.data["updateTimestamp"]}</p>
              <p>国家/地区：
                {this.state.data.data.map((item, key) => 
                  <a href="#" key={key} onClick={() => this.handleFocusNation(key)}>{item["nation"]}</a>  
                )} 
              </p>
            </div>

            <Map noWrap={true}  scrollWheelZoom={true} maxZoom="18" className="map-container" center={WuhanPosition} zoom={5}>
              <TileLayer
                noWrap={true} 
                url="https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiY2FzaGxlZSIsImEiOiJjazVsdjcyejYwcXBqM2Vxa2E2aGQ2eHI2In0.Uhid4EEYMyB8iFarVody3A"
                id="mapbox/streets-v11"
                attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>Mapbox</a>"
              />

              {this.state.data.data[this.state.nationIndex].sources.map( (item, key) => 
                <Marker key={key} position={item["position"]}>
                  <Popup> <a href={item["news"]}>{item["city"]}</a> 新型冠状病毒感染个案（含怀疑）：{item["number"]} </Popup>
                </Marker>
              )}

              {this.state.data.data[this.state.nationIndex].sources.map( (item, key) => 
                <CircleMarker key={key} color={ (item["confirmed"] ?  "red" : "yellow") } fillColor={ (item["confirmed"] ? "#f03" : "#ffcf00")} fillOpacity="0.5" radius={ ((item["number"] > 20) ? 20 : item["number"]) }  center={item["position"]}>
                </CircleMarker>
              )}
            </Map>

          </div>
        );
      }
      return null;
    }
}

export default VirusMap;
