import axios from 'axios';
import React, { Component } from 'react';
import fahrenheitToCelsius from 'fahrenheit-to-celsius';
import logo from './logo.svg';
import warning from './icons/warning.svg';
import './App.css';

// My Components
import Forecast from './Forecast';

class App extends Component {
  
  constructor(props){
    super(props);
    
    this.handleChange = this.handleChange.bind(this);
    this.formSubmit = this.formSubmit.bind(this);
    
    this.state = {
      city: "",
      forecast: [],
      error: ""
    };
  }
  
  formSubmit(e) {
    e.preventDefault();
    console.log('submit');
    
    const param = this.state.city + ', bc';
    const url = `https://query.yahooapis.com/v1/public/yql?format=json&q=select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="${param}")`;
    
    // GET from Yahoo Weather API
    // If successful: prep data for Forecast Component (convert temp)
    axios.get(url)
    .then( (response) => {
      console.log('response', response);
      let forecast = response.data.query.results.channel.item.forecast;
      
      for(let i = 0; i < forecast.length; i++ ) {
        let high = parseInt(forecast[i].high, 10);
        high = Math.round(fahrenheitToCelsius(high));
        
        let low = parseInt(forecast[i].low, 10);
        low = Math.round(fahrenheitToCelsius(low));
        
        forecast[i].high = high;
        forecast[i].low = low;
      }
      
      this.setState({ forecast: forecast });
    })
    .catch( (err)  => {
      console.error(err);
      this.setState({ error: true })
    });    
  }
  
  handleChange(e) {
    //console.log(e.target);
    const name = e.target.name;
    const value = e.target.value;
    this.setState( { [name]: value} );
  }
  
  render() {

    // Error conditional render
    let error = null;
    if(this.state.error === true ) {
      error = (
        <div className="container">
          <h4>Omg! Something went wrong, I couldn't get the weather data </h4>
          <img src={warning} alt="Error" className="icons" />
        </div>
      );
    }

    // Table conditional render
    let forecast = null;
    if(this.state.forecast.length !== 0 ) {
      forecast = <Forecast forecast={this.state.forecast} />;
    }

    return (
      <div className="App">
      <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <h1 className="App-title">Weather App</h1>
      </header>
      
      <div className="container">
      
      
      <div className="jumbotron">
        <h1 className="display-4">Hey there!</h1>
        <p className="lead">I heard you want to check out the forecast for your favourite Lowermainland cities, use the form below and let's check it out.</p>
      </div>
      
      <form onSubmit={this.formSubmit} >
        <label>Pick a city: </label>
        <select name="city" value={this.state.city} onChange={this.handleChange}>
          <option value="vancouver">Vancouver</option>
          <option value="burnaby">Burnaby</option>
          <option value="surrey">Surrey</option>
          <option value="new-west">New Westminster</option>
          <option value="langley">Langley</option>
        </select>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
      
      <br />
      
      {forecast}
      
      {error}

        <div><small>Icons made by <a href="https://www.flaticon.com/authors/smashicons" title="Cloud">Cloud</a> from <a href="https://www.flaticon.com/"     title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/"     title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></small></div>      
      </div>
      </div>
    );
  }
}

export default App;
