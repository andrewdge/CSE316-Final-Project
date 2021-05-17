import React, { useState } from 'react';
import { WCard, WRow, WCol, WButton, WInput } from 'wt-frontend';
import { Link, useHistory } from 'react-router-dom';
import Delete from '../modals/Delete';

const LandmarkEntry = (props) => {

    const history = useHistory();

    let name = props.entry.name;
    let location = props.entry.location;
    const [editingName, toggleNameEdit] = useState(false);
    const [showDelete, setShowDelete]   = useState(false);

    const handleNameEdit = (e) => {
        toggleNameEdit(false);
        const newName = e.target.value ? e.target.value : 'Untitled Landmark';
        const prevName = name;
        props.editLandmark(props.entry._id, 'name', newName, prevName);
    };

    const handleDeleteLandmark = async () => {
        props.deleteLandmark(props.entry);
    }

    const handleShowDelete = () => {
        setShowDelete(!showDelete);
    }

    return (
        <>
            <WRow style={{ height: '40px', width: '100%', display: 'flex'}}>
                {
                    props.canDelete ?
                        <WButton size='small' style={{ color: 'red', backgroundColor: 'black' }} onClick={handleShowDelete} shape='rounded' hoverAnimation='darken' clickAnimation='ripple-light'>
                            <i className='material-icons'>clear</i>
                        </WButton>
                    :
                        <div style={{ marginLeft: '55px'}}></div>
                }
                
                <div style={{ color: 'lightgrey', fontSize: '1.125rem', marginLeft: '30px', display: 'flex', alignItems: 'center' }}>
                    {
                        editingName
                            ? <WInput
                                className='landmark-input' onBlur={handleNameEdit}
                                autoFocus={true} defaultValue={name} type='text'
                                wType="outlined" inputClass="landmark-input-class"
                            />
                            : <div className="table-text"
                                onClick={() => toggleNameEdit(!editingName)}
                            >{name}
                            </div>
                    }
                    {props.entry.location && 
                        <div style={{ marginLeft: '10px', marginRight: '10px' }}>
                        {`  - `}
                        </div>
                    } 
                    {props.entry.location}
                </div>
            </WRow>
            {showDelete && <Delete deleteFunction={handleDeleteLandmark} deleteName={props.entry.name} setShowDelete={setShowDelete} cancelFunction={handleShowDelete} />}
        </>
    );
};
export default LandmarkEntry;