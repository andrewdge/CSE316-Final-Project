import React, { useState } from 'react';
import { WCard, WRow, WCol, WButton, WInput } from 'wt-frontend';
import { Link, useHistory } from 'react-router-dom';

const RegionEntry = (props) => {
    
    const name = props.entry.name;
    const capital = props.entry.capital;
    const leader = props.entry.leader;
    const [editingName, toggleNameEdit] = useState(false);
    const [editingCapital, toggleCapitalEdit] = useState(false);
    const [editingLeader, toggleLeaderEdit] = useState(false);

    const handleNameEdit = (e) => {
        toggleNameEdit(false);
        const newName = e.target.value ? e.target.value : 'Untitled Region';
        const prevName = name;
        props.editRegion(props.entry._id, 'name', newName, prevName);
    };

    const handleCapitalEdit = (e) => {
        toggleCapitalEdit(false);
        const newCapital = e.target.value ? e.target.value : 'Untitled Capital';
        const prevCapital = capital;
        props.editRegion(props.entry._id, 'capital', newCapital, prevCapital);
    };

    const handleLeaderEdit = (e) => {
        toggleLeaderEdit(false);
        const newLeader = e.target.value ? e.target.value : 'Unnamed Leader';
        const prevLeader = leader;
        props.editRegion(props.entry._id, 'leader', newLeader, prevLeader);
    };

    console.log(props.entry);


    const history = useHistory();

    const deleteSubregion = async () =>{
        await props.deleteSubregion(props.entry);
        await props.regionRefetch();
    }

    const goToSubregion = async () => {
        props.clearTPS();
        await props.regionRefetch();
    }

    let landmarks;
    if (props.entry.landmarks.length == 0) landmarks = 'No Landmarks';
    if (props.entry.landmarks.length == 1) landmarks = props.entry.landmarks.map(entry => entry.name);
    else landmarks = 
            props.entry.landmarks.map((entry, index) => 
            index !== props.entry.landmarks.length-1 ? entry.name + ", " : entry.name);
            

    return (
        <WCard style={{ height: '60px', width: '100%', borderStyle: 'solid' }}>
            <WRow style={{ height: '100%', width: '100%'}}>
                <WCol size='1' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <WButton shape='rounded' hoverAnimation='lighten' clickAnimation='ripple-light' onClick={deleteSubregion}>
                        <i className='material-icons'>clear</i>
                    </WButton>
                    <Link to={{ pathname: `/regions/${props.entry._id}` }}>
                        <WButton wType='ghost' style={{ color: 'deepskyblue' }} onClick={goToSubregion} hoverAnimation='darken' >   
                            <i className='material-icons'>subdirectory_arrow_right</i>
                        </WButton>
                    </Link>
                </WCol>
                <WCol size='2' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    {
                        editingName
                            ? <WInput
                                className='table-input' onBlur={handleNameEdit}
                                autoFocus={true} defaultValue={name} type='text'
                                wType="outlined" inputClass="table-input-class"
                            />
                            : <div className="table-text"
                                onClick={() => toggleNameEdit(!editingName)}
                            >{name}
                            </div>
                    }
                </WCol>
                <WCol size='2' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    {
                        editingCapital
                            ? <WInput
                                className='table-input' onBlur={handleCapitalEdit}
                                autoFocus={true} defaultValue={capital} type='text'
                                wType="outlined" inputClass="table-input-class"
                            />
                            : <div className="table-text"
                                onClick={() => toggleCapitalEdit(!editingCapital)}
                            >{capital}
                            </div>
                    }
                </WCol>
                <WCol size='2' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    {
                        editingLeader
                            ? <WInput
                                className='table-input' onBlur={handleLeaderEdit}
                                autoFocus={true} defaultValue={leader} type='text'
                                wType="outlined" inputClass="table-input-class"
                            />
                            : <div className="table-text"
                                onClick={() => toggleLeaderEdit(!editingLeader)}
                            >{leader}
                            </div>
                    }
                </WCol>
                <WCol size='2' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    flag here
                </WCol>
                <WCol size='3' style={{ display: 'flex'}}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '400px' }}>
                        <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis'}}>
                            {landmarks}
                        </div>
                    </div>
                    
                </WCol>
            </WRow>
        </WCard>
    );
};
export default RegionEntry;