import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {InstantSearch, SearchBox, RefinementList, Menu} from 'react-instantsearch/dom';
import { compose } from "recompose";
import {connectHits} from "react-instantsearch/connectors";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from "react-google-maps";


const MapWithAMarker = compose(
  withScriptjs,
  withGoogleMap
)(props => {
  const {markers} = props.hits;

  return (
   <GoogleMap
   defaultZoom={8}
   defaultCenter={{ lat: -34.397, lng: 150.644 }}
   >
   { props.hits.map((marker, index) =>
     <Marker
       position={{ lat:marker._geoloc.lat, lng: marker._geoloc.lng }}
     />
   )}
   </GoogleMap>
  );
});

const ConnectedMap = connectHits(MapWithAMarker);

function Search() {
  return (
    <div className="container">

      <ConnectedMap
        googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={{ height: `400px` }} />}
        mapElement={<div style={{ height: `100%` }} />}
      />
    </div>
  );
}

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      trade: '',
      pc:'',
      radius:''
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleSubmit(event) {
     event.preventDefault();
     alert('A name was submitted: ' + this.state.trade + this.state.pc + this.state.radius);
    var client = algoliasearch("TIM81UW1UV", "833cbf062e3b7c3979155c0d07e3f058");
    var index = client.initIndex('batimat_dev');
    index.search({
      query: this.state.trade,
      aroundRadius: this.state.radius
    }).then(res => {
       console.log(res);
    });
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
            Votre métier:
            <select name="trade" value={this.state.trade} onChange={this.handleInputChange}>
              <option value="volvo">Volvo</option>
              <option value="saab">Saab</option>
              <option value="opel">Opel</option>
              <option value="audi">Audi</option>
            </select>
          </label>
          <label>
            Votre code postal:
            <input name="pc" type="text" value={this.state.pc} onChange={this.handleInputChange}/>
          </label>
          <label>
            Rayon d'action
            <input name="radius" type="range" min="100" max="10000" value={this.state.radius} onChange={this.handleInputChange} />
          </label>

          <input type="submit" value="Imprimer" />
        </form>
        </div>
      </div>
    );
  }
}

export default App;
