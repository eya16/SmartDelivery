import React, { Component } from "react";

class MapQuest extends Component {
  constructor(props) {
    super(props);
    this.state = { ...props };
  }

  render() {
    const mapStyle = {
      height: this.state.height,
      width: this.state.width,
    };
    return (
      <div id="map" style={mapStyle}>
        <p style={{ textAlign: "center" }}>Map loading...</p>
      </div>
    );
  }

  componentDidMount() {
    window.L.mapquest.key = "z8ma9G745ChPO3Ku0WNIgAc1Debg1keJ";

    window.L.mapquest.map("map", {
      center: this.state.center,
      layers: window.L.mapquest.tileLayer(this.state.baseLayer),
      zoom: this.state.zoom,
    });
  }
}

export default MapQuest;
