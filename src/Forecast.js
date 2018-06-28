import React, {Component} from 'react';
import S from 'string';

// import svg images for icons
import breezy from './icons/breezy.svg'
import cloudy from './icons/cloudy.svg';
import rain from './icons/rain.svg';
import sun from './icons/sun.svg';
import error404 from './icons/404-error.svg';

class Forecast extends Component {
    constructor(props) {
        super(props);

        this.displayImage = this.displayImage.bind(this);
    }

    displayImage(text) {
        if ( S(text).contains("Breezy") ) {
            return breezy;
        } else if( S(text).contains("Cloudy")  ) {
            return cloudy;
        } else if ( S(text).contains("Rain") || S(text).contains("Showers") ) {
            return rain;
        } else if ( S(text).contains("Sun") ) {
            return sun;
        } else {
            console.error("ERROR: No icon prepared for " + text );
            return error404;
        }
    }

    render() {

        const forecast = this.props.forecast;
        const weatherItems = [];

        for(let i = 0; i < forecast.length; i++ ) {
            weatherItems.push(
                <tr key={forecast[i].date}>
                    <td>{forecast[i].date }</td>
                    <td>{forecast[i].day }</td>
                    <td> {forecast[i].high }&deg;C 
                    </td>
                    <td>{forecast[i].low } &deg;C</td>
                    <td> 
                        <img src={this.displayImage(forecast[i].text)} alt={forecast[i].text } className="icons" />
                        {forecast[i].text }
                    </td>
                </tr>
            )
        }

        return(
            <div className="container">
                <table className="table table-dark">
                    <thead>`
                        <tr>
                            <th>Date</th>
                            <th>Day</th>
                            <th>High</th>
                            <th>Low</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody className="table-striped">`
                        {weatherItems}
                    </tbody>
                </table>
            </div>
        );
    }

}

export default Forecast;