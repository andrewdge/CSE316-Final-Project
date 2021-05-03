import React from 'react';
import { WCard, WRow, WCol, WButton } from 'wt-frontend';
import { Link, useHistory } from 'react-router-dom';

const RegionEntry = (props) => {

    const history = useHistory();

    const deleteSubregion = async () =>{
        await props.deleteSubregion(props.entry._id);
        await props.regionRefetch();
    }

    const goToSubregion = () => {
        history.push(`/regions/${props.entry._id}`);
    }

    return (
        <WCard style={{ height: '60px', width: '100%', borderStyle: 'solid' }}>
            <WRow style={{ height: '100%', width: '100%'}}>
                <WCol size='1' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <WButton shape='rounded' hoverAnimation='lighten' clickAnimation='ripple-light' onClick={deleteSubregion}>
                        <i className='material-icons'>clear</i>
                    </WButton>
                </WCol>
                <WCol size='2' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <Link to={{ pathname: `/regions/${props.entry._id}` }}>
                        <WButton style={{ color: 'deepskyblue' }} onClick={goToSubregion} >   
                            {props.entry.name}
                        </WButton>
                    </Link>
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