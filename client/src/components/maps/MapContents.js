import React, { useState } from 'react';
import MapList from './MapList';
import { WCard, WCHeader, WCContent, WCMedia, WRow, WCol, WInput } from 'wt-frontend';
import WButton from 'wt-frontend/build/components/wbutton/WButton';
import world            from '../../images/world.png';

const MapContents = (props) => {

    const [mapName, setMapName] = useState('');

    const handleCreateNewMap = () => {
        props.createNewMap(mapName);
    };

    const updateInput = (e) => {
		const { value } = e.target;
        e.target.value='';
		setMapName(value);
	};

    return (
        <WCard wLayout="header-content" style={{ width: "90%", height: "87%", marginTop: '3%', marginLeft: '5%' }} raised>
            <WCHeader className='map-title'>  
                Your Maps 
            </WCHeader>
            <WCContent style={{ display: 'flex', flexDirection: 'row'}}>
                <WCard className='map-entries' raised style={{ backgroundColor: 'salmon', width: '50%', height: '100%' }}>
                    <MapList 
                        maps={props.maps} deleteMap={props.deleteMap} updateMapName={props.updateMapName}
                    />
                </WCard>
                <WCard raised style={{ backgroundColor: 'white', width: '50%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'}}>
                    <img style={{ width: '70%', height: '80%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '3%', marginLeft: '15%', marginBottom: '4%'}} 
                        src={world} alt='world'  
                    />
                    <WRow>
                        <WCol size='3'>
                            <WButton 
                                style={{ display: 'flex', justifyContent: 'center', backgroundColor: 'red', color: 'white', width: '100%', height: '100%' }} 
                                hoverAnimation='darken' clickAnimation='ripple-light' onClick={handleCreateNewMap} raised>
                                Create New Map
                            </WButton>
                        </WCol>
                        <WCol size='9'>
                            <WInput className='modal-input' style={{ color: 'black' }} onBlur={updateInput} name='mapname' labelAnimation="up" barAnimation="solid" labelText="Enter Map Name Here" hoverAnimation='solid' wType="outlined" inputType='text' />
                        </WCol>
                        
                    </WRow>
                    
                </WCard>
            </WCContent>
        </WCard>  
    );
}

export default MapContents;

