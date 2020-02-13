import React, {Component} from 'react';

// import svg images for icons
import breezy from '../icons/breezy.svg'
import cloudy from '../icons/cloudy.svg';
import like from '../icons/like.svg';
import rain from '../icons/rain.svg';
import snow from '../icons/snow.svg';
import sun from '../icons/sun.svg';
import error404 from '../icons/404-error.svg';

class Forecast extends Component {

  constructor(props) {
    super(props);

    this.displayImage = this.displayImage.bind(this);
  }

  displayImage(text) {
    switch(text) {
      case "Breezy": 
        return breezy;
      case "Clouds":
        return cloudy;
      case "Rain":
        return rain;
      case "Showers":
        return rain;
      case "Sun": 
        return sun;
      case "Snow":
        return snow;
      case "Clear":
        return like;
      default: 
        return error404;
      
    }
  }
  
  render() {

    const forecast = this.props.forecast;
    const weatherItems = []; 

    for(let day of forecast ) {
      weatherItems.push(
        <tr key={ day.dt }>
          <td>{ day.datestring }</td>
          <td> { Math.round(day.main.temp_max)}&deg;C </td>
          <td>{ Math.round(day.main.temp_min) } &deg;C</td>
          <td>{ Math.round(day.main.feels_like) } &deg;C</td>
          <td> 
            <img src={ this.displayImage( day.weather[0].main ) } alt={ day.weather[0].main } className="icons" />
            { day.weather[0].main }
          </td>
          <td> { Math.round(day.wind.speed) } km/h</td>
        </tr>
      );
    }

    return(
      <div className="container">
        <table className="table table-dark">
          <thead>
            <tr>
              <th>Date</th>
              <th>High</th>
              <th>Low</th>
              <th>Feels Like</th>
              <th>Description</th>
              <th>Wind Speed</th>
            </tr>
          </thead>
          <tbody className="table-striped">
            {weatherItems}
          </tbody>
        </table>
      </div>
    );
  }

}

export default Forecast;