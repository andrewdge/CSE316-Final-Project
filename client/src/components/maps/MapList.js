import React from 'react'
import MapEntry from './MapEntry';

const MapList = (props) => {
    return (
        <div style={{ marginTop: '5%', marginLeft: '3%', marginBottom: '5%' }} >
            {
                props.maps.map((entry, index) => (
                    <MapEntry
                        key={entry._id} index={index} entry={entry} 
                        deleteMap={props.deleteMap} updateMapName={props.updateMapName}
                    />
                ))
            }
        </div>
    )
};

export default MapList;
