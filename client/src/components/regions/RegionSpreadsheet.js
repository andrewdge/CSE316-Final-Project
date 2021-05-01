import React from 'react';
import { useParams } from 'react-router-dom';
import { WCard, WCContent, WCHeader, WRow, WCol, WButton } from 'wt-frontend';

const RegionSpreadsheet = (props) => {

    let { _id } = useParams();

    let activeMap =  props.maps.find(map => map._id === _id);

    return (
        <>
            <WRow style={{ height: '5%', width: '90%', marginTop: '2%', marginLeft: '5%'}}>
                <WCol size='3'>
                    <WButton shape='rounded' hoverAnimation='lighten' clickAnimation='ripple-light'>
                        <i className='material-icons'>add_box</i>
                    </WButton>
                </WCol>
            </WRow>
            <WCard wLayout="header-content" style={{ width: "90%", height: "82%", marginTop: '1%', marginLeft: '5%' }} raised>
                <WCHeader style={{ backgroundColor: 'salmon'}}>
                    <WRow style={{ width: '100%', height: '100%'}}>
                        <WCol size='1'>

                        </WCol>
                        <WCol size='2' className='header-title'>
                            Name
                        </WCol>
                        <WCol size='2' className='header-title'>
                            Capital
                        </WCol><WCol size='2' className='header-title'>
                            Leader
                        </WCol><WCol size='2' className='header-title'>
                            Flag
                        </WCol><WCol size='2' className='header-title'>
                            Landmarks
                        </WCol>
                    </WRow>
                </WCHeader>
                <WCContent>
                    <WCard>
                        
                    </WCard>
                </WCContent>
            </WCard>    
        </>    
    );
};
export default RegionSpreadsheet;