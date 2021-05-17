import { gql } from "@apollo/client";

export const LOGIN = gql`
	mutation Login($email: String!, $password: String!) {
		login(email: $email, password: $password) {
			_id
			email 
			password
			firstName
			lastName
		}
	}
`;

export const REGISTER = gql`
	mutation Register($email: String!, $password: String!, $firstName: String!, $lastName: String!) {
		register(email: $email, password: $password, firstName: $firstName, lastName: $lastName) {
			email
			password
			firstName
			lastName
		}
	}
`;

export const UPDATE = gql`
	mutation Update($email: String!, $password: String!, $firstName: String!, $lastName: String!){
		update(email: $email, password: $password, firstName: $firstName, lastName: $lastName) {
			email
			password
			firstName
			lastName
		}
	}
`;

export const LOGOUT = gql`
	mutation Logout {
		logout 
	}
`;

export const ADD_REGION = gql`
	mutation AddRegion($region: RegionInput!, $regionExists: Boolean!) {
		addRegion(region: $region, regionExists: $regionExists)
	}
`;

export const TEMP_ADD_REGION = gql`
	mutation TempAddRegion($region: RegionInput!) {
		tempAddRegion(region: $region)
	}
`;

export const UPDATE_REGION = gql`
	mutation UpdateRegion($_id: String!, $field: String!, $value: String!) {
		updateRegion(_id: $_id, field: $field, value: $value)
	}
`;

export const SORT_REGIONS_BY_CRITERIA = gql`
	mutation SortRegionsByCriteria($_id: String!, $isAscending: Boolean!, $criteria: String!, $doUndo: String!, $subregions: [RegionInput]!) {
		sortRegionsByCriteria(_id: $_id, isAscending: $isAscending, criteria: $criteria, doUndo: $doUndo, subregions: $subregions) {
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


export const DELETE_REGION = gql`
	mutation DeleteRegion($_id: String!) {
		deleteRegion(_id: $_id) {
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

export const TEMP_DELETE_REGION = gql`
	mutation TempDeleteRegion($_id: String!) {
		tempDeleteRegion(_id: $_id) {
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

export const MOVE_MAP_TO_TOP = gql`
	mutation MoveMapToTop($_id: String!) {
		moveMapToTop(_id: $_id) {
			_id
			name
			subregions
			sortId
			owner
		}
	}
`;

export const ADD_LANDMARK = gql`
	mutation AddLandmark($landmark: LandmarkInput!, $landmarkExists: Boolean!) {
		addLandmark(landmark: $landmark, landmarkExists: $landmarkExists)
	}
`;

export const UPDATE_LANDMARK = gql`
	mutation UpdateLandmark($_id: String!, $field: String!, $value: String!) {
		updateLandmark(_id: $_id, field: $field, value: $value)
	}
`;

export const DELETE_LANDMARK = gql`
	mutation DeleteLandmark($_id: String!) {
		deleteLandmark(_id: $_id) {
			_id
			name
			location
			parentRegion
			owner
		}
	}
`;
