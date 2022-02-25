import React, { useEffect } from 'react'
import { YMaps, Map, Placemark, FullscreenControl, ZoomControl } from 'react-yandex-maps'


export const NavoiyMap = ({ lat, lang }) => {


    return (

        <YMaps   >
            <div>
                <Map
                    width="100%"
                    height="500px"
                    defaultState={{
                        center: [lat, lang],
                        zoom: 9,
                    }}
                >
                    <Placemark geometry={[lat, lang]} />
                    <FullscreenControl />
                    <ZoomControl options={{ float: 'right' }} />
                </Map>
            </div>
        </YMaps>


    )
}
