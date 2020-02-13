import axios from 'axios';
import React, { Component } from 'react';
import logo from './logo.svg';
import warning from './icons/warning.svg';
import './App.css';

import Forecast from './components/Forecast';

const cities = require('./data/cities.json')

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
      error: ""
    };
  }

  componentDidMount() {
    const list = cities.data;
    this.setState({ cities: list });
  }

  findCityID(cityname) {
    const list = cities.data;
    const result = list.find( city => city.name === cityname );
      return result;
  }

  formSubmit(e) {

    e.preventDefault();
    const key = process.env.REACT_APP_SECRET;
    const param = this.state.city;
    const cityinfo = this.findCityID(param);

    const url = `http://api.openweathermap.org/data/2.5/forecast?id=${cityinfo.id}&appid=${key}&units=metric`;

    // GET from OpenWeather API using CityID (https://openweathermap.org/)
    axios.get(url)
      .then( (response) => {
        console.log('response', response);
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
        this.setState({ error: true })
      });    
  }
  
  getDate(dt) {
      return new Date(dt);
  }

  handleChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    this.setState( {[name]: value } );
  }
 
  render() {

    // Error conditional render
    let error = null;
    if(this.state.error === true ) {
      error = (
        <div className="container">
          <h4>Whoops! Sorry! Something went wrong and weather information was not obtained.</h4>
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
      <option value={city.name} key={city.id}>{city.name}</option>
      ))  
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
          <small>Icons made by <a href="https://www.flaticon.com/authors/smashicons" title="Cloud">Cloud</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank" rel="noopener noreferrer">CC 3.0 BY</a></small>
          <small>Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a></small>
        </div>      
      </div>
      </div>
    );
  }
}

export default App;
