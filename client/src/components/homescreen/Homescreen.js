import React	from 'react';
import Login from '../modals/Login';
import Update from '../modals/Update';
import CreateAccount from '../modals/CreateAccount';
import MapContents from '../maps/MapContents';
import RegionSpreadsheet from '../regions/RegionSpreadsheet';
import RegionViewer from '../regions/RegionViewer';
import { GET_DB_MAPS, GET_DB_REGIONS } 				from '../../cache/queries';
import * as mutations 					from '../../cache/mutations';
import { useMutation, useQuery } 		from '@apollo/client';
import Welcome from '../welcome/Welcome';
import { Switch, Route, Redirect, useRouteMatch } from 'react-router-dom';


const Homescreen = (props) => {

    let maps = [];
    let regions = [];
    const [AddRegion]                       = useMutation(mutations.ADD_REGION);
    const [UpdateRegion]                    = useMutation(mutations.UPDATE_REGION);
    const [DeleteRegion]                    = useMutation(mutations.DELETE_REGION);
    const [MoveMapToTop]                    = useMutation(mutations.MOVE_MAP_TO_TOP);

    const GetDBRegions = useQuery(GET_DB_REGIONS);
    if(GetDBRegions.error) { console.log(GetDBRegions.error); }
	if(GetDBRegions.data) { 
		regions = GetDBRegions.data.getAllRegions;
	}

    const GetDBMaps = useQuery(GET_DB_MAPS);
	// if(loading) { console.log('loading'); }
	if(GetDBMaps.error) { console.log(GetDBMaps.error); }
	if(GetDBMaps.data) { 
		maps = GetDBMaps.data.getAllMaps;
	}

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

    const addNewRegion = async (parentId) => {
        const length = regions.length;
		const id = length >= 1 ? regions[length - 1].sortId + 1 : 0;
        const newRegion = {
            _id: '',
            name: 'Untitled Region',
            capital: 'Unnamed Capital',
            leader: 'Unknown Leader',
            flag: '',
            parentRegion: parentId,
            subregions: [],
            landmarks: [],
            sortId: id,
            owner: props.user._id
        }
        const { data } = await AddRegion({ variables: { region: newRegion }, refetchQueries: [{ query: GET_DB_REGIONS}] });
    }

    const deleteSubregion= async (_id) => {
        await DeleteRegion({ variables: { _id: _id}, refetchQueries: [{ query: GET_DB_REGIONS}] });
    }

    let match = useRouteMatch();

	return (
        <>
            { 
                auth ?
                <Switch>
                    <Route exact path="/home" name="home">
                        <MapContents 
                            user={props.user} fetchUser={props.fetchUser} maps={maps} refetch={GetDBMaps.refetch}
                            createNewMap={createNewMap} deleteMap={deleteMap} updateMapName={updateMapName} 
                            bubbleMapToTop={bubbleMapToTop} auth={auth}
                        />
                    </Route>
                    <Route exact path='/updateaccount' name='updateaccount'>
                        <Update fetchUser={props.fetchUser} user={props.user} auth={auth} />
                    </Route>
                    <Route exact path='/maps/:_id' name='maps'>
                        <RegionSpreadsheet 
                            fetchUser={props.fetchUser} user={props.user} auth={auth} addNewRegion={addNewRegion} 
                            deleteSubregion={deleteSubregion}
                        />
                    </Route>
                    <Route exact path='/regions/:_id' name='regions'>
                        <RegionSpreadsheet
                            fetchUser={props.fetchUser} user={props.user} auth={auth} addNewRegion={addNewRegion}
                            deleteSubregion={deleteSubregion} 
                        />
                    </Route>
                    <Route exact path='/regionviewer/:_id' name='regionviewer'>
                        <RegionViewer
                            fetchUser={props.fetchUser} user={props.user} auth={auth}
                        />
                    </Route>
                    <Redirect from="/" to={ {pathname: "/home"} } />
                </Switch>
                :
                <Switch>
                    <Route exact path="/welcome" name="welcome">
                        <Welcome user={props.user} fetchUser={props.fetchUser} auth={auth} />
                    </Route>
                    <Route exact path='/login' name='login'>
                        <Login fetchUser={props.fetchUser} refetch={GetDBMaps.refetch} user={props.user} auth={auth}/>
                    </Route>
                    <Route exact path='/createaccount' name='createaccount'>
                        <CreateAccount fetchUser={props.fetchUser} user={props.user} auth={auth} />
                    </Route>
                    <Redirect exact from="/home" to={ {pathname: "/welcome"} } />
                    <Redirect exact from="/" to={ {pathname: "/welcome"} } />
                </Switch>
            }
        </>
        
	);
};

export default Homescreen;