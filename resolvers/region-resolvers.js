const ObjectId = require('mongoose').Types.ObjectId;
const Region = require('../models/region-model');
const Landmark = require('../models/landmark-model');

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
			const regions = await Region.find({ owner: _id, parentRegion: {$ne: null} });
			if(regions) return (regions);
        },
        getRegionById: async ( _, args ) => {
            const { _id } = args;
            const objectId = new ObjectId(_id);
            let region = await (await Region.findOne({_id: objectId})).toJSON();
            region.subregions = await Promise.all(region.subregions.map( async (subregion) => {
                let sub = await (await Region.findOne({_id: subregion})).toJSON();
                sub.landmarks = await Promise.all(sub.landmarks.map( async (landmark) => {
                    return await Landmark.findOne({_id: landmark });
                }));
                sub.parentRegion = await Region.findOne({_id: sub.parentRegion });
                return sub;
            }));
            if (region.parentRegion !== null){
                region.parentRegion = await Region.findOne({_id: region.parentRegion });
            }
            region.landmarks = await Promise.all(region.landmarks.map( async (landmark) => {
                return await Landmark.findOne({_id: landmark });
            }));
            if (region) return region;
            return {};
        },
        getLineage: async ( _, args) => {
            const { _id } = args;
            const objectId = new ObjectId(_id);
            const region = await Region.findOne({ _id: objectId });
            let lineage = [];
            if (region) {
                const getParent = async (_id) => {
                    const objectId = new ObjectId(_id);
                    const parent = await Region.findOne({ _id: objectId });
                    if (parent) {
                        lineage.unshift(parent);
                        await getParent(parent.parentRegion);
                    }
                }

                await getParent(region.parentRegion);
                if (lineage) return lineage;
            } else {
                return ([]);
            }
        },
        getAllSubregions: async ( _, args ) => {
            const { _id, currId } = args;
            const currObjectId = new ObjectId(currId);
            let regions = [];
            const getChildRegions = async (_id, currObjectId) => {
                const objectId = new ObjectId(_id);
                const reg = await Region.findOne({ _id: objectId});
                if (reg) {
                    regions.push(reg);
                    await Promise.all(reg.subregions.map( async(sub) => {
                        if (sub.toString() !== currObjectId.toString()) {
                            await getChildRegions(sub, currObjectId);
                        }
                    }));
                }
            }
            await getChildRegions(_id, currObjectId);
            if (regions) return regions;
            return ([]);
        },
        getChildLandmarks: async ( _, args ) => {
            const { _id } = args;
            let landmarks = [];
            const objectId = new ObjectId(_id);
            const region = await Region.findOne({ _id: objectId });
            const getLandmarks = async (_id) => {
                const objectId = new ObjectId(_id);
                const region = await Region.findOne({ _id: objectId });
                if (region) {
                    const lm = await Landmark.find({ parentRegion: objectId});
                    landmarks = landmarks.concat(lm);
                    for (let i = 0; i < region.subregions.length; i++) {
                        await getLandmarks(region.subregions[i]);
                    }
                }
            };
            for (let i = 0; i < region.subregions.length; i++){
                await getLandmarks(region.subregions[i]);
            }
            if (landmarks) return landmarks;
            return ([]);
        },
        doesLandmarkExist: async ( _, args ) => {
            const { name } = args;
            const found = await Landmark.findOne({ name: name });
            if (found) return true;
            return false;
        },
    },
    Mutation: {
        addRegion: async ( _, args ) => {
            const { region , regionExists } = args;
            let objectId;
            if (regionExists) {
                objectId = new ObjectId(region._id);
            } else {
                objectId = new ObjectId();
            }
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
            else return '';
        },
        tempAddRegion: async ( _, args ) => {
            const { region } = args;
            const { _id, parentRegion } = region;
            let objectId = new ObjectId(_id);
            if (parentRegion !== null){
                const parent = await Region.findOne({ _id: parentRegion});
                const subregions = parent.subregions;
                subregions.push(objectId);
                const updated = await Region.updateOne({ _id: parentRegion }, {subregions: subregions});
            }
            const objectString = objectId.toString();
            return objectString;
        },
        updateRegion: async ( _, args ) => {
            const { _id, field, value } = args; 
            const objectId = new ObjectId(_id);
            if (field === 'parentRegion') {
                const region = await Region.findOne({ _id: objectId });
                const parent = await Region.findOne({ _id: region.parentRegion });
                let subregions = parent.subregions;
                subregions = subregions.filter( region => region.toString() !== _id);
                await Region.updateOne({_id: parent._id }, { subregions: subregions});

                const newParentObjectId = new ObjectId(value);
                const newParent = await Region.findOne({ _id: newParentObjectId });
                const parentSubregions = newParent.subregions;
                parentSubregions.push(objectId);
                await Region.updateOne({ _id: newParentObjectId }, {subregions: parentSubregions});
            }
            const updated = await Region.updateOne({ _id: objectId }, { [field]: value });
            if (updated) return value;
            else return "";
        },
        tempDeleteRegion: async ( _, args ) => {
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
            let deleted = await Region.findOne({ _id: objectId});
            console.log(deleted);
            if (deleted) return deleted;
            return null;
            
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
                if (region) {
                    const landmarks = region.landmarks;
                    landmarks.forEach( async(landmark) => {await Landmark.deleteOne({_id: landmark })});
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
                }
            };
            let deleted = recursiveDel(objectId);
            if (deleted) return region;
            else return null;
            
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
        },
        sortRegionsByCriteria: async  (_, args) => {
            const { _id, isAscending, criteria, doUndo, subregions } = args;
            const objectId = new ObjectId(_id);
			const region = await Region.findOne({ _id: objectId});
			
			if (doUndo === "do"){
				subregions.sort(function(a, b) {
					a = a[criteria];
					b = b[criteria];
					return isAscending ?    (a<b)  ?  -1:   (a>b)?1:0               :         (a>b)  ?  -1  :     (a<b)?1:0; 
				});
				const updated = await Region.updateOne({_id: objectId}, { subregions: subregions });
				if (updated) return (subregions);
				else return (region.subregions);
			} else {
				const updated = await Region.updateOne({_id: objectId }, { subregions: subregions });
				if (updated) return (subregions);
				else return (region.subregions);
			}
        },
        addLandmark: async (_, args) => {
            const { landmark, landmarkExists } = args;
            let objectId;
            if (landmarkExists){
                objectId = new ObjectId(landmark._id);
            } else {
                objectId = new ObjectId();
            }
            const { name, location, parentRegion, owner } = landmark;
            const newLandmark = new Landmark({
                _id: objectId,
                name: name,
                location: location,
                parentRegion: parentRegion,
                owner: owner
            });
            const added = await newLandmark.save();
            const parent = await Region.findOne({ _id: parentRegion});
            const landmarks = parent.landmarks;
            landmarks.push(objectId);
            const updated = await Region.updateOne({ _id: parentRegion }, { landmarks: landmarks });
            const objectString = objectId.toString();
            if (added){
                return objectString;
            }
            else return '';
        }, 
        deleteLandmark: async ( _, args ) => {
            const { _id } = args;
            const objectId = new ObjectId(_id);
            const landmark = await Landmark.findOne({_id: objectId});
            // delete ref in parent's subregions field
            const parent = await Region.findOne({_id: landmark.parentRegion});
            let landmarks = parent.landmarks;
            landmarks = landmarks.filter(landmark => landmark._id.toString() !== _id);
            await Region.updateOne({_id: landmark.parentRegion }, { landmarks: landmarks});
            let deleted = await Landmark.deleteOne({ _id: objectId });
            if (deleted) return landmark;
            else return null;
        },
        updateLandmark: async ( _, args ) => {
            const { _id, field, value } = args; 
            const objectId = new ObjectId(_id);
            const updated = await Landmark.updateOne({ _id: objectId }, { [field]: value });
            if (updated) return value;
            else return "";
        },
    }
}