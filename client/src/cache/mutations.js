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

export const UPDATE_REGION = gql`
	mutation UpdateRegion($_id: String!, $field: String!, $value: String!) {
		updateRegion(_id: $_id, field: $field, value: $value)
	}
`;

export const DELETE_REGION = gql`
	mutation DeleteRegion($_id: String!) {
		deleteRegion(_id: $_id)
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
