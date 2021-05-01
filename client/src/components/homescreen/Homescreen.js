import React, { useState, useEffect } 	from 'react';
import Logo from '../navbar/Logo';
import Login from '../modals/Login';
import Delete from '../modals/Delete';
import Update from '../modals/Update';
import CreateAccount from '../modals/CreateAccount';
import MapContents from '../maps/MapContents';
import RegionSpreadsheet from '../regions/RegionSpreadsheet';
import { WNavbar, WNavItem } 	from 'wt-frontend';
import { WLayout, WLHeader, WLMain, WLSide } from 'wt-frontend';
import NavbarOptions from '../navbar/NavbarOptions';
import { GET_DB_MAPS } 				from '../../cache/queries';
import * as mutations 					from '../../cache/mutations';
import { useMutation, useQuery } 		from '@apollo/client';
import Welcome from '../welcome/Welcome';
import {  BrowserRouter, Switch, Route, Redirect, useRouteMatch, Link } from 'react-router-dom';


const Homescreen = (props) => {

    let maps = [];
    const [AddRegion]                       = useMutation(mutations.ADD_REGION);
    const [UpdateRegion]                    = useMutation(mutations.UPDATE_REGION);
    const [DeleteRegion]                    = useMutation(mutations.DELETE_REGION);
    const [MoveMapToTop]                    = useMutation(mutations.MOVE_MAP_TO_TOP);

    const { loading, error, data, refetch } = useQuery(GET_DB_MAPS);
	if(loading) { console.log(loading, 'loading'); }
	if(error) { console.log(error, 'error'); }
	if(data) { 
		maps = data.getAllMaps;
	}

    // const refetchMaps = async (refetch) => {
	// 	const { loading, error, data } = await refetch();
	// 	if (data) {
	// 		maps = data.getAllMaps;
	// 	}
	// }

	const auth = props.user === null ? false : true;

    const createNewMap = async (name) => {
        const length = maps.length;
		const id = length >= 1 ? maps[length - 1].sortId + 1 : 0;
        let n = name === '' ? 'Untitled Map' : name;
        const newMap = {
            _id: '',
            name: n,
            capital: '',
            leader: '',
            flag: '',
            parentRegion: null,
            subregions: [],
            landmarks: [],
            sortId: id,
            owner: props.user._id
        }
        const { data } = await AddRegion({ variables: { region: newMap }, refetchQueries: [{ query: GET_DB_MAPS}] });
    }

    const updateMapName = async (_id, name) => {
        const { data } = await UpdateRegion( { variables: { _id: _id, field: 'name', value: name }, refetchQueries: [{ query: GET_DB_MAPS }]});
    }

    const deleteMap = (_id) => {
        DeleteRegion({ variables: { _id: _id}, refetchQueries: [{ query: GET_DB_MAPS}] });
    }

    const bubbleMapToTop = async (entry) => {
        const { data } = await MoveMapToTop({ variables: { _id: entry._id }, refetchQueries: [{ query: GET_DB_MAPS}] });
    }

    let match = useRouteMatch();

	return (
		<WLayout wLayout='header'>
            <WLHeader>
                <NavbarOptions 
                    user={props.user} fetchUser={props.fetchUser} auth={auth} 
                />
            </WLHeader>
            <WLMain>
                { 
                    auth ?
                        <Switch>
                            <Redirect exact from="/" to={ {pathname: "/home"} } />
                            <Redirect exact from='/maps' to={ {pathname: '/home' }} />
                            <Route path="/home" name="home">
                                <MapContents 
                                    user={props.user} fetchUser={props.fetchUser} maps={maps} refetch={refetch}
                                    createNewMap={createNewMap} deleteMap={deleteMap} updateMapName={updateMapName} 
                                    bubbleMapToTop={bubbleMapToTop}
                                />
                            </Route>
                            <Route path='/updateaccount' name='updateaccount'>
                                <Update fetchUser={props.fetchUser} user={props.user} />
                            </Route>
                            <Route path='/maps/:_id' name='maps'>
                                <RegionSpreadsheet maps={maps} />
                            </Route>
                        </Switch>
                    :
                        <Switch>
                            <Redirect exact from="/" to={ {pathname: "/welcome"} } />
                            <Route path="/welcome" name="welcome">
                                <Welcome />
                            </Route>
                            <Route path='/login' name='login'>
                                <Login fetchUser={props.fetchUser} refetch={refetch} />
                            </Route>
                            <Route path='/createaccount' name='createaccount'>
                                <CreateAccount fetchUser={props.fetchUser} />
                            </Route>
                        </Switch>
                }
            </WLMain>
        </WLayout>
	);
};

export default Homescreen;