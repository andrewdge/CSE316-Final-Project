import React, { useState }	from 'react';
import Login from '../modals/Login';
import Update from '../modals/Update';
import CreateAccount from '../modals/CreateAccount';
import MapContents from '../maps/MapContents';
import RegionSpreadsheet from '../regions/RegionSpreadsheet';
import RegionViewer from '../regions/RegionViewer';
import { GET_DB_MAPS, GET_DB_REGIONS, GET_LINEAGE, GET_REGION_BY_ID, GET_ALL_SUBREGIONS } 				from '../../cache/queries';
import * as mutations 					from '../../cache/mutations';
import { useMutation, useQuery, useLazyQuery } 		from '@apollo/client';
import Welcome from '../welcome/Welcome';
import { Switch, Route, Redirect, useHistory } from 'react-router-dom';
import { UpdateRegion_Transaction, EditRegion_Transaction, SortRegionsByCriteria_Transaction, 
         UpdateLandmark_Transaction,
       } from '../../utils/jsTPS';
import { typeFromAST } from 'graphql';


const Homescreen = (props) => {

    let maps = [];
    let regions = [];
    let activeRegion = null;
    let subregions = null;
    let siblings = null;
    let lineage = [];
    let changeableSubregions = [];
    const [canUndo, setUndo]                  = useState(false);
    const [canRedo, setRedo]                  = useState(false);
    const [AddRegion]                         = useMutation(mutations.ADD_REGION);
    const [UpdateRegion]                      = useMutation(mutations.UPDATE_REGION);
    const [DeleteRegion]                      = useMutation(mutations.DELETE_REGION);
    const [TempDeleteRegion]                  = useMutation(mutations.TEMP_DELETE_REGION);
    const [MoveMapToTop]                      = useMutation(mutations.MOVE_MAP_TO_TOP);
    const [SortRegionsByCriteria]             = useMutation(mutations.SORT_REGIONS_BY_CRITERIA);
    const [AddLandmark]                       = useMutation(mutations.ADD_LANDMARK);
    const [DeleteLandmark]                    = useMutation(mutations.DELETE_LANDMARK);
    const [UpdateLandmark]                    = useMutation(mutations.UPDATE_LANDMARK);
    
    
    let history = useHistory();

    // const GetDBRegions = useQuery(GET_DB_REGIONS);
    // if(GetDBRegions.error) { console.log(GetDBRegions.error); }
	// if(GetDBRegions.data) { 
	// 	regions = GetDBRegions.data.getAllRegions;
	// }

    const {loading: mapsLoading, error: mapsError, data: mapsData, refetch: mapsRefetch} = useQuery(GET_DB_MAPS);
	// if(loading) { console.log('loading'); }
	if(mapsError) { console.log(mapsError); }
	if(mapsData) { 
		maps = mapsData.getAllMaps;
	}

    const [getRegionById, {loading: regionLoading, error: regionError, data: regionData, refetch: regionRefetch}] = useLazyQuery(GET_REGION_BY_ID, {fetchPolicy: 'cache-and-network'});
    if (regionError) { 
        console.log(regionError); 
    }
    if (regionData) {
        activeRegion = regionData.getRegionById;
        subregions = activeRegion.subregions;
        if (activeRegion.parentRegion) siblings = activeRegion.parentRegion.subregions;
    }


    const [getLineage, {loading: lineageLoading, error: lineageError, data: lineageData, refetch: lineageRefetch}] = useLazyQuery(GET_LINEAGE, {fetchPolicy: 'cache-and-network'});
    if (lineageError) {
        console.log(lineageError);
    }
    if (lineageData){
        lineage = lineageData.getLineage;
    }

    const [getAllSubregions, {loading: subregionLoading, error: subregionError, data: subregionData, refetch: subregionRefetch}] = useLazyQuery(GET_ALL_SUBREGIONS, {fetchPolicy: 'cache-and-network'});
    if (subregionError){
        console.log(subregionError);
    }
    if (subregionData){
        changeableSubregions = subregionData.getAllSubregions;
    }

    const refetchMaps = async () => {
        const {loading, error, data} = await mapsRefetch();
        if (error) console.log(error);
        if (data) {
            maps = data.getAllMaps;
            console.log(maps);
        }
    }

    const refetchRegions= async () => {
        const {loading, error, data } = await regionRefetch();
        if (error) { console.log(error);}
		if (data) {
			activeRegion = data.getRegionById;
            subregions = activeRegion.subregions;
            if (activeRegion.parentRegion) siblings = activeRegion.parentRegion.subregions;
		}
	}

   

	const auth = props.user === null ? false : true;

    const tpsUndo = async () => {
		const retVal = await props.tps.undoTransaction();
        console.log(props.tps.transactions);
		refetchRegions();
		pollUndo();
		pollRedo();
		return retVal;
	}

	const tpsRedo = async () => {
		const retVal = await props.tps.doTransaction();
		refetchRegions();
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

    const deleteMap = async (_id) => {
        await DeleteRegion({ variables: { _id: _id}});
        await refetchMaps();
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
        for (let i = 0; i < cleanedSubregions.length; i++){
            cleanedSubregions[i].parentRegion = cleanedSubregions[i].parentRegion._id;
            cleanedSubregions[i].landmarks = cleanedSubregions[i].landmarks.map(landmark => landmark._id);
            cleanedSubregions[i].subregions = cleanedSubregions[i].subregions.map(subregion => subregion._id);
        }
		let transaction = new SortRegionsByCriteria_Transaction(_id, isAscending, criteria, cleanedSubregions, SortRegionsByCriteria);
		props.tps.addTransaction(transaction);
		tpsRedo();
	}

    const deleteSubregion = async (entry) => {
        let cleanedSubregions = entry.subregions.map(entry => entry._id);
        let cleanedParentRegion = entry.parentRegion._id;
        let cleanedLandmarks = entry.landmarks.map(entry => entry._id);

        const deletedRegion = {
            _id: entry._id,
            name: entry.name,
            capital: entry.capital,
            leader: entry.leader,
            flag: entry.flag,
            parentRegion: cleanedParentRegion,
            subregions: cleanedSubregions,
            landmarks: cleanedLandmarks,
            sortId: entry.sortId,
            owner: entry.owner
        }
        let opcode = 0;
		let transaction = new UpdateRegion_Transaction(deletedRegion, opcode, AddRegion, TempDeleteRegion);
		props.tps.addTransaction(transaction);
		tpsRedo();
    }

    const addLandmark = async (parentID, name, location) => {
        const newLandmark= {
            _id: '',
            name: name !== '' ? name : 'Untitled Landmark',
            location: location,
            parentRegion: parentID,
            owner: props.user._id
        }
        let opcode = 1;
		let transaction = new UpdateLandmark_Transaction(newLandmark, opcode, AddLandmark, DeleteLandmark);
		props.tps.addTransaction(transaction);
		tpsRedo();
    }

    const editLandmark = async (_id, field, value, prev) => {
		let transaction = new EditRegion_Transaction(_id, field, value, prev, UpdateLandmark);
		props.tps.addTransaction(transaction);
		tpsRedo();
    }

    const deleteLandmark =  (entry) => {
        const deletedLandmark = {
            _id: entry._id,
            name: entry.name,
            location: entry.location,
            parentRegion: entry.parentRegion,
            owner: entry.owner
        }
        let opcode = 0;
		let transaction = new UpdateLandmark_Transaction(deletedLandmark, opcode, AddLandmark, DeleteLandmark);
		props.tps.addTransaction(transaction);
		tpsRedo();
    }


    const clearTPS = async () => {
        props.tps.clearAllTransactions();
        pollUndo();
        pollRedo();
        Object.keys(localStorage).forEach( (region) => {
            console.log(JSON.parse(localStorage.getItem(region)));
        });
        Object.keys(localStorage).forEach( async(region) => {
            await AddRegion({ variables: { region: JSON.parse(localStorage.getItem(region)), regionExists: true }});
        });
        Object.keys(localStorage).forEach( async(region) => {
            DeleteRegion({ variables: { _id: region }});
        });
        localStorage.clear();
        await refetchRegions();
    }


	return (
        <>
            { 
                auth ?
                <Switch>
                    <Route exact path="/home" name="home">
                        <MapContents 
                            user={props.user} fetchUser={props.fetchUser} maps={maps} refetch={refetchMaps}
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
                            undo={tpsUndo} redo={tpsRedo} activeRegion={activeRegion} subregions={subregions} tpsUndo={tpsUndo} tpsRedo={tpsRedo}
                            getRegionById={getRegionById} refetchRegions={refetchRegions} clearTPS={clearTPS} refetchMaps={refetchMaps}
                            editRegion={editRegion} sortRegions={sortRegionsByCriteria} getLineage={getLineage} lineage={lineage}
                        />
                    </Route>
                    <Route exact path='/regions/:_id' name='regions'>
                        <RegionSpreadsheet
                            fetchUser={props.fetchUser} user={props.user} auth={auth} addNewRegion={addNewRegion}
                            deleteSubregion={deleteSubregion} editRegion={editRegion} canUndo={canUndo} canRedo={canRedo}
                            undo={tpsUndo} redo={tpsRedo} activeRegion={activeRegion} subregions={subregions} tpsUndo={tpsUndo} tpsRedo={tpsRedo}
                            getRegionById={getRegionById} refetchRegions={refetchRegions} clearTPS={clearTPS} refetchMaps={refetchMaps}
                            editRegion={editRegion} sortRegions={sortRegionsByCriteria} getLineage={getLineage} lineage={lineage}
                        />
                    </Route>
                    <Route exact path='/regionviewer/:_id' name='regionviewer'>
                        <RegionViewer
                            fetchUser={props.fetchUser} user={props.user} auth={auth} activeRegion={activeRegion} subregions={subregions}
                            getRegionById={getRegionById} regionRefetch={regionRefetch} getLineage={getLineage} lineage={lineage} 
                            clearTPS={clearTPS} refetchRegions={refetchRegions} canUndo={canUndo} canRedo={canRedo} undo={tpsUndo} redo={tpsRedo}
                            addLandmark={addLandmark} deleteLandmark={deleteLandmark} editLandmark={editLandmark} tpsUndo={tpsUndo} tpsRedo={tpsRedo}
                            siblings={siblings} getAllSubregions={getAllSubregions} changeableSubregions={changeableSubregions}
                            changeParent={editRegion} refetchMaps={refetchMaps}
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
                        <Login fetchUser={props.fetchUser} refetch={refetchMaps} user={props.user} auth={auth}/>
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