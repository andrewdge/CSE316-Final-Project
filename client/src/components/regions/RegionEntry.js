import React from 'react';
import { WCard, WRow, WCol, WButton } from 'wt-frontend';

const RegionEntry = (props) => {

    const deleteSubregion = () =>{

    }

    return (
        <WCard style={{ height: '15%', width: '100%', borderStyle: 'solid' }}>
            <WRow style={{ height: '100%', width: '100%'}}>
                <WCol size='1' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <WButton shape='rounded' hoverAnimation='lighten' clickAnimation='ripple-light' onClick={deleteSubregion}>
                        <i className='material-icons'>clear</i>
                    </WButton>
                </WCol>
                <WCol size='2' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    {props.entry.name}
                </WCol>
                <WCol size='2' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    {props.entry.capital}
                </WCol>
                <WCol size='2' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    {props.entry.leader}
                </WCol>
                <WCol size='2' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    flag here
                </WCol>
                <WCol size='3' style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center'}}>
                    landmarks...
                </WCol>
            </WRow>
        </WCard>
    );
};
export default RegionEntry;