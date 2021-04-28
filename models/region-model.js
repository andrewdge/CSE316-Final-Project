const { model, Schema, ObjectId } = require('mongoose');
const Landmark = require('./landmark-model').schema;

const regionSchema = new Schema(
	{
		_id: {
			type: ObjectId,
			required: true
		},
        name: {
            type: String,
            required: true
        },
        capital: {
            type: String,
            required: false
        },
        leader: {
            type: String,
            required: false
        },
        flag: {
            type: String,
            required: false
        },
        parentRegion: {
            type: this,
            required: false
        },
        subregions: [this],
        landmarks: [Landmark],
        owner: {
            type: String,
            required: true
        }
    },
	{ timestamps: true }
);

const Region = model('Region', regionSchema);
module.exports = Region;