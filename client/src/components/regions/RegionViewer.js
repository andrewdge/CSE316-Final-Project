import React, { useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';
import { WCard, WRow, WCol, WLayout, WLMain, WLHeader, WButton, WCHeader, WCContent } from 'wt-frontend';
import NavbarOptions from '../navbar/NavbarOptions';
import { useParams, useHistory, Link } from 'react-router-dom';
import { GET_REGION_BY_ID } 				from '../../cache/queries';

const RegionViewer = (props) => {

    let { _id } = useParams();
    let history = useHistory();

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
        console.log('hi');
        getRegionById({ variables: { _id: _id}});
    }, [subregions, _id]);

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
                                            hi
                                        </div>
                                        <div style={{ width: '100%', height: '50%'}}>
                                            <div className='region-attribute'>
                                                Region Name: 
                                                <Link to={{ pathname: `/regions/${activeRegion._id}` }} >
                                                    <WButton style={{ backgroundColor: '#40454e', color: 'deepskyblue', fontSize: '24px'}}>
                                                        {activeRegion.name}
                                                    </WButton>
                                                </Link>
                                            </div>
                                            <div className='region-attribute'>
                                                Parent Region: {activeRegion.parentRegion}
                                            </div>
                                            <div className='region-attribute'>
                                                Region Capital: {activeRegion.capital}
                                            </div>
                                            <div className='region-attribute'>
                                                Region Leader: {activeRegion.leader}
                                            </div>
                                            <div className='region-attribute'>
                                                # Of Subregions: {activeRegion.subregions.length}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <WCard wLayout="header-content" style={{ width: '50%', height: '100%', backgroundColor: 'black' }}>
                                    <WCHeader style={{ backgroundColor: '#40454e', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'flex-end', fontSize: '30px' }}>
                                        Region Landmarks:
                                    </WCHeader>
                                    <WCContent>

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