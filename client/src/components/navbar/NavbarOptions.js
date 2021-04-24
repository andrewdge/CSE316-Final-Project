import React                                from 'react';
import { LOGOUT }                           from '../../cache/mutations';
import { useMutation, useApolloClient }     from '@apollo/client';
import { WButton, WNavItem, WNavbar }                from 'wt-frontend';
import Logo from './Logo';

const LoggedIn = (props) => {
    const client = useApolloClient();
	const [Logout] = useMutation(LOGOUT);

    const handleLogout = async (e) => {
        Logout();
        const { data } = await props.fetchUser();
        if (data) {
            let reset = await client.resetStore();
            // if (reset) props.setActiveList({});
        }
    };


    let firstName = props.user.firstName;
    let lastName = props.user.lastName;

    return (
        <>
            <WNavItem hoverAnimation="lighten">
                <WButton style={{ color: '#e02645', fontSize: '16px' }} onClick={props.setShowUpdate}  wType="texted" hoverAnimation="text-primary" clickAnimation="ripple-light">
                    { firstName + " " + lastName }
                </WButton>
            </WNavItem>
            <WNavItem hoverAnimation="lighten">
                <WButton className="navbar-options" onClick={handleLogout} wType="texted" hoverAnimation="text-primary" clickAnimation="ripple-light">
                    Logout
                </WButton>
            </WNavItem >
        </>
    );
};

const LoggedOut = (props) => {
    return (
        <>
            <WNavItem hoverAnimation="lighten">
                <WButton className="navbar-options" style={{ color: 'red' }} onClick={props.setShowCreate} wType="texted" clickAnimation="ripple-light" hoverAnimation="text-primary"> 
                    Create <br></br> Account
                </WButton>
            </WNavItem>
            <WNavItem hoverAnimation="lighten">
                <WButton className="navbar-options" onClick={props.setShowLogin} wType="texted" clickAnimation="ripple-light" hoverAnimation="text-primary">
                    Login
                </WButton>
            </WNavItem>
        </>
    );
};


const NavbarOptions = (props) => {
    return (
        <WNavbar color='colored'>
            <WNavItem>
                <Logo className='logo' />
            </WNavItem>
            <WNavbar color='colored'>
            {
                props.auth === false ? 
                    <LoggedOut 
                        setShowLogin={props.setShowLogin} setShowCreate={props.setShowCreate} 
                    />
                : 
                    <LoggedIn  
                        user={props.user} fetchUser={props.fetchUser} setShowUpdate={props.setShowUpdate}
                        setActiveList={props.setActiveList} logout={props.logout} 
                    />
            }
            </WNavbar>
            
        </WNavbar>

    );
};

export default NavbarOptions;