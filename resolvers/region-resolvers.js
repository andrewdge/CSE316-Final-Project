const ObjectId = require('mongoose').Types.ObjectId;
const Region = require('../models/region-model');

module.exports = {
    Query: {
        getAllMaps: async (_, __, { req }) => {
            const _id = new ObjectId(req.userId);
			if(!_id) { return([])};
			const maps = await Region.find({ owner: _id, parentRegion: null });
			if(maps) return (maps);
        },
        getRegionById: async ( _, args ) => {
            return null;
        },
    },
    Mutation: {
        addRegion: async ( _, args ) => {
            const { region } = args;
            const  objectId = new ObjectId();
            const { name, capital, leader, flag, parentRegion, subregions, landmarks, owner } = region;
            const newMap = new Region({
                _id: objectId,
                name: name,
                capital: capital,
                leader: leader,
                flag: flag,
                parentRegion: parentRegion,
                subregions: subregions,
                landmarks: landmarks,
                owner: owner
            });
            const added = await newMap.save();
            const objectString = objectId.toString();
            if (added){
                return objectString;
            }
            else return ('Could not add map');
        },
        updateRegion: async ( _, args ) => {
            const { _id, field, value } = args; 
            const objectId = new ObjectId(_id);
            const updated = await Region.updateOne({ _id: objectId }, { [field]: value });
            if (updated) return value;
            else return "";
        },
        deleteRegion: async ( _, args ) => {
            const { _id } = args;
            const objectId = new ObjectId(_id);
            const deleted = await Region.deleteOne({ _id: objectId });
            if (deleted) return true;
            else return false;
        }
    }
}