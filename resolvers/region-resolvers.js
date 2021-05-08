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
        getAllRegions: async (_, __, { req }) => {
            const _id = new ObjectId(req.userId);
			if(!_id) { return([])};
			const maps = await Region.find({ owner: _id, parentRegion: {$ne: null} });
			if(maps) return (maps);
        },
        getRegionById: async ( _, args ) => {
            const { _id } = args;
            const objectId = new ObjectId(_id);
            // ???????????????????????
            let region = await (await Region.findOne({_id: objectId})).toJSON();
            let subregions = region.subregions;
            for (i = 0; i < subregions.length; i++) {
                subregions[i] = await Region.findOne({_id: subregions[i]});
            }
            region.subregions = subregions;
            if (region.parentRegion !== null){
                let parentRegion = await (await Region.findOne({_id: region.parentRegion })).toJSON();
                region.parentRegion = parentRegion;
            }
            if (region) return region;
            else return {};
        },
    },
    Mutation: {
        addRegion: async ( _, args ) => {
            const { region } = args;
            const  objectId = new ObjectId();
            const { name, capital, leader, flag, parentRegion, subregions, landmarks, sortId, owner } = region;
            const newMap = new Region({
                _id: objectId,
                name: name,
                capital: capital,
                leader: leader,
                flag: flag,
                parentRegion: parentRegion,
                subregions: subregions,
                landmarks: landmarks,
                sortId: sortId,
                owner: owner
            });
            const added = await newMap.save();
            if (parentRegion !== null){
                const parent = await Region.findOne({ _id: parentRegion});
                const subregions = parent.subregions;
                subregions.push(objectId);
                const updated = await Region.updateOne({ _id: parentRegion }, {subregions: subregions});
            }
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
            const region = await Region.findOne({_id: objectId});
            // delete ref in parent's subregions field
            if (region.parentRegion !== null){
                const parent = await Region.findOne({_id: region.parentRegion});
                let subregions = parent.subregions;
                subregions = subregions.filter(region => region._id.toString() !== _id);
                await Region.updateOne({_id: region.parentRegion }, { subregions: subregions});
            }

            let recursiveDel = async (objectId) => {
                const region = await Region.findOne({ _id: objectId});
                const subregions = region.subregions;
                if (!subregions){
                    const del = await Region.deleteOne({_id: objectId});
                    return del;
                } else {
                    const del = await Region.deleteOne({ _id: objectId});
                    subregions.forEach( element => {
                        recursiveDel(element);
                    });
                }
            };
            let deleted = recursiveDel(objectId);
            if (deleted) return true;
            else return false;
            
        },
        moveMapToTop: async ( _, args) => {
            const { _id } = args;
			const listId = new ObjectId(_id);
			await Region.updateMany({parentRegion: null}, {$inc: {sortId: 1}});
			await Region.updateOne( {_id: listId}, { sortId: 0 });
			
			const owner = (await Region.findOne({ _id: listId})).owner;
			
			const sorted = await Region.
				aggregate([{ $match: { owner: owner, parentRegion: null } }]).
				sort({ sortId: 1 })
			;

			await Region.deleteMany({ owner: owner, parentRegion: null});
			const replace = await Region.insertMany(sorted);
			return replace;
        }
    }
}