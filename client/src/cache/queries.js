import { gql } from "@apollo/client";

export const GET_DB_USER = gql`
	query GetDBUser {
		getCurrentUser {
			_id
			firstName
			lastName
			email
			password
		}
	}
`;

export const GET_DB_MAPS = gql`
	query GetDBMaps {
		getAllMaps {
			_id
			name
			subregions
			sortId
			owner
		}
	}
`;

export const GET_DB_REGIONS = gql`
	query GetDBRegions {
		getAllRegions {
			_id
			name
			capital
			leader
			flag
			parentRegion
			subregions
			landmarks
			sortId
			owner
		}
	}
`;

export const GET_LINEAGE = gql`
	query GetLineage($_id: String!) {
		getLineage(_id: $_id) {
			_id
			name
			capital
			leader
			flag
			parentRegion
			subregions
			landmarks
			sortId
			owner
		}
	}
`;

export const GET_ALL_SUBREGIONS = gql`
	query GetAllSubregions($_id: String!, $currId: String!){
		getAllSubregions(_id: $_id, currId: $currId) {
			_id
			name
		}
	}
`;

export const GET_CHILD_LANDMARKS = gql`
	query GetChildLandmarks($_id: String!) {
		getChildLandmarks(_id: $_id) {
			_id
			name
			location
			parentRegion
		}
	}
`;

export const GET_REGION_BY_ID = gql`
	query GetRegionById($_id: String!) {
		getRegionById(_id: $_id) {
			_id
			name
			capital
			leader
			flag
			parentRegion {
				_id
				name
				parentRegion
				subregions
				owner
			}
			subregions {
				_id
				name
				capital
				leader
				flag
				parentRegion {
					_id
					name
				}
				subregions {
					_id
				}
				landmarks {
					_id
					name 
					location
					parentRegion
				}
				sortId
				owner
			}
			landmarks {
				_id
				name 
				location
				parentRegion
				owner
			}
			owner
		}
	}
`;