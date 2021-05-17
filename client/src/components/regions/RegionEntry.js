import React, { useState, useEffect, useRef } from 'react';
import { WCard, WRow, WCol, WButton, WInput } from 'wt-frontend';
import { Link, useHistory } from 'react-router-dom';
import Delete from '../modals/Delete';

const RegionEntry = (props) => {
    
    const name = props.entry.name;
    const capital = props.entry.capital;
    const leader = props.entry.leader;

    const isActive = props.index === props.row;
    const [editingName, toggleNameEdit] = useState(false);
    const [editingCapital, toggleCapitalEdit] = useState(false);
    const [editingLeader, toggleLeaderEdit] = useState(false);
    const [showDelete, setShowDelete]         = useState(false);

    let imageAddr;
    if (props.entry) {
        if (props.imageAddr.length > 0) {
            imageAddr =  "/" + props.imageAddr + "/" + props.entry.parentRegion.name + "/" + props.entry.name + " Flag.png";
        } else {
            if (props.entry.parentRegion) { 
                imageAddr = props.imageAddr + "/" + props.entry.parentRegion.name + "/" + props.entry.name + " Flag.png";
            }
        }   
    }
    

    useEffect(() => {
        toggleNameEdit(isActive && (props.col === 0));
        toggleCapitalEdit(isActive && (props.col === 1));
        toggleLeaderEdit(isActive && (props.col === 2));
    },[props.row, props.col])

    const handleNameEdit = (e) => {
        toggleNameEdit(false);
        props.setRow(-1);
        props.setCol(-1);
        const newName = e.target.value ? e.target.value : 'Untitled Region';
        const prevName = name;
        props.editRegion(props.entry._id, 'name', newName, prevName);
    };

    const handleCapitalEdit = (e) => {
        toggleCapitalEdit(false);
        props.setRow(-1);
        props.setCol(-1);
        const newCapital = e.target.value ? e.target.value : 'Untitled Capital';
        const prevCapital = capital;
        props.editRegion(props.entry._id, 'capital', newCapital, prevCapital);
    };

    const handleLeaderEdit = (e) => {
        toggleLeaderEdit(false);
        props.setRow(-1);
        props.setCol(-1);
        const newLeader = e.target.value ? e.target.value : 'Unnamed Leader';
        const prevLeader = leader;
        props.editRegion(props.entry._id, 'leader', newLeader, prevLeader);
    };


    const startNameEdit = () => {
        toggleNameEdit(!editingName);
        props.setRow(props.index);
        props.setCol(0);
    };
    
    const startCapitalEdit = () => {
        toggleCapitalEdit(!editingCapital);
        props.setRow(props.index);
        props.setCol(1);
    };

    const startLeaderEdit = () => {
        toggleLeaderEdit(!editingLeader);
        props.setRow(props.index);
        props.setCol(2);
    };

    useEffect(() => {
        function handleKeyPress(e) {
            if (editingName){
                if (e.key === 'ArrowDown'){
                    if (props.row < props.len-1) {
                        handleNameEdit(e);
                        props.setRow(props.index+1);
                        props.setCol(0);
                    }
                }
                if (e.key === 'ArrowUp'){
                    if (props.row > 0) {
                        handleNameEdit(e);
                        props.setRow(props.index-1);
                        props.setCol(0);
                    }
                }
                if (e.key === 'ArrowLeft'){
                    if (props.col > 0) {
                        handleNameEdit(e);
                        props.setRow(props.index);
                        props.setCol(props.col-1);
                    }
                }
                if (e.key === 'ArrowRight'){
                    if (props.col < 2) {
                        handleNameEdit(e);
                        props.setRow(props.index);
                        props.setCol(props.col+1);
                    }
                }
            }
            if (editingCapital){
                if (e.key === 'ArrowDown'){
                    if (props.row < props.len-1) {
                        handleCapitalEdit(e);
                        props.setRow(props.index+1);
                        props.setCol(1);
                    }
                }
                if (e.key === 'ArrowUp'){
                    if (props.row > 0) {
                        handleCapitalEdit(e);
                        props.setRow(props.index-1);
                        props.setCol(1);
                    }
                }
                if (e.key === 'ArrowLeft'){
                    if (props.col > 0) {
                        handleCapitalEdit(e);
                        props.setRow(props.index);
                        props.setCol(props.col-1);
                    }
                }
                if (e.key === 'ArrowRight'){
                    if (props.col < 2) {
                        handleCapitalEdit(e);
                        props.setRow(props.index);
                        props.setCol(props.col+1);
                    }
                }
            }
            if (editingLeader){
                if (e.key === 'ArrowDown'){
                    if (props.row < props.len-1) {
                        handleLeaderEdit(e);
                        props.setRow(props.index+1);
                        props.setCol(2);
                    }
                }
                if (e.key === 'ArrowUp'){
                    if (props.row > 0) {
                        handleLeaderEdit(e);
                        props.setRow(props.index-1);
                        props.setCol(2);
                    }
                }
                if (e.key === 'ArrowLeft'){
                    if (props.col > 0) {
                        handleLeaderEdit(e);
                        props.setRow(props.index);
                        props.setCol(props.col-1);
                    }
                }
                if (e.key === 'ArrowRight'){
                    if (props.col < 2) {
                        handleLeaderEdit(e);
                        props.setRow(props.index);
                        props.setCol(props.col+1);
                    }
                }
            }
        }
        document.addEventListener('keydown', handleKeyPress);
        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        }
    }, [editingName, editingCapital, editingLeader]);

    // console.log(props.row);
    // console.log(props.col);


    const history = useHistory();

    const deleteSubregion = async () =>{
        await props.deleteSubregion(props.entry);
        await props.refetchRegions();
    }

    const handleShowDelete = () => {
        setShowDelete(!showDelete);
    }

    const goToSubregion = async () => {
        props.clearTPS();
    }

    let landmarks;
    if (props.entry.landmarks.length === 0) {
        landmarks = 'No Landmarks';
    } else if (props.entry.landmarks.length === 1) {
        landmarks = props.entry.landmarks[0].name;
    } else {
        landmarks = 
            props.entry.landmarks.map((entry, index) => 
            index !== props.entry.landmarks.length-1 ? entry.name + ", " : entry.name);
    }

            

    return (
        <>
            <WCard style={{ height: '60px', width: '100%', borderStyle: 'solid' }}>
                <WRow style={{ height: '100%', width: '100%'}}>
                    <WCol size='1' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <WButton shape='rounded' hoverAnimation='lighten' clickAnimation='ripple-light' onClick={handleShowDelete}>
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
                                    onClick={startNameEdit}
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
                                    onClick={startCapitalEdit}
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
                                    onClick={startLeaderEdit}
                                >{leader}
                                </div>
                        }
                    </WCol>
                    <WCol size='2' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <img style={{ maxHeight: '50px'}} src={imageAddr} alt='No Flag :('></img>
                    </WCol>
                    <WCol size='3' style={{ display: 'flex'}}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '400px' }}>
                            <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis'}}>
                                <Link to={{ pathname: `/regionviewer/${props.entry._id}` }} onClick={props.clearTPS}>
                                    <WButton wType='texted' color='success' hoverAnimation='darken' clickAnimation='ripple-light' >
                                        {landmarks}
                                    </WButton>
                                </Link>
                            </div>
                        </div>
                    </WCol>
                </WRow>
            </WCard>
            {showDelete && <Delete deleteFunction={deleteSubregion} deleteName={props.entry.name} setShowDelete={setShowDelete} cancelFunction={handleShowDelete} />}
        </>
    );
};
export default RegionEntry;