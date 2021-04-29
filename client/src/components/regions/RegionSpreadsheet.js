import React from 'react';
import { Route, useParams } from 'react-router-dom';

const RegionSpreadsheet = (props) => {

    let { _id } = useParams();

    let map =  props.maps.find(map => map._id === _id);

    return (
        <Route {...props} >
            <div>
                {_id}
            </div>
        </Route>
        
    );
};
export default RegionSpreadsheet;