import React, { Component } from 'react'
import { Map, GoogleApiWrapper, Marker, InfoWindow } from 'google-maps-react';
export class MapComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            latitude: 0,
            longitude: 0,
            isAddress: true,
            address: null,
            showingInfoWindow: false,
            activeMarker: {},
            selectedPlace: {},
            count: 0
        }
    }

    reset() {
        this.setState({ count: 0 });
    }

    onMarkerClick = (props, marker, e) => {
        this.setState({
            selectedPlace: props,
            activeMarker: marker,
            showingInfoWindow: true
        });
    }

    onInfoWindowClose = () => {
        this.setState({
            activeMarker: null,
            showingInfoWindow: false
        });
    };

    componentDidMount() {
        clearTimeout(mapID);
        var mapID = setTimeout(() => {
            const count = this.state.count;
            this.setState({ count: count + 1 });
        }, 2000);
      }

    render() {
        return (<div className="job-map">
            <Map
                google={this?.props?.google}
                zoom={18}
                center={{
                    lat: this?.props?.latitude,
                    lng: this?.props?.longitude
                }}
            >

                <Marker key="marker_1"
                    position={{

                        lat: this?.props?.latitude,

                        lng: this?.props?.longitude

                    }}
                    onClick={this?.onMarkerClick}
                />
                <InfoWindow
                    marker={this?.state?.activeMarker}
                    onClose={this?.onInfoWindowClose}
                    visible={this?.state?.showingInfoWindow}
                >
                    <div>
                        <p>{this?.props?.address}</p>
                        <h4><a target="_blank" jstcache="6" href={`https://www.google.com/maps/search/?api=1&query=${this?.props?.address}`} > <span>Open With Map</span> </a></h4>
                    </div>
                </InfoWindow>
            </Map>
        </div>);
    }
}

export default GoogleApiWrapper({

    apiKey: (`${process.env.REACT_APP_GOOGLE_MAP_API_KEY}`)

})(MapComponent);