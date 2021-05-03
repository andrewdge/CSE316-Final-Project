import { useLazyQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { WCard, WCContent, WCHeader, WRow, WCol, WButton, WLayout, WLHeader, WLMain } from 'wt-frontend';
import NavbarOptions from '../navbar/NavbarOptions';
import RegionEntry from './RegionEntry';
import { GET_REGION_BY_ID } 				from '../../cache/queries';

const RegionSpreadsheet = (props) => {


    let { _id } = useParams();
    let location = useLocation();

    let activeRegion;
    let subregions;
    
    const [getRegionById, {loading: regionLoading, error: regionError, data: regionData, refetch: regionRefetch}] = useLazyQuery(GET_REGION_BY_ID);

    if (regionError) { 
        console.log(regionError); 
    }
    if (regionData) {
        activeRegion = regionData.getRegionById;
        subregions = activeRegion.subregions;
    }

    useEffect(() => {
        getRegionById({ variables: { _id: _id}});
    }, [subregions, _id]);
    
    const addNewRegion = async () => {
        await props.addNewRegion(_id);
        await regionRefetch();
    }

    const navigateToRegionViewer = () => {
        
    }

    return (
        <>
            { activeRegion && 
                <WLayout wLayout='header'>
                    <WLHeader>
                        <NavbarOptions 
                            user={props.user} fetchUser={props.fetchUser} auth={props.auth} activeRegion={activeRegion}
                        />
                    </WLHeader>
                    <WLMain>
                        <div style={{ height: '100%', width: '100%'}}>
                            <WRow style={{ width: '90%', marginTop: '2%', marginLeft: '5%'}}>
                                <WCol size='1'>
                                    <WButton shape='rounded' hoverAnimation='lighten' clickAnimation='ripple-light' onClick={addNewRegion}>
                                        <i className='material-icons'>add_box</i>
                                    </WButton>
                                </WCol>
                                <WCol size='2'>

                                </WCol>
                                <WCol size='6' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontSize: '20px'}}>
                                    Region name: 
                                    <WButton style={{ backgroundColor: '#40454e', color: 'deepskyblue'}} hoverAnimation='lighten' clickAnimation='ripple-light' onClick={navigateToRegionViewer}>
                                        {activeRegion.name}
                                    </WButton>
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
                                <WCContent>
                                    {
                                        subregions.map((entry, index) => (
                                            <RegionEntry 
                                                key={entry._id} entry={entry} index={index} deleteSubregion={props.deleteSubregion} regionRefetch={regionRefetch}
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