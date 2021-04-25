import React, { useState } 	from 'react';
import { UPDATE }			from '../../cache/mutations';
import { useMutation }    	from '@apollo/client';

import { WModal, WMHeader, WMMain, WMFooter, WButton, WInput, WRow, WCol } from 'wt-frontend';

const Update = (props) => {
	const [input, setInput] = useState({ email: props.user.email, password: props.user.password, firstName: props.user.firstName, lastName: props.user.lastName});
	const [loading, toggleLoading]                  = useState(false);
    const [editingFirstName, toggleFirstNameEdit]   = useState(false);
    const [editingLastName, toggleLastNameEdit]     = useState(false);
    const [editingEmail, toggleEmailEdit]           = useState(false);
    const [editingPassword, togglePasswordEdit]     = useState(false);
	const [Update] = useMutation(UPDATE);
	
	const updateInput = (e) => {
		const { name, value } = e.target;
		const updated = { ...input, [name]: value };
		setInput(updated);
	};

    const handleFirstNameEdit = (e) => {
        toggleFirstNameEdit(false);
        updateInput(e);
    };

    const handleLastNameEdit = (e) => {
        toggleLastNameEdit(false);
        updateInput(e);
    };

    const handleEmailEdit = (e) => {
        toggleEmailEdit(false);
        updateInput(e);
    };
    const handlePasswordEdit = (e) => {
        togglePasswordEdit(false);
        updateInput(e);
    };


	const handleUpdateAccount = async (e) => {
        if (input['password'] === ''){
            input['password'] = props.user.password;
        }
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
                            <WCol size="8">
                                {
                                    editingFirstName || input.firstName === ''
                                        ? <WInput
                                            className='modal-input' onBlur={handleFirstNameEdit}
                                            autoFocus={true} inputType='text' name="firstName"
                                            wType="outlined" barAnimation="solid" defaultValue={input.firstName}
                                        />
                                        : <div className="modal-text"
                                            onClick={() => toggleFirstNameEdit(!editingFirstName)}
                                        >{input.firstName}
                                        </div>
                                }
                            </WCol>
                        </WRow>
                        <div className="modal-spacer">&nbsp;</div>
                        <WRow className="modal-col-gap update-modal">
                            <WCol className="modal-label" size="4">
                                Last Name:
                            </WCol>
                            <WCol size="8">
                                {
                                    editingLastName || input.lastName === ''
                                        ? <WInput
                                            className='modal-input' onBlur={handleLastNameEdit}
                                            autoFocus={true} inputType='text' name="lastName"
                                            wType="outlined" barAnimation="solid" defaultValue={input.lastName}
                                        />
                                        : <div className="modal-text"
                                            onClick={() => toggleLastNameEdit(!editingLastName)}
                                        >{input.lastName}
                                        </div>
                                }
                            </WCol>
                        </WRow>
                        <div className="modal-spacer">&nbsp;</div>
                        <WRow className="modal-col-gap update-modal">
                            <WCol className="modal-label" size="4">
                                Email:
                            </WCol>
                            <WCol size="8">
                                {
                                    editingEmail || input.email === ''
                                        ? <WInput
                                            className='modal-input' onBlur={handleEmailEdit}
                                            autoFocus={true} inputType='text' name="email"
                                            wType="outlined" barAnimation="solid" defaultValue={input.email}
                                        />
                                        : <div className="modal-text"
                                            onClick={() => toggleEmailEdit(!editingEmail)}
                                        >{input.email}
                                        </div>
                                }
                            </WCol>
                        </WRow>
						<div className="modal-spacer">&nbsp;</div>
                        <WRow className="modal-col-gap update-modal">
                            <WCol className="modal-label" size="4">
                                Password:
                            </WCol>
                            <WCol size="8">
                                {
                                    editingPassword 
                                        ? <WInput
                                            className='modal-input' onBlur={handlePasswordEdit}
                                            autoFocus={true} inputType='text' name="password"
                                            wType="outlined" barAnimation="solid" defaultValue={""}
                                        />
                                        : <div className="modal-text"
                                            onClick={() => togglePasswordEdit(!editingPassword)}
                                        >{"********"}
                                        </div>
                                }
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
