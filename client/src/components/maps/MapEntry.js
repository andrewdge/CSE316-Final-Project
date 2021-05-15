import React, { useEffect, useState }            from 'react';
import world            from '../../images/world.png';
import Delete from '../modals/Delete';
import { WRow, WCol, WInput }   from 'wt-frontend';
import WButton from 'wt-frontend/build/components/wbutton/WButton';
import { useHistory, Link, NavLink } from 'react-router-dom';

const Map = (props) => {

    const [editingMapName, toggleEditingMapName] = useState(false);
    const [mapName, setMapName]                  = useState(props.entry.name);
    const [showDelete, setShowDelete]         = useState(false);

    const updateName = (e) => {
        setMapName(e.target.value);
        toggleEditing();
    }

    useEffect( () => {
        handleUpdateMapName();
    }, [mapName]);

    const handleUpdateMapName = async () => {
        toggleEditingMapName(false);
        await props.updateMapName(props.entry._id, mapName);
    }

    const handleDeleteMap = async () => {
        await props.deleteMap(props.entry._id);
        await props.refetch();
    }

    const handleShowDelete = () => {
        setShowDelete(!showDelete);
    }

    const toggleEditing = () => {
        toggleEditingMapName(!editingMapName);
    }

    const bubbleMapToTop = (entry) => {
        props.bubbleMapToTop(entry);
    }

    let history = useHistory();

    return (
        <> 
            {
                !editingMapName ? 
                <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '1%' }} >
                    <WRow>
                        <WCol size='3' style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                            <Link to={{ pathname: `/maps/${props.entry._id}` }} >
                                <WButton style={{ fontSize: '25px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} 
                                    onClick={() => bubbleMapToTop(props.entry)} size='large' shape='rounded' hoverAnimation='darken' clickAnimation='ripple-light'>
                                    {mapName}
                                </WButton>
                            </Link>
                        </WCol>
                        <WCol size='6'>
                            
                        </WCol>
                        <WCol size='1'>
                            <WButton wType='ghost' shape='rounded' hoverAnimation='darken' onClick={toggleEditing}>
                                <i className='material-icons'>edit</i>
                            </WButton>
                        </WCol>
                        <WCol size='2'>
                            <WButton wType='ghost' shape='rounded' hoverAnimation='darken' clickAnimation='ripple-light' onClick={handleShowDelete}>
                                <i className='material-icons'>delete</i>
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
                                inputType='text' name="mapName" autoFocus={true} onBlur={updateName} 
                                wType="outlined" barAnimation="solid" defaultValue={mapName}
                            />
                        </WCol>
                        <WCol size='5'>
                            &nbsp;
                        </WCol>
                        <WCol size='1'>
                            <WButton wType='ghost' shape='rounded' hoverAnimation='darken' clickAnimation='ripple-light' onClick={handleUpdateMapName}>
                                <i className='material-icons'>arrow_right_alt</i>
                            </WButton>
                        </WCol>
                        <WCol size='1'>
                            <WButton wType='ghost' shape='rounded' hoverAnimation='darken' clickAnimation='ripple-light' onClick={toggleEditing}>
                                <i className='material-icons'>close</i>
                            </WButton>
                        </WCol>
                        <WCol size='2'>
                            
                        </WCol>
                    </WRow>
                </div>
            }
            {showDelete && <Delete deleteFunction={handleDeleteMap} deleteName={props.entry.name} setShowDelete={setShowDelete} cancelFunction={handleShowDelete} />}
        </>
    );
};

export default Map;