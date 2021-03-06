import { useLazyQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { useHistory, useLocation, useParams, Link } from 'react-router-dom';
import { WCard, WCContent, WCHeader, WRow, WCol, WButton, WLayout, WLHeader, WLMain } from 'wt-frontend';
import NavbarOptions from '../navbar/NavbarOptions';
import RegionEntry from './RegionEntry';
import { GET_REGION_BY_ID } 				from '../../cache/queries';

const RegionSpreadsheet = (props) => {


    let { _id } = useParams();
    let location = useLocation();
    let isMap = location.pathname.includes('maps');

    const getData = async () => {
        await props.getRegionById({ variables: { _id: _id }});
        await props.getLineage({ variables: {_id: _id }});
    }
    
    useEffect(() => {
        getData();
    }, [props.activeRegion, location.pathname]);


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
    const [row, setRow]                = useState(-1);
    const [col, setCol]                = useState(-1);

    const [isNameAscending, nameToggleAscending] = useState(false);
    const [isCapitalAscending, capitalToggleAscending] = useState(false);
    const [isLeaderAscending, leaderToggleAscending] = useState(false);
    let imageAddr;
    if (props.lineage) {
        imageAddr = props.lineage.map(reg => reg.name).join('/');
    }

    let hasSubregions;
    if (props.activeRegion) {
        hasSubregions = props.activeRegion.subregions.length > 0;
    }
    
    
    
    const addNewRegion = async () => {
        await props.addNewRegion(props.activeRegion._id);
        await props.refetchRegions();
    }

    const nameReorder = async () => {
        props.sortRegions(props.activeRegion._id, isNameAscending, "name", props.activeRegion.subregions);
        nameToggleAscending(!isNameAscending);
        await props.refetchRegions();
    }

    const capitalReorder = async () => {
        props.sortRegions(props.activeRegion._id, isCapitalAscending, "capital", props.activeRegion.subregions);
        capitalToggleAscending(!isCapitalAscending);
        await props.refetchRegions();
    }

    const leaderReorder = async () => {
        props.sortRegions(props.activeRegion._id, isLeaderAscending, "leader", props.activeRegion.subregions);
        leaderToggleAscending(!isLeaderAscending);
        await props.refetchRegions();
    }

    // if (props.activeRegion) console.log(props.activeRegion);

    return (
        <>
            { props.activeRegion && 
                <WLayout wLayout='header'>
                    <WLHeader>
                        <NavbarOptions 
                            user={props.user} fetchUser={props.fetchUser} auth={props.auth} activeRegion={props.activeRegion} clearTPS={props.clearTPS}
                            lineage={props.lineage}
                        />
                    </WLHeader>
                    <WLMain>
                        <div style={{ height: '90%', width: '100%'}}>
                            <WRow style={{ width: '90%', marginTop: '2%', marginLeft: '5%'}}>
                                <WCol size='2'>
                                    <WRow>
                                        <WCol size='4'>
                                            <WButton shape='rounded' hoverAnimation='lighten' clickAnimation='ripple-light' onClick={addNewRegion}>
                                                <i className='material-icons'>add_box</i>
                                            </WButton>
                                        </WCol>
                                        <WCol size='8'>
                                            <WButton className='table-entry-buttons' onClick={props.canUndo ? props.undo : () => {} } wType="texted" shape="rounded" disabled={!props.canUndo}>
                                                <i className="material-icons">undo</i>
                                            </WButton>

                                            <WButton className='table-entry-buttons' onClick={props.canRedo ? props.redo : () => {} } wType="texted" shape="rounded" disabled={!props.canRedo}>
                                                <i className="material-icons">redo</i>
                                            </WButton>
                                        </WCol>
                                    </WRow>
                                </WCol>
                                <WCol size='1'>

                                </WCol>
                                <WCol size='6' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontSize: '20px'}}>
                                    Region name: 
                                    {
                                        isMap ? 
                                            <WButton wType='texted' color='success' >
                                                {props.activeRegion.name}
                                            </WButton>
                                        :
                                        <Link to={{ pathname: `/regionviewer/${props.activeRegion._id}` }} onClick={props.clearTPS}>
                                            <WButton wType='texted' color='success' hoverAnimation='darken' clickAnimation='ripple-light' >
                                                {props.activeRegion.name}
                                            </WButton>
                                        </Link>
                                    }
                                    
                                </WCol>
                                <WCol size='3'>

                                </WCol>
                            </WRow>
                            <WCard wLayout="header-content" style={{ width: "90%", height: "82%", marginTop: '5px', marginLeft: '5%', marginBottom: '1%' }} raised>
                                <WCHeader style={{ backgroundColor: 'salmon'}}>
                                    <WRow style={{ width: '100%', height: '100%'}}>
                                        <WCol size='1'>

                                        </WCol>
                                        <WCol size='2' className='header-title'>
                                            {
                                                hasSubregions ?
                                                <WButton wType='texted' className='header-title' onClick={nameReorder} hoverAnimation='darken' clickAnimation='ripple-light' >
                                                    Name
                                                </WButton>
                                                :
                                                <div className='header-title'>
                                                    Name
                                                </div>
                                            }
                                            
                                        </WCol>
                                        <WCol size='2' className='header-title'>
                                            {
                                                hasSubregions ?
                                                <WButton wType='texted' className='header-title' onClick={capitalReorder} hoverAnimation='darken' clickAnimation='ripple-light' >
                                                    Capital
                                                </WButton>
                                                :
                                                <div className='header-title'>
                                                    Capital
                                                </div>
                                            }
                                            
                                        </WCol><WCol size='2' className='header-title'>
                                            {
                                                hasSubregions ?
                                                <WButton wType='texted' className='header-title' onClick={leaderReorder} hoverAnimation='darken' clickAnimation='ripple-light' >
                                                    Leader
                                                </WButton>
                                                :
                                                <div className='header-title'>
                                                    Leader
                                                </div>
                                            }
                                        </WCol><WCol size='2' className='header-title'>
                                            Flag
                                        </WCol><WCol size='3' className='header-title'>
                                            Landmarks
                                        </WCol>
                                    </WRow>
                                </WCHeader>
                                <WCContent className='region-entries'>
                                    {
                                        props.subregions.map((entry, index) => (
                                            <RegionEntry 
                                                key={entry._id} entry={entry} index={index} deleteSubregion={props.deleteSubregion} 
                                                refetchRegions={props.refetchRegions} editRegion={props.editRegion} clearTPS={props.clearTPS}
                                                getData={getData} row={row} col={col} setRow={setRow} setCol={setCol}
                                                len={props.subregions.length} imageAddr={imageAddr}
                                            />
                                        ))
                                    }
                                </WCContent>
                            </WCard>
                        </div>
                    </WLMain>
                </WLayout>
            }
        </>
    );
};
export default RegionSpreadsheet;