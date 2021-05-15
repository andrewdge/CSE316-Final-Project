import React from 'react';

import { WModal, WMHeader, WMMain, WButton, WRow } from 'wt-frontend';

const ChangeParent = (props) => {

    const handleChangeParent = async (entry) => {
        props.changeParentFunction(entry);
        props.cancelFunction();
    }

    const handleCancel = () => {
        props.cancelFunction();
    }

    return (
        <WModal className="delete-modal" visible={true} >
            <WMHeader className="change-parent-modal-header" onClose={handleCancel}>
                Which region would you like to select as the parent of {props.name}?
			</WMHeader>

            <WMMain>
                
                <div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center'}}>
                        {props.changeableSubregions.map( (entry, index) => (
                            <WButton key={index} className="change-parent-modal-button" hoverAnimation='darken' onClick={() => handleChangeParent(entry)} wType="texted">
                                {entry.name}
                            </WButton>
                        ))}
                    </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center'}}>
                    <WButton className="modal-button cancel-button" hoverAnimation='darken' onClick={handleCancel} wType="texted">
                        Cancel
                    </WButton>
                </div>
                
                    {/* <WButton className="modal-button" onClick={props.changeParentFunction} hoverAnimation="darken" shape="rounded" color="danger">
                        Delete
                    </WButton> */}
               
                
            </WMMain>
        </WModal>
    );
}

export default ChangeParent;