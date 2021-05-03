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
			}
			subregions {
				_id
				name
				capital
				leader
				flag
				parentRegion
				landmarks
			}
			landmarks
			sortId
			owner
		}
	}
`;