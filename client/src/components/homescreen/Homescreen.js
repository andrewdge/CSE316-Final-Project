import React, { useState }	from 'react';
import Login from '../modals/Login';
import Update from '../modals/Update';
import CreateAccount from '../modals/CreateAccount';
import MapContents from '../maps/MapContents';
import RegionSpreadsheet from '../regions/RegionSpreadsheet';
import RegionViewer from '../regions/RegionViewer';
import { GET_DB_MAPS, GET_DB_REGIONS, GET_REGION_BY_ID } 				from '../../cache/queries';
import * as mutations 					from '../../cache/mutations';
import { useMutation, useQuery, useLazyQuery } 		from '@apollo/client';
import Welcome from '../welcome/Welcome';
import { Switch, Route, Redirect } from 'react-router-dom';
import { UpdateRegion_Transaction, EditRegion_Transaction, SortRegionsByCriteria_Transaction } from '../../utils/jsTPS';


const Homescreen = (props) => {

    let maps = [];
    let regions = [];
    let activeRegion = null;
    let subregions = null;
    let regionsToDelete = [];
    const [canUndo, setUndo]                = useState(false);
    const [canRedo, setRedo]                = useState(false);
    const [AddRegion]                       = useMutation(mutations.ADD_REGION);
    const [UpdateRegion]                    = useMutation(mutations.UPDATE_REGION);
    const [DeleteRegion]                    = useMutation(mutations.DELETE_REGION);
    const [TempDeleteRegion]                = useMutation(mutations.TEMP_DELETE_REGION);
    const [MoveMapToTop]                    = useMutation(mutations.MOVE_MAP_TO_TOP);
    const [SortRegionsByCriteria]           = useMutation(mutations.SORT_REGIONS_BY_CRITERIA);

    // const GetDBRegions = useQuery(GET_DB_REGIONS);
    // if(GetDBRegions.error) { console.log(GetDBRegions.error); }
	// if(GetDBRegions.data) { 
	// 	regions = GetDBRegions.data.getAllRegions;
	// }

    const GetDBMaps = useQuery(GET_DB_MAPS);
	// if(loading) { console.log('loading'); }
	if(GetDBMaps.error) { console.log(GetDBMaps.error); }
	if(GetDBMaps.data) { 
		maps = GetDBMaps.data.getAllMaps;
	}

    const [getRegionById, {loading: regionLoading, error: regionError, data: regionData, refetch: regionRefetch}] = useLazyQuery(GET_REGION_BY_ID);
    if (regionError) { 
        console.log(regionError); 
    }
    if (regionData) {
        activeRegion = regionData.getRegionById;
        subregions = activeRegion.subregions;
    }

    const refetchRegions= async () => {
        const {loading, error, data } = await regionRefetch();
        console.log(data);
        if (error) { console.log(error);}
		if (data) {
			activeRegion = data.getRegionById;
            subregions = activeRegion.subregions;
		}
	}

	const auth = props.user === null ? false : true;

    const tpsUndo = async () => {
		const retVal = await props.tps.undoTransaction();
		refetchRegions(regionRefetch);
		pollUndo();
		pollRedo();
		return retVal;
	}

	const tpsRedo = async () => {
		const retVal = await props.tps.doTransaction();
		refetchRegions(regionRefetch);
		pollUndo();
		pollRedo();
		return retVal;
	}

	const pollUndo = async () => {
		const retVal = await props.tps.hasTransactionToUndo();
		if (retVal) setUndo(true);
		else setUndo(false);
	}

	const pollRedo = async () => {
		const retVal = await props.tps.hasTransactionToRedo();
		if (retVal) setRedo(true);
		else setRedo(false);
	}

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
        const { data } = await AddRegion({ variables: { region: newMap, regionExists: false }, refetchQueries: [{ query: GET_DB_MAPS}] });
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

    const addNewRegion = async (parentID) => {
        const length = regions.length;
		const id = length >= 1 ? regions[length - 1].sortId + 1 : 0;
        const newRegion = {
            _id: '',
            name: 'Untitled Region',
            capital: 'Unnamed Capital',
            leader: 'Unknown Leader',
            flag: '',
            parentRegion: parentID,
            subregions: [],
            landmarks: [],
            sortId: id,
            owner: props.user._id
        }
        let opcode = 1;
		let transaction = new UpdateRegion_Transaction(newRegion, opcode, AddRegion, DeleteRegion);
		props.tps.addTransaction(transaction);
		tpsRedo();
    }

    const editRegion = async (_id, field, value, prev) => {
		let transaction = new EditRegion_Transaction(_id, field, value, prev, UpdateRegion);
		props.tps.addTransaction(transaction);
		tpsRedo();
    }

    const sortRegionsByCriteria = async(_id, isAscending, criteria, subregions) => {
		//remove typename cuz it sucks
		let cleanedSubregions = subregions.map(({ __typename, ...rest}) => rest);
		let transaction = new SortRegionsByCriteria_Transaction(_id, isAscending, criteria, cleanedSubregions, SortRegionsByCriteria);
		props.tps.addTransaction(transaction);
		tpsRedo();
	}

    const deleteSubregion = async (entry) => {
        regionsToDelete.push(entry);
        const deletedRegion = {
            _id: entry._id,
            name: entry.name,
            capital: entry.capital,
            leader: entry.leader,
            flag: entry.flag,
            parentRegion: entry.parentRegion,
            subregions: entry.subregions,
            landmarks: entry.landmarks,
            sortId: entry.sortId,
            owner: entry.owner
        }
        let opcode = 0;
		let transaction = new UpdateRegion_Transaction(deletedRegion, opcode, AddRegion, TempDeleteRegion);
		props.tps.addTransaction(transaction);
		tpsRedo();
        console.log(regionsToDelete);
    }

    //TODO: Regions to delete not working for hard deletion of nested regions
    const clearTPS = () => {
        console.log('cleared tps');
        props.tps.clearAllTransactions();
        pollUndo();
        pollRedo();
        console.log(regionsToDelete);
        regionsToDelete.forEach(region => {
            DeleteRegion({ variables: { _id: region._id}, refetchQueries: [{ query: GET_DB_REGIONS}] });
        });
        regionsToDelete = [];
    }


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
                            deleteSubregion={deleteSubregion} editRegion={editRegion} canUndo={canUndo} canRedo={canRedo}
                            undo={tpsUndo} redo={tpsRedo} activeRegion={activeRegion} subregions={subregions} 
                            getRegionById={getRegionById} regionRefetch={regionRefetch} clearTPS={clearTPS}
                            editRegion={editRegion} sortRegions={sortRegionsByCriteria}
                        />
                    </Route>
                    <Route exact path='/regions/:_id' name='regions'>
                        <RegionSpreadsheet
                            fetchUser={props.fetchUser} user={props.user} auth={auth} addNewRegion={addNewRegion}
                            deleteSubregion={deleteSubregion} editRegion={editRegion} canUndo={canUndo} canRedo={canRedo}
                            undo={tpsUndo} redo={tpsRedo} activeRegion={activeRegion} subregions={subregions}
                            getRegionById={getRegionById} regionRefetch={regionRefetch} clearTPS={clearTPS}
                            editRegion={editRegion} sortRegions={sortRegionsByCriteria}
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