import React, { useState }            from 'react';
import world            from '../../images/world.png';
import { WRow, WCol, WInput }   from 'wt-frontend';
import WButton from 'wt-frontend/build/components/wbutton/WButton';

const Map = (props) => {

    const [editingMapName, toggleEditingMapName] = useState(false);

    const handleMapNameEdit = (e) => {
        e.stopPropagation();
        toggleEditingMapName(false);
    }

    const handleUpdateMapName = (e) => {
        handleMapNameEdit(e);
        const { value } = e.target;
        props.updateMapName(props.entry._id, value);
    }

    return (
        <> 
            {
                !editingMapName ? 
                <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '1%' }}>
                    <WRow>
                        <WCol size='3' style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                            <WButton style={{ fontSize: '25px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} size='large' shape='rounded' hoverAnimation='darken' clickAnimation='ripple-light'>
                                {props.entry.name}
                            </WButton>
                        </WCol>
                        <WCol size='7'>
                            &nbsp;
                        </WCol>
                        <WCol size='2'>
                            <WButton wType='ghost' shape='rounded' hoverAnimation='darken' onClick={() => toggleEditingMapName(!editingMapName)}>
                                <i className='material-icons'>edit</i>
                            </WButton>
                        </WCol>
                    </WRow>
                </div>
                :
                <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '1%' }}>
                    <WRow>
                        <WCol size='3' style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                            <WInput
                                style={{ backgroundColor: 'white', color: 'black', fontSize: '25px', fontFamily: 'inherit'}}
                                onBlur={handleUpdateMapName}
                                autoFocus={true} inputType='text' name="mapName"
                                wType="outlined" barAnimation="solid" defaultValue={props.entry.name}
                            />
                            {/* <WInput style={{ fontSize: '25px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} size='large' shape='rounded' hoverAnimation='darken' clickAnimation='ripple-light'>
                                {props.entry.name}
                            </WInput> */}
                        </WCol>
                        <WCol size='6'>
                            &nbsp;
                        </WCol>
                        {/* <WCol size='1'>
                            <WButton wType='ghost' shape='rounded' hoverAnimation='darken' clickAnimation='ripple-light' onClick={}>
                                <i className='material-icons'>arrow_right_alt</i>
                            </WButton>
                        </WCol> */}
                        <WCol size='1'>
                            <WButton wType='ghost' shape='rounded' hoverAnimation='darken' clickAnimation='ripple-light' onClick={() => toggleEditingMapName(!toggleEditingMapName)}>
                                <i className='material-icons'>close</i>
                            </WButton>
                        </WCol>
                        <WCol size='2'>
                            <WButton wType='ghost' shape='rounded' hoverAnimation='darken' clickAnimation='ripple-light' onClick={() => props.deleteMap(props.entry._id)}>
                                <i className='material-icons'>delete</i>
                            </WButton>
                        </WCol>
                    </WRow>
                </div>
            }
        </>
    );
};

export default Map;