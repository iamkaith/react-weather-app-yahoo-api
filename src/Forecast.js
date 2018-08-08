import React, {Component} from 'react';

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
        if ( text.includes("Breezy") ) {
            return breezy;
        } else if( text.includes("Cloudy")  ) {
            return cloudy;
        } else if ( text.includes("Rain") || text.includes("Showers") ) {
            return rain;
        } else if ( text.includes("Sun") ) {
            return sun;
        } else {
            console.error("ERROR: No icon prepared for " + text );
            return error404;
        }
    }

    render() {

        const forecast = this.props.forecast;
        const weatherItems = [];       

        for(let day of forecast ) {
            weatherItems.push(
                <tr key={ day.date }>
                    <td>{ day.date }</td>
                    <td>{ day.day }</td>
                    <td> { day.high }&deg;C 
                    </td>
                    <td>{ day.low } &deg;C</td>
                    <td> 
                        <img src={ this.displayImage(day.text) } alt={ day.text } className="icons" />
                        { day.text }
                    </td>
                </tr>
            );
        }

        return(
            <div className="container">
                <table className="table table-dark">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Day of the Week</th>
                            <th>High</th>
                            <th>Low</th>
                            <th>Description</th>
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