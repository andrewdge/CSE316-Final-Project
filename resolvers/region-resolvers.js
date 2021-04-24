const ObjectId = require('mongoose').Types.ObjectId;
const Region = require('../models/region-model');

module.exports = {
    // Query: {
    //     getAllMaps: async (_, __, { req }) => {
    //         const _id = new ObjectId(req.userId);
	// 		if(!_id) { return([])};
	// 		const maps = await Region.find({owner: _id});
	// 		if(maps) return (maps);
    //     }
    // },
    // Mutation: {

    // }
}