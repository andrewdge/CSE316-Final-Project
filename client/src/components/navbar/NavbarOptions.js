import React                                from 'react';
import { LOGOUT }                           from '../../cache/mutations';
import { useMutation, useApolloClient }     from '@apollo/client';
import { WButton, WNavItem, WNavbar }                from 'wt-frontend';
import { Link, useHistory, useParams}  from 'react-router-dom';
import Logo from './Logo';

const LoggedIn = (props) => {
    const client = useApolloClient();
	const [Logout] = useMutation(LOGOUT);
    const history = useHistory();

    const handleLogout = async (e) => {
        Logout();
        history.push('/welcome');
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
                <WButton style={{ color: 'red', fontSize: '16px' }}  wType="texted" hoverAnimation="text-primary" clickAnimation="ripple-light">
                    <Link to='/updateaccount'>{ firstName + " " + lastName }</Link>
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
                <WButton className="navbar-options" style={{ color: 'red' }} wType="texted" clickAnimation="ripple-light" hoverAnimation="text-primary"> 
                    <Link to='/createaccount'>Create<br></br>Account</Link>
                </WButton>
            </WNavItem>
            <WNavItem hoverAnimation="lighten">
                <WButton className="navbar-options" wType="texted" clickAnimation="ripple-light" hoverAnimation="text-primary">
                    <Link to='/login'>Login</Link>
                </WButton>
            </WNavItem>
        </>
    );
};

const NavbarOptions = (props) => {

    let history = useHistory();

    const goHome = () => {
        if (props.auth){
            history.push('/home');
        } else {
            history.push('/welcome');
        }
        
        // props.setActiveRoute('');
    }

    let param = useParams();
    console.log(param);

    // let activeMap = props.activeMap !== null ? props.activeMap.name : '';

    return (
        <WNavbar color='colored'>
            <WNavItem>
                <WButton style={{ backgroundColor: '#1a1b1d' }} onClick={goHome}>  
                    <Logo className='logo' />
                </WButton>
            </WNavItem>
            <WNavItem>
                {/* <div style ={{ display: 'flex' }}>
                    {activeMap}
                </div> */}
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