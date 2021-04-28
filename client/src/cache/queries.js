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
					name
					capital
					leader
					flag
					landmarks {
						_id
						name
					}
				}
				landmarks {
					_id
					name
				}
			}
			owner
		}
	}
`;
