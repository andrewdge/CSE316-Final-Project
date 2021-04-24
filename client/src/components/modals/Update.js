import React, { useState } 	from 'react';
import { UPDATE }			from '../../cache/mutations';
import { useMutation }    	from '@apollo/client';

import { WModal, WMHeader, WMMain, WMFooter, WButton, WInput, WRow, WCol } from 'wt-frontend';

const Update = (props) => {
	const [input, setInput] = useState({ _id: props.user._id, firstName: '', lastName: '', email: '', password: '' });
	const [loading, toggleLoading] = useState(false);
	const [Update] = useMutation(UPDATE);

	
	const updateInput = (e) => {
		const { name, value } = e.target;
		const updated = { ...input, [name]: value };
		setInput(updated);
	};

	const handleUpdateAccount = async (e) => {
		for (let field in input) {
			if (!input[field]) {
				alert('You cannot have an empty field!');
				return;
			}
		}
		const { loading, error, data } = await Update({ variables: { ...input } });
		if (loading) { toggleLoading(true) };
		if (error) { return `Error: ${error.message}` };
		if (data) {
			console.log(data)
			toggleLoading(false);
			props.fetchUser();
			props.setShowUpdate(false);
		};
	};

	return (
		<WModal className="update-modal" visible={true} >
			<WMHeader className="modal-header" style={{ textAlign: 'center' }} onClose={() => props.setShowUpdate(false)}>
				Update Account
			</WMHeader>

			{
				loading ? <WMMain />
					: <WMMain>
                        <WRow className="modal-col-gap update-modal">
                            <WCol className="modal-label" size="4">
                                 First Name:
                            </WCol>
                            <WCol size="4">
                                <WInput 
                                    className="modal-input" onBlur={updateInput} name="firstName" labelAnimation="up" 
                                    barAnimation="solid" labelText={props.user.firstName} wType="outlined" inputType="text" 
                                />
                            </WCol>
                        </WRow>
                        <div className="modal-spacer">&nbsp;</div>
                        <WRow className="modal-col-gap update-modal">
                            <WCol className="modal-label" size="4">
                                Last Name:
                            </WCol>
                            <WCol size="4">
                            <WInput 
                                className="modal-input" onBlur={updateInput} name="lastName" labelAnimation="up" 
                                barAnimation="solid" labelText={props.user.lastName} wType="outlined" inputType="text" 
                            />
                            </WCol>
                        </WRow>
                        <div className="modal-spacer">&nbsp;</div>
                        <WRow className="modal-col-gap update-modal">
                            <WCol className="modal-label" size="4">
                                Email:
                            </WCol>
                            <WCol size="4">
                            <WInput 
                                className="modal-input" onBlur={updateInput} name="email" labelAnimation="up" 
                                barAnimation="solid" labelText={props.user.email} wType="outlined" inputType="text" 
                            />
                            </WCol>
                        </WRow>
						<div className="modal-spacer">&nbsp;</div>
                        <WRow className="modal-col-gap update-modal">
                            <WCol className="modal-label" size="4">
                                Password:
                            </WCol>
                            <WCol size="4">
                            <WInput 
							className="modal-input" onBlur={updateInput} name="password" labelAnimation="up" 
							barAnimation="solid" labelText="********" wType="outlined" inputType="password" 
						/>
                            </WCol>
                        </WRow>
					</WMMain>
			}
			<WButton className="modal-button" onClick={handleUpdateAccount} span clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded" color="primary">
				Update
			</WButton>
		</WModal>
	);
}

export default Update;
