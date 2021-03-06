import React ,  { Component } from 'react'
// import { render } from 'react-dom'
import { Map, Marker, Popup, CircleMarker, TileLayer } from 'react-leaflet'
// import ReactList from 'react-list';

const WuhanPosition = [30.58333, 114.26667]
var historyData = [] // try to render log  
var renderCount = 0;
var renderingStat = false;
const ENV = "dev" // dis   

class VirusMap extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: null,
      nationIndex: 0
    };
    this.handleRenderData = this.handleRenderData.bind(this);
  }

  componentDidMount() {
    const sourceUrl = (ENV === "dis") ? "https://lbj96347.github.io/2020-virus-map/virus-data.json" : "http://localhost:8000/virus-data.json" 
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

  
  handleHistoryData(){
    renderingStat = true
    if( historyData.length === 0 ){
      for( var i = 0; i < 14; i++ ){
        const sourceUrl = (ENV === "dis") ? "https://lbj96347.github.io/2020-virus-map/virus-data-history/virus-data-"+ i +".json" : "http://localhost:8000/virus-data-history/virus-data-"+ i +".json" 
        fetch(sourceUrl)
          .then(response => response.json())
          .then(data => historyData.push(data));
      }
      this.handleRenderData()
    }else{
      this.handleRenderData()
    }
  }

  handleRenderData(){
    if(renderCount < 14){
      this.controlRender()
    }else{
      this.stopRenderHistory()
    }
  }

  controlRender(){
    var renderData = historyData[renderCount] 
    this.setState({ data: renderData }, function(){
      setTimeout(function (){
        console.log( renderCount );
        renderCount = renderCount + 1
        this.handleRenderData()
      }.bind(this), 2000);
    })
  }

  stopRenderHistory(){
    renderingStat = false
    renderCount = 0
  }

  startToRenderHistory(){
    if( renderingStat === false ){
      this.handleHistoryData()
    }else{
      alert("播放中")
      return null 
    }
  }

  render(){
      if(this.state.data){
        return  (
          <div>

            <div className="item">
              <p>新型冠状病毒地图 - 数据来源央视新闻或者地方卫生部门网站</p>
              <p>Last update：{this.state.data["updateTimestamp"]} <a href="#" onClick={ () => this.startToRenderHistory() }>播放历史</a></p>
              <p>国家/地区：
                {this.state.data.data.map((item, key) => 
                  <a href="#" key={key} onClick={() => this.handleFocusNation(key)}>{item["nation"]}</a>  
                )} 
              </p>
            </div>

            <Map noWrap={true}  scrollWheelZoom={true} maxZoom="18" className="map-container" center={WuhanPosition} zoom={5}>
              <TileLayer
                noWrap={true} 
                url="http://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}"
                subdomains="1234"
                attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>Mapbox</a>"
              />

              {this.state.data.data[this.state.nationIndex].sources.map( (item, key) => 
                <Marker key={key} position={item["position"]}>
                  <Popup> {item["cityName"]} 新型冠状病毒感染个案（含怀疑）：{item["confirmedCount"]} </Popup>
                </Marker>
              )}

              {this.state.data.data[this.state.nationIndex].sources.map( (item, key) => 
                <CircleMarker key={key} color={ (item["confirmedCount"] ?  "red" : "yellow") } fillColor={ (item["confirmedCount"] ? "#f03" : "#ffcf00")} fillOpacity="0.5" radius={ ((item["confirmedCount"] > 20) ? 20 : item["confirmedCount"]) }  center={item["position"]}>
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
