import React, { useState, useEffect } 	from 'react';
import Logo from '../navbar/Logo';
import Login from '../modals/Login';
import Delete from '../modals/Delete';
import Update from '../modals/Update';
import CreateAccount from '../modals/CreateAccount';
import MapContents from '../maps/MapContents';
import { WNavbar, WNavItem } 	from 'wt-frontend';
import { WLayout, WLHeader, WLMain, WLSide } from 'wt-frontend';
import NavbarOptions from '../navbar/NavbarOptions';
import { GET_DB_MAPS } 				from '../../cache/queries';
import * as mutations 					from '../../cache/mutations';
import { useMutation, useQuery } 		from '@apollo/client';
import Welcome from '../welcome/Welcome';
import {  BrowserRouter, Switch, Route, Redirect, useRouteMatch } from 'react-router-dom';

const Homescreen = (props) => {

    let maps = [];
    const [activeMap, setActiveMap]         = useState({});
    const [AddRegion]                       = useMutation(mutations.ADD_REGION);

    const { loading, error, data, refetch } = useQuery(GET_DB_MAPS);
	if(loading) { console.log(loading, 'loading'); }
	if(error) { console.log(error, 'error'); }
	if(data) { 
		maps = data.getAllMaps;
	}

    const refetchMaps = async (refetch) => {
		const { loading, error, data } = await refetch();
		if (data) {
			maps = data.getAllMaps;
		}
	}

	const auth = props.user === null ? false : true;


	// const refetchTodos = async (refetch) => {
	// 	const { loading, error, data } = await refetch();
	// 	if (data) {
	// 		maps = data.getAllMaps;
	// 		if (activeList._id) {
	// 			let tempID = activeList._id;
	// 			let list = todolists.find(list => list._id === tempID);
	// 			setActiveList(list);
	// 		}
	// 	}
	// }

    const createNewMap = async () => {
        const newMap = {
            _id: '',
            name: 'Untitled Map',
            capital: '',
            leader: '',
            flag: '',
            parentRegion: null,
            subregions: [],
            landmarks: [],
            owner: props.user._id
        }
        const { data } = await AddRegion({ variables: { map: newMap }} );
        await refetchMaps(refetch);
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
                { !auth && 
                    <>
                        <Redirect exact from="/" to={ {pathname: "/welcome"} } />

                        <Route path="/welcome" name="welcome">
                            <Welcome />
                        </Route>
                        <Route path='/login' name='login'>
                            <Login fetchUser={props.fetchUser} />
                        </Route>
                        <Route path='/createaccount' name='createaccount'>
                            <CreateAccount fetchUser={props.fetchUser} />
                        </Route>
                    </>
                }
                { auth && 
                    <>
                        <Redirect exact from="/" to={ {pathname: "/home"} } />
                        
                        <Route path="/home" name="home">
                            <MapContents 
                                user={props.user} fetchUser={props.fetchUser} maps={maps}
                                createNewMap={createNewMap}
                            />
                        </Route>
                        <Route path='/updateaccount' name='updateaccount'>
                            <Update fetchUser={props.fetchUser} user={props.user} />
                        </Route>
                    </>
                }
                
                {/* <Redirect exact from="/" to={ {pathname: "/home"} } /> */}
				
                
                {/* <Route path={`${match.path}/hi`} name="hi">
                    <Welcome />
                </Route> */}
                
                
            </WLMain>
        </WLayout>
	);
};

export default Homescreen;