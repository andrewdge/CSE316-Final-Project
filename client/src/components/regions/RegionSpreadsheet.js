import { useLazyQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { useHistory, useLocation, useParams, Link } from 'react-router-dom';
import { WCard, WCContent, WCHeader, WRow, WCol, WButton, WLayout, WLHeader, WLMain } from 'wt-frontend';
import NavbarOptions from '../navbar/NavbarOptions';
import RegionEntry from './RegionEntry';
import { GET_REGION_BY_ID } 				from '../../cache/queries';

const RegionSpreadsheet = (props) => {


    let { _id } = useParams();
    let history = useHistory();
    
    useEffect(() => {
        props.getRegionById({ variables: { _id: _id}});
    }, [props.subregions, _id]);
    
    const addNewRegion = async () => {
        await props.addNewRegion(_id);
        await props.regionRefetch();
    }

    return (
        <>
            { props.activeRegion && 
                <WLayout wLayout='header'>
                    <WLHeader>
                        <NavbarOptions 
                            user={props.user} fetchUser={props.fetchUser} auth={props.auth} activeRegion={props.activeRegion} clearTPS={props.clearTPS}
                        />
                    </WLHeader>
                    <WLMain>
                        <div style={{ height: '100%', width: '100%'}}>
                            <WRow style={{ width: '90%', marginTop: '2%', marginLeft: '5%'}}>
                                <WCol size='2'>
                                    <WRow>
                                        <WCol size='4'>
                                            <WButton shape='rounded' hoverAnimation='lighten' clickAnimation='ripple-light' onClick={addNewRegion}>
                                                <i className='material-icons'>add_box</i>
                                            </WButton>
                                        </WCol>
                                        <WCol size='8'>
                                            <WButton className='table-entry-buttons' /*onClick={props.undo}*/ onClick={props.canUndo ? props.undo : () => {} } wType="texted" shape="rounded" disabled={!props.canUndo}>
                                                <i className="material-icons">undo</i>
                                            </WButton>

                                            <WButton className='table-entry-buttons' /*onClick={props.redo}*/ onClick={props.canRedo ? props.redo : () => {} } wType="texted" shape="rounded" disabled={!props.canRedo}>
                                                <i className="material-icons">redo</i>
                                            </WButton>
                                        </WCol>
                                    </WRow>
                                </WCol>
                                <WCol size='1'>

                                </WCol>
                                <WCol size='6' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontSize: '20px'}}>
                                    Region name: 
                                    <Link to={{ pathname: `/regionviewer/${props.activeRegion._id}` }} >
                                        <WButton wType='texted' color='success' hoverAnimation='darken' clickAnimation='ripple-light' >
                                            {props.activeRegion.name}
                                        </WButton>
                                    </Link>
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
                                            Name
                                        </WCol>
                                        <WCol size='2' className='header-title'>
                                            Capital
                                        </WCol><WCol size='2' className='header-title'>
                                            Leader
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
                                                regionRefetch={props.regionRefetch} editRegion={props.editRegion} clearTPS={props.clearTPS}
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