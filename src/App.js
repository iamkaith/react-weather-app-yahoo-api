import axios from 'axios';
import React, { Component } from 'react';
import logo from './logo.svg';
import warning from './icons/warning.svg';
import './App.css';

import Forecast from './components/Forecast';

const cities = require('./data/cities.json')
let config;

//if(process.env.NODE_ENV === "development") {
// config = require('./config/config.json')
//}

class App extends Component {

  constructor(props){
    super(props);
    
    this.handleChange = this.handleChange.bind(this);
    this.formSubmit = this.formSubmit.bind(this);
    this.findCityID = this.findCityID.bind(this);
    this.getDate = this.getDate.bind(this);

    this.state = {
      city: "",
      cities: [], 
      forecast: [],
      error: "",
      errormsg: ""
    };
  }

  // Load cities data
  componentDidMount() {
    const list = cities.data;
    this.setState({ cities: list });
  }

  // Find city ID for GET request below
  findCityID(cityname) {
    const list = cities.data;
    const result = list.find( city => city.name === cityname );
      return result;
  }


  // GET from OpenWeather API using CityID (https://openweathermap.org/)
  formSubmit(e) {

    e.preventDefault();
    const key = process.env.REACT_APP_SECRET; 

    const param = this.state.city;
    if(param === "") {
      this.setState({ error: true, errormsg: "Whoops! Please select a location and try again." });

    } else {
    
      const cityinfo = this.findCityID(param);
      const url = `https://api.openweathermap.org/data/2.5/forecast?id=${cityinfo.id}&appid=${key}&units=metric`;

      axios.get(url)
        .then( (response) => {
          let data = response.data.list;
          let forecast = [];

          for(let day of data) {
            let date = this.getDate(day.dt_txt);
            const options = { weekday: 'long', month:'short', day: 'numeric', hour:'numeric' };

            day.datestring = date.toLocaleDateString(undefined, options);
            forecast.push(day);
          }

          this.setState({ forecast: forecast });

        })
        .catch( (err)  => {
          console.error(err);
          this.setState({ error: true, errormsg: "Whoops! Sorry! Something went wrong and weather information was not obtained." });
        }); 
    }
  }
 
  // Date transformation
  getDate(dt) {
    return new Date(dt);
  }

  // Handle location picklist 
  handleChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    this.setState( {[name]: value, error: false, errormsg: "" } );
  }

  // Render
  render() {

    // Error conditional render
    let error = null;
    if(this.state.error === true ) {
      error = (
        <div className="alert alert-danger">
          <p> {this.state.errormsg} </p>
          <img src={warning} alt="Error" className="icons" />
        </div>
      );
    }

    // Forecast table conditional render
    let forecast = null;
    if(this.state.forecast.length > 0 ) {
      forecast = <Forecast forecast={this.state.forecast} />;
    }

    // Cities selection dropdown render
    let cities = null;
    if(this.state.cities.length > 0 ) {
      cities = this.state.cities.map((city) => (
      <option value={city.name} key={city.id} required>{city.name}</option>
      )); 
    }

    return (
      <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>

      <div className="container">
      
      <div className="jumbotron">
        <h1 className="display-4">Hey there!</h1>
        <p className="lead">I heard you were looking for a weather forecast. Pick your city from the list and you'll receive 3-hour interval forecast for the next couple of days!</p>
      </div>

      <form onSubmit={this.formSubmit} >
        <div className="form-group">
          <select htmlFor="city" name="city" className="form-control" value={this.state.city} onChange={this.handleChange}>
            <option value="" disabled defaultValue>Select location</option>
            {cities}
          </select>
          <button type="submit" className="btn btn-primary">Submit</button>
          </div>
      </form>
      
      {forecast}
      {error}

        <div>
          <p>
            <small>Icons made by <a href="https://www.flaticon.com/authors/smashicons" title="Cloud">Cloud</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank" rel="noopener noreferrer">CC 3.0 BY</a></small>
            <br/>
            <small>Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a></small>
          </p>
        </div>      
      </div>
      </div>
    );
  }
}

export default App;