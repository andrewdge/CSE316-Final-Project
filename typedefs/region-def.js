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
		_id: String!
		name: String!
		capital: String
		leader: String
		flag: String
		parentRegion: Region
		subregions: [Region]
		landmarks: [String]
		sortId: Int!
		owner: String!
	}

	input LandmarkInput {
		_id: String
		name: String
		owner: String
	}

	extend type Query {
		getAllMaps: [Region]
		getAllRegions: [Region]
		getRegionById(_id: String!): RegionResponse
		# getLandmarkById(_id: String!): Landmark
	}
	extend type Mutation {
		addRegion(region: RegionInput!, regionExists: Boolean!): String
		updateRegion(_id: String!, field: String!, value: String!): String
		sortRegionsByCriteria(_id: String!, isAscending: Boolean!, criteria: String!, doUndo: String!, subregions: [RegionInput]!): [Region]
		tempDeleteRegion(_id: String!): Region
		deleteRegion(_id: String!): Boolean
		moveMapToTop(_id: String!): [Region]
		# addLandmark(_id: String!, landmark: LandmarkInput!): String
		# updateLandmark(_id: String!, field: String!, value: String!): String
	}
`;

module.exports = { typeDefs: typeDefs }