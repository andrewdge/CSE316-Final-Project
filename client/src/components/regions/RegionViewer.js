import React, { useEffect, useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { WCard, WRow, WCol, WLayout, WLMain, WLHeader, WButton, WCHeader, WCContent, WInput } from 'wt-frontend';
import NavbarOptions from '../navbar/NavbarOptions';
import { useParams, useHistory, Link, useLocation } from 'react-router-dom';
import { GET_REGION_BY_ID } 				from '../../cache/queries';
import LandmarkEntry from '../landmarks/LandmarkEntry';

const RegionViewer = (props) => {

    let { _id } = useParams();
    let history = useHistory();
    let location = useLocation();

    useEffect(() => {
        props.getRegionById({ variables: { _id: _id}});
        props.getLineage({ variables: {_id: _id }});
    }, [props.subregions, _id, location.pathname]);

    const [landmarkName, setLandmarkName] = useState('');
    const [events, setEvents] = useState([]);

    const handleAddLandmark = async () => {
        events.forEach(e => e.target.value='');
        setEvents([]);
        await props.addLandmark(props.activeRegion._id, landmarkName, props.activeRegion.name);
        console.log('refetched');
        await props.regionRefetch();
    };

    const updateNameInput = (e) => {
		const { value } = e.target;
		setLandmarkName(value);
        setEvents(events => [...events, e]);
	};

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
                                <WCol size='1'>
                                    <WButton className='table-entry-buttons' onClick={props.canUndo ? props.undo : () => {} } wType="texted" shape="rounded" disabled={!props.canUndo}>
                                        <i className="material-icons">undo</i>
                                    </WButton>

                                    <WButton className='table-entry-buttons' onClick={props.canRedo ? props.redo : () => {} } wType="texted" shape="rounded" disabled={!props.canRedo}>
                                        <i className="material-icons">redo</i>
                                    </WButton>
                                </WCol>
                                <WCol size='2'>

                                </WCol>
                                <WCol size='6' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontSize: '20px'}}>

                                </WCol>
                                <WCol size='3'>

                                </WCol>
                            </WRow>
                            <div style={{ width: "90%", height: "82%", marginTop: '5px', marginLeft: '5%', marginBottom: '1%', display: 'flex', flexDirection: 'row' }}>
                                <div style={{ width: '50%', height: '100%'}}>
                                    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
                                        <div style={{ width: '50%', height: '50%'}}>
                                            image here
                                        </div>
                                        <div style={{ width: '100%', height: '50%'}}>
                                            <div className='region-attribute'>
                                                Region Name: 
                                                <Link to={{ pathname: `/regions/${props.activeRegion._id}` }} onClick={props.clearTPS} >
                                                    <WButton style={{ backgroundColor: '#40454e', color: 'deepskyblue', fontSize: '24px'}}>
                                                        {props.activeRegion.name}
                                                    </WButton>
                                                </Link>
                                            </div>
                                            <div className='region-attribute'>
                                                Parent Region: {props.activeRegion.parentRegion !== null ? props.activeRegion.parentRegion.name : 'No Parent Region'}
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
                                            {props.activeRegion.landmarks.map( (entry, index) => (
                                                <LandmarkEntry key={entry._id} entry={entry} index={index} deleteLandmark={props.deleteLandmark}
                                                editLandmark={props.editLandmark}
                                                />
                                            ))}
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
        </>
    );
};

export default RegionViewer;