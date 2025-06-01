import { gql } from '@apollo/client';

/**************************
 *         MEMBER         *
 *************************/

export const GET_AGENTS = gql`
	query GetAgents($input: DealersInquiry!) {
		getDealers(input: $input) {
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
				memberBlogs
				memberDesc
				memberProperties
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
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
				meFollowed {
					followingId
					followerId
					myFollowing
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_MEMBER = gql(`
query GetMember($input: String!) {
    getMember(memberId: $input) {
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
        meFollowed {
            followingId
            followerId
            myFollowing
        }
    }
}

`);

/**************************
 *        PROPERTY        *
 *************************/

export const GET_PROPERTY = gql`
	query GetProperty($input: String!) {
		getProperty(propertyId: $input) {
			_id
			propertyBrand
			propertyStatus
			propertyCountry
			propertyAddress
			propertyModel
			propertyCondition
			propertyCategory
			propertyMaterial
			propertyMovement
			propertyPrice
			propertyYear
			propertyLikes
			propertyViews
			propertyImages
			propertyDesc
			propertyRank
			memberId
			soldAt
			deletedAt
			constructedAt
			createdAt
			updatedAt
			meLiked {
				memberId
				likeRefId
				myFavorite
			}
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
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
			}
		}
	}
`;

export const GET_PROPERTIES = gql`
	query GetProperties($input: PropertiesInquiry!) {
		getProperties(input: $input) {
			list {
				_id
				propertyBrand
				propertyStatus
				propertyCountry
				propertyAddress
				propertyModel
				propertyCategory
				propertyCondition
				propertyMaterial
				propertyMovement
				propertyPrice
				propertyYear
				propertyViews
				propertyImages
				propertyRank
				propertyDesc
				memberId
				soldAt
				deletedAt
				constructedAt
				createdAt
				updatedAt
				propertyLikes
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
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_AGENT_PROPERTIES = gql`
	query GetAgentProperties($input: AgentPropertiesInquiry!) {
		getAgentProperties(input: $input) {
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
				propertyViews
				propertyCondition
				propertyLikes
				propertyMovement
				propertyImages
				propertyDesc
				propertyRank
				memberId
				soldAt
				deletedAt
				constructedAt
				createdAt
				updatedAt
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_FAVORITES = gql`
	query GetFavorites($input: OrdinaryInquiry!) {
		getFavorites(input: $input) {
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
				propertyCondition
				propertyMovement
				propertyViews
				propertyLikes
				propertyImages
				propertyDesc
				propertyRank
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

export const GET_VISITED = gql`
	query GetVisited($input: OrdinaryInquiry!) {
		getVisited(input: $input) {
			list {
				_id
				propertyBrand
				propertyStatus
				propertyCountry
				propertyAddress
				propertyModel
				propertyCategory
				propertyMaterial
				propertyYear
				propertyMovement
				propertyLikes
				propertyPrice
				propertyViews
				propertyCondition
				propertyImages
				propertyDesc
				propertyRank
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

export const GET_BLOG = gql`
	query GetBlog($input: String!) {
		getBlog(blogId: $input) {
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
			meLiked {
				memberId
				likeRefId
				myFavorite
			}
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
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
			}
		}
	}
`;

export const GET_BLOGS = gql`
	query GetBlogs($input: BlogsInquiry!) {
		getBlogs(input: $input) {
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

/**************************
 *         FOLLOW        *
 *************************/
export const GET_MEMBER_FOLLOWERS = gql`
	query GetMemberFollowers($input: FollowInquiry!) {
		getMemberFollowers(input: $input) {
			list {
				_id
				followingId
				followerId
				createdAt
				updatedAt
				meFollowed {
					followingId
					followerId
					myFollowing
				}
				followerData {
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

export const GET_MEMBER_FOLLOWINGS = gql`
	query GetMemberFollowings($input: FollowInquiry!) {
		getMemberFollowings(input: $input) {
			list {
				_id
				followingId
				followerId
				createdAt
				updatedAt
				followingData {
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
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
				meFollowed {
					followingId
					followerId
					myFollowing
				}
			}
			metaCounter {
				total
			}
		}
	}
`;


/**************************
 *         NOTICE        *
 *************************/

export const GET_ALL_NOTICES = gql`
	query GetAllNotices($input: AllNoticesInquiry!) {
		getAllNotices(input: $input) {
			list {
				_id
				noticeCategory
				noticeStatus
				noticeTitle
				noticeContent
				memberId
				createdAt
				updatedAt
			}
			metaCounter {
				_id
				count
			}
		}
	}
`;

export const GET_NOTICE = gql`
	query GetNotice($noticeId: String!) {
		getNotice(noticeId: $noticeId) {
			_id
			noticeCategory
			noticeStatus
			noticeTitle
			noticeContent
			memberId
			createdAt
			updatedAt
		}
	}
`;

