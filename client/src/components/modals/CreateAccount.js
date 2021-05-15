import React, { useState } 	from 'react';
import { REGISTER }			from '../../cache/mutations';
import { useMutation }    	from '@apollo/client';
import { useHistory }       from 'react-router-dom';
import NavbarOptions from '../navbar/NavbarOptions';
import { WModal, WMHeader, WMMain, WButton, WInput, WRow, WCol, WLayout, WLHeader, WLMain } from 'wt-frontend';

const CreateAccount = (props) => {
	const [input, setInput] = useState({ email: '', password: '', firstName: '', lastName: '' });
	const [loading, toggleLoading] = useState(false);
	const [Register] = useMutation(REGISTER);

	
	const updateInput = (e) => {
		const { name, value } = e.target;
		const updated = { ...input, [name]: value };
		setInput(updated);
	};

	let history = useHistory();

	const handleCreateAccount = async (e) => {
		for (let field in input) {
			if (!input[field]) {
				alert('All fields must be filled out to register');
				return;
			}
		}
		const { loading, error, data } = await Register({ variables: { ...input } });
		if (loading) { toggleLoading(true) };
		if (error) { return `Error: ${error.message}` };
		if (data) {
			console.log(data)
			toggleLoading(false);
			if(data.register.email === 'already exists') {
				alert('User with that email already registered');
			}
			else {
				props.fetchUser();
				history.push('/home');
			}
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
				<WModal className="signup-modal" visible={true} >
					<WMHeader className="modal-header" style={{ textAlign: 'center' }}  onClose={() => history.push('/welcome') }>
						Create Account
					</WMHeader>

					{
						loading ? <WMMain />
							: <WMMain>
								<WRow className="modal-col-gap signup-modal">
									<WCol size="6">
										<WInput 
											className="" onBlur={updateInput} name="firstName" labelAnimation="up" 
											barAnimation="solid" labelText="First Name" wType="outlined" inputType="text" 
										/>
									</WCol>
									<WCol size="6">
										<WInput 
											className="" onBlur={updateInput} name="lastName" labelAnimation="up" 
											barAnimation="solid" labelText="Last Name" wType="outlined" inputType="text" 
										/>
									</WCol>
								</WRow>

								<div className="modal-spacer">&nbsp;</div>
								<WInput 
									className="modal-input" span onBlur={updateInput} name="email" labelAnimation="up" 
									barAnimation="solid" labelText="Email Address" wType="outlined" inputType="text" 
								/>
								<div className="modal-spacer">&nbsp;</div>
								<WInput 
									className="modal-input" onBlur={updateInput} name="password" labelAnimation="up" 
									barAnimation="solid" labelText="Password" wType="outlined" inputType="password" 
								/>
							</WMMain>
					}
					<WButton className="modal-button" onClick={handleCreateAccount} span clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded" color="primary">
						Submit
					</WButton>
					<div className="modal-spacer">&nbsp;</div>
				</WModal>
			</WLMain>
		</WLayout>
	);
}

export default CreateAccount;
