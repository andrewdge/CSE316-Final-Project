import React, { useState, useEffect } 	from 'react';
import Logo from '../navbar/Logo';
import Login from '../modals/Login';
import Delete from '../modals/Delete';
import Update from '../modals/Update';
import CreateAccount from '../modals/CreateAccount';
import { WNavbar, WNavItem } 	from 'wt-frontend';
import { WLayout, WLHeader, WLMain, WLSide } from 'wt-frontend';
import NavbarOptions from '../navbar/NavbarOptions';
import { GET_DB_TODOS } 				from '../../cache/queries';
import * as mutations 					from '../../cache/mutations';
import { useMutation, useQuery } 		from '@apollo/client';

const Homescreen = (props) => {

    // let maps = [];
    const [showDelete, toggleShowDelete] 	= useState(false);
	const [showLogin, toggleShowLogin] 		= useState(false);
	const [showCreate, toggleShowCreate] 	= useState(false);
    const [showUpdate, toggleShowUpdate]    = useState(false);

    // const { loading, error, data, refetch } = useQuery(GET_DB_TODOS);
	//  if(loading) { console.log(loading, 'loading'); }
	// if(error) { console.log(error, 'error'); }
	// if(data) { 
	// 	maps = data.getAllMaps;

	// }
	const auth = props.user === null ? false : true;

    const toggleAllModalOff = () => {
        toggleShowDelete(false);
		toggleShowCreate(false);
        toggleShowUpdate(false);
        toggleShowLogin(false);
    }

    const setShowLogin = () => {
		toggleAllModalOff();
		toggleShowLogin(!showLogin);
	};

	const setShowCreate = () => {
		toggleAllModalOff();
		toggleShowCreate(!showCreate);
	};

    const setShowUpdate = () => {
		toggleAllModalOff();
		toggleShowUpdate(!showUpdate)
	};

	const setShowDelete = () => {
		toggleAllModalOff();
		toggleShowDelete(!showDelete)
	};

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

    console.log(auth);
	return (
		<WLayout wLayout='header'>
            <WLHeader>
                <NavbarOptions 
                    user={props.user} fetchUser={props.fetchUser} auth={auth} 
                    setShowCreate={setShowCreate} setShowLogin={setShowLogin} setShowUpdate={setShowUpdate}
                />
            </WLHeader>
            <WLMain>

            </WLMain>
			{
				showCreate && (<CreateAccount fetchUser={props.fetchUser} setShowCreate={setShowCreate} />)
			}

			{
				showLogin && (<Login fetchUser={props.fetchUser} setShowLogin={setShowLogin} />)
			}

            {
                showUpdate && (<Update fetchUser={props.fetchUser} setShowUpdate={setShowUpdate} user={props.user}/>)
            }

        </WLayout>
	);
};

export default Homescreen;