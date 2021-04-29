import React from 'react';

import { WModal, WMHeader, WMMain, WButton } from 'wt-frontend';

const Delete = (props) => {

    const handleDelete = async () => {
        props.deleteFunction();
        props.setShowDelete(false);
    }

    const handleCancel = () => {
        props.cancelFunction();
        props.setShowDelete(false);
    }

    return (
        <WModal className="delete-modal" visible={true} >
            <WMHeader className="modal-header" onClose={() => props.setShowDelete(false)}>
                Delete {props.deleteName}?
			</WMHeader>

            <WMMain>
                <WButton className="modal-button cancel-button" hoverAnimation='darken' onClick={handleCancel} wType="texted">
                    Cancel
				</WButton>
                <label className="col-spacer">&nbsp;</label>
                <WButton className="modal-button" onClick={handleDelete} clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded" color="danger">
                    Delete
				</WButton>
            </WMMain>
        </WModal>
    );
}

export default Delete;