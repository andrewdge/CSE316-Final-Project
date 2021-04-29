import React from 'react';
import { useParams } from 'react-router-dom';

const RegionSpreadsheet = (props) => {

    let { _id } = useParams();

    let map =  props.maps.find(map => map._id === _id);

    return (
        <div>
            {_id}
        </div>
        
    );
};
export default RegionSpreadsheet;