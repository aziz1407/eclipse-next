import { gql } from '@apollo/client';

/**************************
 *         MEMBER         *
 *************************/

export const GET_ALL_MEMBERS_BY_ADMIN = gql`
	query GetAllMembersByAdmin($input: MembersInquiry!) {
		getAllMembersByAdmin(input: $input) {
			list {
				_id
				memberType
				memberStatus
				memberAuthType
				memberPhone
				memberEmail
				memberNick
				memberFullName
				memberImage
				memberAddress
				memberDesc
				memberProperties
				memberBlogs
				memberFollowers
				memberFollowings
				memberPoints
				memberLikes
				memberViews
				memberComments
				memberRank
				memberWarnings
				deletedAt
				createdAt
				updatedAt
				accessToken
			}
			metaCounter {
				total
			}
		}
	}
`;

/**************************
 *        PROPERTY        *
 *************************/

export const GET_ALL_PROPERTIES_BY_ADMIN = gql`
	query GetAllPropertiesByAdmin($input: AllPropertiesInquiry!) {
		getAllPropertiesByAdmin(input: $input) {
			list {
				_id
				propertyBrand
				propertyStatus
				propertyCountry
				propertyAddress
				propertyModel
				propertyCategory
				propertyMaterial
				propertyPrice
				propertyYear
				propertyMovement
				propertyLikes
				propertyRank
				propertyViews
				propertyCondition
				propertyImages
				propertyDesc
				memberId
				soldAt
				deletedAt
				constructedAt
				createdAt
				updatedAt
				memberData {
					_id
					memberType
					memberStatus
					memberAuthType
					memberPhone
					memberEmail
					memberNick
					memberFullName
					memberImage
					memberAddress
					memberDesc
					memberProperties
					memberBlogs
					memberFollowers
					memberFollowings
					memberPoints
					memberLikes
					memberViews
					memberComments
					memberRank
					memberWarnings
					deletedAt
					createdAt
					updatedAt
					accessToken
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

/**************************
 *      BOARD-ARTICLE     *
 *************************/

export const GET_ALL_BLOGS_BY_ADMIN = gql`
	query GetAllBlogsByAdmin($input: AllBlogsInquiry!) {
		getAllBlogsByAdmin(input: $input) {
			list {
				_id
				blogCategory
				blogStatus
				blogTitle
				blogContent
				blogImage
				blogViews
				blogLikes
				blogComments
				memberId
				createdAt
				updatedAt
				memberData {
					_id
					memberType
					memberStatus
					memberAuthType
					memberPhone
					memberEmail
					memberNick
					memberFullName
					memberImage
					memberAddress
					memberDesc
					memberProperties
					memberBlogs
					memberFollowers
					memberFollowings
					memberPoints
					memberLikes
					memberViews
					memberComments
					memberRank
					memberWarnings
					deletedAt
					createdAt
					updatedAt
					accessToken
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

/**************************
 *         COMMENT        *
 *************************/

export const GET_COMMENTS = gql`
	query GetComments($input: CommentsInquiry!) {
		getComments(input: $input) {
			list {
				_id
				commentStatus
				commentGroup
				commentContent
				commentRefId
				memberId
				createdAt
				updatedAt
				memberData {
					_id
					memberType
					memberStatus
					memberAuthType
					memberPhone
					memberEmail
					memberNick
					memberFullName
					memberImage
					memberAddress
					memberDesc
					memberProperties
					memberBlogs
					memberFollowers
					memberFollowings
					memberPoints
					memberLikes
					memberViews
					memberComments
					memberRank
					memberWarnings
					deletedAt
					createdAt
					updatedAt
					accessToken
				}
			}
			metaCounter {
				total
			}
		}
	}
`;
