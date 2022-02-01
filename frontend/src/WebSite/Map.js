import React from 'react';
import { GoogleMap, withScriptjs, withGoogleMap } from 'react-google-maps'


export const Map = () => {

    function Gmap() {
        return (
            <GoogleMap
                defaultZoom={17}
                defaultCenter={{ lat: 40.092598, lng: 65.369673 }}
            />
        )
    }

    const WrappedMap = withScriptjs(withGoogleMap(Gmap))

    return <div style={{width:"100vw" }}>
        <WrappedMap googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places`}
            loadingElement={<div style={{ height: `100%` }} />}
            containerElement={<div style={{ height: `400px` }} />}
            mapElement={<div style={{ height: `100%` }} />}
        />
    </div>
};
