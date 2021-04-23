const { model, Schema, ObjectId } = require('mongoose');

const landmarkSchema = new Schema(
	{
		_id: {
			type: ObjectId,
			required: true
		},
        name: {
            type: String,
            required: true
        },
        location: {
            type: String,
            required: true
        }
	},
	{ timestamps: true }
);

const Landmark = model('Landmark', landmarkSchema);
module.exports = Landmark;