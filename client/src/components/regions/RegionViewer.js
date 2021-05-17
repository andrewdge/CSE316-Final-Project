import React, { useEffect, useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { WCard, WRow, WCol, WLayout, WLMain, WLHeader, WButton, WCHeader, WCContent, WInput } from 'wt-frontend';
import NavbarOptions from '../navbar/NavbarOptions';
import { useParams, useHistory, Link, useLocation } from 'react-router-dom';
import { GET_REGION_BY_ID } 				from '../../cache/queries';
import LandmarkEntry from '../landmarks/LandmarkEntry';
import ChangeParent from '../modals/ChangeParent';

const RegionViewer = (props) => {

    

    let { _id } = useParams();
    let history = useHistory();
    let location = useLocation();

    const getData = async () => {
        await props.getRegionById({ variables: { _id: _id }});
        await props.getLineage({ variables: {_id: _id }});
        await props.getChildLandmarks({ variables: {_id: _id }});
        if (props.lineage[0]) {
            let id = props.lineage[0]._id;
            await props.getAllSubregions({ variables: { _id: id, currId: _id }});
        }
    }


    useEffect(() => {
        getData();
    }, [props.subregions, _id, location.pathname]);

    let imageAddr;
    let addr;
    if (props.lineage && props.activeRegion) {
        addr = props.lineage.map(reg => reg.name).join('/');
        if (addr.length > 0) {
            imageAddr =  "/" + addr + "/" + props.activeRegion.name + " Flag.png";
        } else {
            imageAddr = addr + "/" + props.activeRegion.name + " Flag.png";
        }
    }

    useEffect(() => {
        document.onkeydown = (e) => {
			if (e.key === 'Control') {
			  setCtrl(true);
			} 
			if (e.key === 'y') {
			  if (ctrl && props.canRedo) props.tpsRedo();
			  setY(true);
			} 
			if (e.key === 'z') {
			  if (ctrl && props.canUndo) props.tpsUndo();
			  setZ(true);
			} 
		  }
		  document.onkeyup = (e) => {
			if (e.key === 'Control') {
			  setCtrl(false);
			} 
			if (e.key === 'y') {
			  setY(false);
			} 
			if (e.key === 'z') {
			  setZ(false);
			} 
		  }
		return () => {}
    });

    const [ctrl, setCtrl]              = useState(false);
	const [y, setY]                    = useState(false);
	const [z, setZ]                    = useState(false);
    

    const [landmarkName, setLandmarkName] = useState('');
    const [events, setEvents] = useState([]);
    const [showChangeParent, setShowChangeParent]         = useState(false);

    const handleShowChangeParent = () => {
        setShowChangeParent(!showChangeParent);
    }

    const changeParent = async (entry) => {
        //_id, field, value, prev
        await props.changeParent(props.activeRegion._id, 'parentRegion', entry._id, props.activeRegion.parentRegion._id);
        await props.refetchRegions();
    }

    useEffect(() => {
        props.findLandmarkById({ variables: { name: landmarkName }});
    }, [landmarkName]);

    const handleAddLandmark = async () => {
        events.forEach(e => e.target.value='');
        setEvents([]);
        if (props.landmarkExists) {
            alert('This landmark already exists!');
            return;
        } else {
            await props.addLandmark(props.activeRegion._id, landmarkName, props.activeRegion.name);
            await props.refetchRegions();
        }
    };

    const updateNameInput = (e) => {
		const { value } = e.target;
		setLandmarkName(value);
        setEvents(events => [...events, e]);
	};

    
    let leftSibling;
    let rightSibling;
    
    if (props.siblings){
        let siblings = props.siblings;
        let currSiblingIndex = props.siblings.indexOf(_id);
        let leftDisabled = props.activeRegion.parentRegion === null || currSiblingIndex === 0;
        let rightDisabled = props.activeRegion.parentRegion === null || currSiblingIndex === siblings.length-1;
        if (currSiblingIndex === 0){
            leftSibling = 
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'enter' }}>
                <WButton className='table-entry-buttons' wType="texted" shape="rounded" disabled={leftDisabled} >
                    <i className="material-icons">west</i>
                </WButton>
            </div>;
            rightSibling = 
            <>
                <Link style={{ display: 'flex', justifyContent: 'center', alignItems: 'enter' }} to={{ pathname: `/regionviewer/${siblings[currSiblingIndex+1]}` }} onClick={props.clearTPS} >
                    <WButton className='table-entry-buttons' wType="texted" shape="rounded" disabled={rightDisabled}>
                        <i className="material-icons">east</i>
                    </WButton>
                </Link>
            </>;
        } else if (currSiblingIndex === siblings.length-1){
            leftSibling = 
            <>
                <Link style={{ display: 'flex', justifyContent: 'center', alignItems: 'enter' }} to={{ pathname: `/regionviewer/${siblings[currSiblingIndex-1]}` }} onClick={props.clearTPS} >
                    <WButton className='table-entry-buttons' wType="texted" shape="rounded" disabled={leftDisabled} >
                        <i className="material-icons">west</i>
                    </WButton>
                </Link>
            </>;
            rightSibling = 
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'enter' }}>
                <WButton className='table-entry-buttons' wType="texted" shape="rounded" disabled={rightDisabled}>
                    <i className="material-icons">east</i>
                </WButton>
            </div>;
        } else {
            leftSibling = 
            <>
                <Link style={{ display: 'flex', justifyContent: 'center', alignItems: 'enter' }} to={{ pathname: `/regionviewer/${siblings[currSiblingIndex-1]}` }} onClick={props.clearTPS} >
                    <WButton className='table-entry-buttons' wType="texted" shape="rounded" disabled={leftDisabled} >
                        <i className="material-icons">west</i>
                    </WButton>
                </Link>
            </>;
            rightSibling = 
            <>
                <Link style={{ display: 'flex', justifyContent: 'center', alignItems: 'enter' }} to={{ pathname: `/regionviewer/${siblings[currSiblingIndex+1]}` }} onClick={props.clearTPS} >
                    <WButton className='table-entry-buttons' wType="texted" shape="rounded" disabled={rightDisabled}>
                        <i className="material-icons">east</i>
                    </WButton>
                </Link>
            </>;
        }
    }

    return (
        <>
            { props.activeRegion &&
                <WLayout wLayout='header'>
                    <WLHeader>
                        <NavbarOptions 
                            user={props.user} fetchUser={props.fetchUser} auth={props.auth} activeRegion={props.activeRegion}
                            lineage={props.lineage} clearTPS={props.clearTPS}
                        />
                    </WLHeader>
                    <WLMain>
                        <div style={{ height: '90%', width: '100%'}}>
                            <WRow style={{ width: '90%', marginTop: '2%', marginLeft: '5%'}}>
                                <WCol size='1' style={{ display: 'flex' }}>
                                    <WButton className='table-entry-buttons' onClick={props.canUndo ? props.undo : () => {} } wType="texted" shape="rounded" disabled={!props.canUndo}>
                                        <i className="material-icons">undo</i>
                                    </WButton>

                                    <WButton className='table-entry-buttons' onClick={props.canRedo ? props.redo : () => {} } wType="texted" shape="rounded" disabled={!props.canRedo}>
                                        <i className="material-icons">redo</i>
                                    </WButton>
                                </WCol>
                                <WCol size='2'>

                                </WCol>
                                <WCol size='2'>

                                </WCol>
                                <WCol size='2' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontSize: '20px'}}>
                                    {leftSibling}{rightSibling}
                                </WCol>
                                <WCol size='2'>

                                </WCol>
                                <WCol size='3'>

                                </WCol>
                            </WRow>
                            <div style={{ width: "90%", height: "82%", marginTop: '5px', marginLeft: '5%', marginBottom: '1%', display: 'flex', flexDirection: 'row' }}>
                                <div style={{ width: '50%', height: '100%'}}>
                                    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
                                        <div style={{ width: '50%', height: '200px'}}>
                                            <img  src={imageAddr} alt='No Flag :('></img>
                                        </div>
                                        <div style={{ width: '100%', height: '50%', marginTop: '10px'}}>
                                            <div className='region-attribute'>
                                                Region Name: 
                                                <Link to={{ pathname: `/regions/${props.activeRegion._id}` }} onClick={props.clearTPS} >
                                                    <WButton style={{ backgroundColor: '#40454e', color: 'deepskyblue', fontSize: '24px'}}>
                                                        {props.activeRegion.name}
                                                    </WButton>
                                                </Link>
                                            </div>
                                            <div className='region-attribute'>
                                                Parent Region: 
                                                <WButton onClick={handleShowChangeParent} style={{ backgroundColor: '#40454e', color: 'lightgreen', fontSize: '24px'}}>
                                                    {props.activeRegion.parentRegion !== null ? props.activeRegion.parentRegion.name : 'No Parent Region'}
                                                </WButton>
                                            </div>
                                            <div className='region-attribute'>
                                                Region Capital: {props.activeRegion.capital !== '' ? props.activeRegion.capital : 'No Capital'}
                                            </div>
                                            <div className='region-attribute'>
                                                Region Leader: {props.activeRegion.leader !== '' ? props.activeRegion.leader : 'No Leader'}
                                            </div>
                                            <div className='region-attribute'>
                                                # Of Subregions: {props.activeRegion.subregions.length}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <WCard wLayout="header-content" style={{ width: '50%', height: '500px', backgroundColor: 'black' }}>
                                    <WCHeader style={{ backgroundColor: '#40454e', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'flex-end', fontSize: '30px' }}>
                                        Region Landmarks:
                                    </WCHeader>
                                    <WCContent>
                                        <WCard className='map-entries' raised style={{ width: '100%', height: '89%', backgroundColor: 'black' }}>
                                            <>
                                                {props.activeRegion.landmarks.map( (entry, index) => (
                                                    <LandmarkEntry key={entry._id} entry={entry} index={index} deleteLandmark={props.deleteLandmark}
                                                    editLandmark={props.editLandmark} canEdit={true}
                                                    />
                                                ))}
                                                {props.landmarks.map( (entry, index) => (
                                                    <LandmarkEntry key={entry._id} entry={entry} index={index} deleteLandmark={props.deleteLandmark}
                                                    editLandmark={() => {}} canEdit={false}
                                                    />
                                                ))}
                                            </>
                                        </WCard>
                                        <WCard raised style={{ backgroundColor: 'white', width: '100%', height: '11%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'}}>
                                            <WRow style={{ height: '50px'}}>
                                                <WCol size='3'>
                                                    <WButton 
                                                        style={{ display: 'flex', justifyContent: 'center', color: 'lightgreen', backgroundColor: 'grey', width: '100%', height: '100%' }} 
                                                        hoverAnimation='darken' clickAnimation='ripple-light' onClick={handleAddLandmark} raised>
                                                        Add Landmark
                                                    </WButton>
                                                </WCol>
                                                <WCol size='9'>
                                                    <WInput className='modal-input' style={{ color: 'black' }} onBlur={updateNameInput} name='landmarkname' labelAnimation="up" 
                                                    barAnimation="solid" labelText="Enter Landmark Name Here" hoverAnimation='solid' wType="outlined" inputType='text' />
                                                </WCol>
                                            </WRow>
                                        </WCard>
                                    </WCContent>
                                </WCard>
                            </div>
                        </div>
                    </WLMain>
                </WLayout>
            }
            {showChangeParent && 
                <ChangeParent changeParentFunction={changeParent} name={props.activeRegion.name} cancelFunction={handleShowChangeParent} 
                    changeableSubregions={props.changeableSubregions}
                />
            }
        </>
    );
};

export default RegionViewer;