import React from 'react';
import { useParams } from 'react-router-dom';
import WCard from 'wt-frontend/build/components/wcard/WCard';
import WCContent from 'wt-frontend/build/components/wcard/WCContent';
import WCHeader from 'wt-frontend/build/components/wcard/WCHeader';

const RegionSpreadsheet = (props) => {

    let { _id } = useParams();

    let map =  props.maps.find(map => map._id === _id);

    return (
        <WCard wLayout="header-content" style={{ width: "90%", height: "87%", marginTop: '3%', marginLeft: '5%' }} raised>
            <WCHeader>
                hi
            </WCHeader>
            <WCContent>
                <WCard wLayout='header-content'>
                    <WCHeader>
                        ok
                    </WCHeader>
                    <WCContent>
                        no
                    </WCContent>
                </WCard>
            </WCContent>
        </WCard>        
    );
};
export default RegionSpreadsheet;