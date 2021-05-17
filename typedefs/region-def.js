const { gql } = require('apollo-server');

const typeDefs = gql `
	type Region {
		_id: String!
		name: String!
		capital: String
		leader: String
		flag: String
		parentRegion: String
		subregions: [String]
		landmarks: [String]
		sortId: Int!
		owner: String!
	}
	type Landmark {
		_id: String!
		name: String!
		location: String!
		parentRegion: String!
		owner: String!
	}

	input RegionInput {
		_id: String
		name: String
		capital: String
		leader: String
		flag: String
		parentRegion: String
		subregions: [String]
		landmarks: [String]
		sortId: Int
		owner: String
	}

	type RegionResponse {
		_id: String
		name: String
		capital: String
		leader: String
		flag: String
		parentRegion: Region
		subregions: [RegionResponse]
		landmarks: [Landmark]
		sortId: Int
		owner: String
	}

	input LandmarkInput {
		_id: String
		name: String
		location: String
		parentRegion: String
		owner: String
	}

	extend type Query {
		getAllMaps: [Region]
		getAllRegions: [Region]
		getRegionById(_id: String!): RegionResponse
		getLineage(_id: String!): [Region]
		getAllSubregions(_id: String!, currId: String!): [Region]
		getChildLandmarks(_id: String!): [Landmark]
		doesLandmarkExist(name: String!): Boolean
	}
	extend type Mutation {
		addRegion(region: RegionInput!, regionExists: Boolean!): String
		updateRegion(_id: String!, field: String!, value: String!): String
		sortRegionsByCriteria(_id: String!, isAscending: Boolean!, criteria: String!, doUndo: String!, subregions: [RegionInput]!): [Region]
		tempDeleteRegion(_id: String!): Region
		deleteRegion(_id: String!): Boolean
		moveMapToTop(_id: String!): [Region]
		addLandmark(landmark: LandmarkInput!, landmarkExists: Boolean!): String
		updateLandmark(_id: String!, field: String!, value: String!): String
		deleteLandmark(_id: String!): Landmark
	}
`;

module.exports = { typeDefs: typeDefs }