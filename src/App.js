import React, { Component } from 'react';
import logo from './logo.svg';
import exemple from './example.jpg';
import './App.css';
import { compose, withProps, withStateHandlers } from "recompose";
import algoliasearch from 'algoliasearch';
import MarkerClusterer from "react-google-maps/lib/components/addons/MarkerClusterer";
import styled from 'styled-components';
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow,
} from "react-google-maps";

class Popup extends React.Component {
  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>
            Votre nom:
            <input name="name" type="text" />
          </label>
          <label>
            Votre société:
            <input name="company" type="text" />
          </label>
          <label>
            Votre mobile:
            <input name="mobile" type="text" />
          </label>
          <label>
            Votre Email:
            <input name="email" type="text" />
          </label>
          <label>
            Revoir la simulation par :
            <input name="methode" type="text" />
          </label>
          <label>
            Transmettre à l'admin :
            <input name="admin" type="checkbox" />
          </label>
          <input type="submit" value="Envoyer" />
        </form>
          <button onClick={this.props.closePopup}>close me</button>
      </div>
    );
  }
}

class MarkerWithInfoWindows extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: props.isOpen
    }
    this.onToggleOpen = this.onToggleOpen.bind(this);
  }

  onToggleOpen(){
    this.setState({isOpen: !this.state.isOpen})
  }

  render () {
    return (
      <Marker
        position={{ lat:parseFloat(this.props.marker._geoloc.lat), lng: parseFloat(this.props.marker._geoloc.lng) }}
        onClick={this.onToggleOpen}
      >
        {
          this.state.isOpen && <InfoWindow onCloseClick={this.onToggleOpen}>
            <p> {this.props.marker.trade} {this.props.marker.cp} {this.props.marker.city} {this.props.marker.cname} </p>
          </InfoWindow>
        }
      </Marker>
    );
  }
}


const MapWithAMarker = compose(
  withStateHandlers(() => ({
    isOpen: false,
  })),
  withScriptjs,
  withGoogleMap
)(props => {
  console.log(props.markers)
      return (
        <GoogleMap
          defaultZoom={10}
          defaultCenter={{ lat: 48.8566, lng: 2.3522}}
        >
          <MarkerClusterer
            averageCenter
            enableRetinaIcons
            gridSize={60}
          >
        { props.markers.map((marker, index) =>(<MarkerWithInfoWindows marker={marker} key={index} isOpen={props.isOpen} />))}
          </MarkerClusterer>
        </GoogleMap>
      );
});



class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      trade: '',
      pc:'',
      radius:'',
      markers:[],
      showPopup: false,
      nbProject: 0,
      CA: 0
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.togglePopup = this.togglePopup.bind(this);
  }

  togglePopup() {
    this.setState({
      showPopup: !this.state.showPopup
    });
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    }, this.doSearch);
    console.log(this.state.radius)
  }

  doSearch() {
    const client = algoliasearch("TIM81UW1UV", "833cbf062e3b7c3979155c0d07e3f058",{protocol: 'https:'});
    const index = client.initIndex('batimat_dev');

    index.search({
      query: '',
      facetFilters: [["trade:" + this.state.trade]],
      aroundLatLng: "45.732831,5.657159",
      aroundRadius: this.state.radius,
    }).then(res => {
      this.setState({
        markers: res.hits,
        nbProject: res.hits.length
      });
    });
  }

  handleSubmit(event) {
     event.preventDefault();
  }

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
            Conseiller:
            <select name="trade" value={this.state.trade} onChange={this.handleInputChange}>
              <option value="volvo">François</option>
              <option value="saab">David</option>
            </select>
          </label>
          <label>
            Votre métier:
            <div>
              <img src={exemple} alt="logo" />
              <img />
              <img />
              <img />
              <img />
            </div>
            <select name="trade" value={this.state.trade} onChange={this.handleInputChange}>
              <option value="patrimoine">patrimoine</option>
              <option value="fenetres">Fenêtres</option>
              <option value="veranda">Véranda</option>
              <option value="Energie solaire">Energie solaire</option>
            </select>
          </label>
          <label>
            Votre code postal:
            <input name="pc" type="text" value={this.state.pc} onChange={this.handleInputChange}/>
          </label>
          <label>
            Rayon d'action
            <input name="radius" type="range" min="10" max="100" value={this.state.radius} onChange={this.handleInputChange} />
          </label>

          <input type="submit" onClick={this.togglePopup.bind(this)} value="Imprimer" />
        </form>
        <MapWithAMarker
          googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ height: `400px` }} />}
          mapElement={<div style={{ height: `100%` }} />}
          markers={this.state.markers}
        />
          <div>
            <p>{this.state.nbProject} projets trouvés - {this.state.CA} de CA potentiel</p>
          </div>
        {this.state.showPopup ?
          <Popup
            text='Close Me'
            closePopup={this.togglePopup}
          />
          : null
        }
        </div>
      </div>
    );
  }
}

export default App;
