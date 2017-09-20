import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {InstantSearch, Hits} from 'react-instantsearch/dom';
import { compose } from "recompose";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from "react-google-maps";

const MapWithAMarker = compose(
    withScriptjs,
    withGoogleMap
  )(props =>
    <GoogleMap
      defaultZoom={8}
      defaultCenter={{ lat: -34.397, lng: 150.644 }}
    >
      <Marker
        position={{ lat: -34.397, lng: 150.644 }}
      />
      <Marker
        position={{ lat: -35.397, lng: 150.644 }}
      />
    </GoogleMap>
);


function Search(cp, rayon) {
  return (
    <div className="container">
      <MapWithAMarker
        googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={{ height: `400px` }} />}
        mapElement={<div style={{ height: `100%` }} />}
      />
    </div>
  );
}




class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <div>
          <form onSubmit={this.handleSubmit}>
            <label>
              Votre métier:
              <select>
                <option value="volvo">Volvo</option>
                <option value="saab">Saab</option>
                <option value="opel">Opel</option>
                <option value="audi">Audi</option>
              </select>
            </label>
            <label>
              Rayon d'action
              <input type="text" />
            </label>
            <label>
              Votre code postal:
              <input type="range" />
            </label>
            <input type="submit" value="Imprimer" />
          </form>
          <InstantSearch
            appId="latency"
            apiKey="3d9875e51fbd20c7754e65422f7ce5e1"
            indexName="bestbuy"
          >
          <Search/>

          </InstantSearch>
        </div>
      </div>
    );
  }
}

export default App;
