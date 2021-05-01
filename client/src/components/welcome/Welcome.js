import React            from 'react';
import world            from '../../images/world.png';
import NavbarOptions from '../navbar/NavbarOptions';
import { WRow, WCol, WLayout, WLHeader, WLMain }   from 'wt-frontend';

const Welcome = (props) => {
    return (
        <WLayout wLayout='header'>
            <WLHeader>
                <NavbarOptions 
                    user={props.user} fetchUser={props.fetchUser} auth={props.auth} 
                />
            </WLHeader>
            <WLMain>
                <div className='homepage' >
                    <div className='modal-spacer'>&nbsp;</div>
                    <WRow>
                        <WCol size="3">

                        </WCol>
                        <WCol size="6" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <img className='world-image' src={world} alt='world'  />
                        </WCol>
                        <WCol size="3">

                        </WCol>
                    </WRow>
                    <div className='modal-spacer'>&nbsp;</div>
                    <WRow>
                        <WCol size="3">

                        </WCol>
                        <WCol size="6" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div className='welcome-text'>
                                Welcome To The <br></br>
                                World Data Mapper
                            </div>
                        </WCol>
                        <WCol size="3">

                        </WCol>
                    </WRow>
                </div>
            </WLMain>
        </WLayout>
        
    );
};

export default Welcome;