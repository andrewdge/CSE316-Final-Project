import React, { useState } 	from 'react';
import { LOGIN } 			from '../../cache/mutations';
import { useMutation }    	from '@apollo/client';
import { Redirect, useHistory }         from 'react-router-dom';
import NavbarOptions from '../navbar/NavbarOptions';
import { WModal, WMHeader, WMMain, WMFooter, WButton, WInput, WLayout, WLHeader, WLMain } from 'wt-frontend';

const Login = (props) => {
	const [input, setInput] = useState({ email: '', password: '' });
	const [loading, toggleLoading] = useState(false);
	const [showErr, displayErrorMsg] = useState(false);
	const errorMsg = "Email/Password not found.";
	const [Login] = useMutation(LOGIN);

	const updateInput = (e) => {
		const { name, value } = e.target;
		const updated = { ...input, [name]: value };
		setInput(updated);
	}

	let history = useHistory();
	
	const handleLogin = async (e) => {

		const { loading, error, data } = await Login({ variables: { ...input } });
		if (loading) { toggleLoading(true) };
		if (data.login._id === null) {
			displayErrorMsg(true);
			return;
		}
		if (data) {
			props.fetchUser();
			props.refetch();
			history.push('/home');
			toggleLoading(false);
		};
	};

	

	return (

		<WLayout wLayout='header'>
            <WLHeader>
                <NavbarOptions 
                    user={props.user} fetchUser={props.fetchUser} auth={props.auth} 
                />
            </WLHeader>
            <WLMain>
					<WModal className="login-modal" visible={true} >
						<WMHeader className="modal-header" style={{ textAlign: 'center' }} onClose={() => history.push('/welcome') }>
							Login
						</WMHeader>
						{
							loading ? <WMMain />
								: <WMMain className="main-login-modal">

									<WInput className="modal-input" onBlur={updateInput} name='email' labelAnimation="up" barAnimation="solid" labelText="Email Address" wType="outlined" inputType='text' />
									<div className="modal-spacer">&nbsp;</div>
									<WInput className="modal-input" onBlur={updateInput} name='password' labelAnimation="up" barAnimation="solid" labelText="Password" wType="outlined" inputType='password' />

									{
										showErr ? <div className='modal-error'>
											{errorMsg}
										</div>
											: <div className='modal-error'>&nbsp;</div>
									}

								</WMMain>
						}
						<WMFooter>
							<WButton className="modal-button" onClick={handleLogin} span clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded" color="primary">
								Login
							</WButton>
						</WMFooter>
				</WModal>
			</WLMain>
		</WLayout>
	);
}

export default Login;