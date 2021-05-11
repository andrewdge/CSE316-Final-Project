import React, { useEffect }                                from 'react';
import { LOGOUT }                           from '../../cache/mutations';
import { useMutation, useApolloClient}     from '@apollo/client';
import { WButton, WNavItem, WNavbar, WRow, WCol }                from 'wt-frontend';
import { Link, useHistory, useLocation, useParams}  from 'react-router-dom';
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
    let location = useLocation();

    const goHome = () => {
        if (props.auth){
            history.push('/home');
        } else {
            history.push('/welcome');
        }
        if (location.pathname !== '/home'){
            props.clearTPS();
        }
    }

    let breadcrumbs;
    if (props.activeRegion){
        if (props.lineage.length > 0 ){
            if (props.lineage.length === 1){
                breadcrumbs = 
                    <Link to={{ pathname: `/maps/${props.lineage[0]._id}`}} onClick={props.clearTPS}>
                        <WButton>
                            {props.lineage[0].name}
                        </WButton>
                    </Link>
                    ;
            } else if (props.lineage.length < 6){
                breadcrumbs = props.lineage.map( (parent, index) => 
                            index !== props.lineage.length-1 ? 
                            ( 
                                <>
                                    <Link to={{ pathname: `/maps/${parent._id}`}} onClick={props.clearTPS}>
                                        <WButton>
                                            {parent.name}
                                        </WButton>
                                    </Link>
                                    <div>
                                        {'>'}
                                    </div>
                                </>
                            )
                            :
                            <Link to={{ pathname: `/maps/${parent._id}`}} onClick={props.clearTPS}>
                                <WButton >
                                    {parent.name}
                                </WButton>
                            </Link>
                            
                            );
            } else {
                breadcrumbs = 
                    <>
                        <Link to={{ pathname: `/maps/${props.lineage[0]._id}`}} onClick={props.clearTPS}>
                            <WButton>
                                {props.lineage[0].name}
                            </WButton>
                        </Link>
                        <div>
                            {'>'}
                        </div>
                        <Link to={{ pathname: `/maps/${props.lineage[1]._id}`}} onClick={props.clearTPS}>
                            <WButton>
                                {props.lineage[1].name}
                            </WButton>
                        </Link>
                        <div>
                            {'>'}
                        </div>
                        <Link to={{ pathname: `/maps/${props.lineage[2]._id}`}} onClick={props.clearTPS}>
                            <WButton>
                                {props.lineage[2].name}
                            </WButton>
                        </Link>
                        <div>
                            {'>'}
                        </div>
                        <WButton>
                            {`...`}
                        </WButton>
                        <div>
                            {`>`}
                        </div>
                        <Link to={{ pathname: `/maps/${props.lineage[props.lineage.length-3]._id}`}} onClick={props.clearTPS}>
                            <WButton>
                                {props.lineage[props.lineage.length-3].name}
                            </WButton>
                        </Link>
                        <div>
                            {'>'}
                        </div>
                        <Link to={{ pathname: `/maps/${props.lineage[props.lineage.length-2]._id}`}} onClick={props.clearTPS}>
                            <WButton>
                                {props.lineage[props.lineage.length-2].name}
                            </WButton>
                        </Link>
                        <div>
                            {'>'}
                        </div>
                        <Link to={{ pathname: `/maps/${props.lineage[props.lineage.length-1]._id}`}} onClick={props.clearTPS}>
                            <WButton>
                                {props.lineage[props.lineage.length-1].name}
                            </WButton>
                        </Link>
                    </>;
            }
            
        }
    }


    return (
        <WNavbar color='colored'>
            <WNavItem>
                <WButton style={{ backgroundColor: '#1a1b1d' }} onClick={goHome}>  
                    <Logo className='logo' />
                </WButton>
            </WNavItem>
            <WNavItem>
                {breadcrumbs}
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