import { gql } from '@apollo/client';

/**************************
 *         MEMBER         *
 *************************/

export const SIGN_UP = gql`
	mutation Signup($input: MemberInput!) {
		signup(input: $input) {
			_id
			memberType
			memberStatus
			memberAuthType
			memberPhone
			memberNick
			memberFullName
			memberImage
			memberAddress
			memberDesc
			memberWarnings
			memberProperties
			memberRank
			memberBlogs
			memberPoints
			memberLikes
			memberViews
			deletedAt
			createdAt
			updatedAt
			accessToken
		}
	}
`;

export const LOGIN = gql`
	mutation Login($input: LoginInput!) {
		login(input: $input) {
			_id
			memberType
			memberStatus
			memberAuthType
			memberPhone
			memberNick
			memberFullName
			memberImage
			memberAddress
			memberDesc
			memberWarnings
			memberProperties
			memberRank
			memberBlogs
			memberPoints
			memberLikes
			memberViews
			deletedAt
			createdAt
			updatedAt
			accessToken
		}
	}
`;

export const UPDATE_MEMBER = gql`
	mutation UpdateMember($input: MemberUpdate!) {
		updateMember(input: $input) {
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
`;

export const LIKE_TARGET_MEMBER = gql`
	mutation LikeTargetMember($input: String!) {
		likeTargetMember(memberId: $input) {
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
`;

/**************************
 *        PROPERTY        *
 *************************/

export const CREATE_PROPERTY = gql`
	mutation CreateProperty($input: PropertyInput!) {
		createProperty(input: $input) {
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
			propertyViews
			propertyCondition
			propertyMovement
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
		}
	}
`;

export const UPDATE_PROPERTY = gql`
	mutation UpdateProperty($input: PropertyUpdate!) {
		updateProperty(input: $input) {
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
			propertyMovement
			propertyRank
			propertyYear
			propertyLikes
			propertyImages
			propertyDesc
			memberId
			soldAt
			deletedAt
			constructedAt
			createdAt
			updatedAt
		}
	}
`;

export const LIKE_TARGET_PROPERTY = gql`
	mutation LikeTargetProperty($input: String!) {
		likeTargetProperty(propertyId: $input) {
			_id
			propertyBrand
			propertyStatus
			propertyCountry
			propertyAddress
			propertyModel
			propertyCondition
			propertyCategory
			propertyMaterial
			propertyPrice
			propertyViews
			propertyLikes
			propertyRank
			propertyImages
			propertyDesc
			memberId
			soldAt
			deletedAt
			constructedAt
			createdAt
			updatedAt
		}
	}
`;

/**************************
 *      BOARD-ARTICLE     *
 *************************/

export const CREATE_BLOG = gql`
	mutation CreateBlog($input: BlogInput!) {
    createBlog(input: $input) {
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
    }
}
`;

export const UPDATE_BOARD_ARTICLE = gql`
	mutation UpdateBoardArticle($input: BoardArticleUpdate!) {
		updateBoardArticle(input: $input) {
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
		}
	}
`;

export const LIKE_TARGET_BLOG = gql`
mutation LikeTargetBlog($input: String!) {
    likeTargetBlog(blogId: $input) {
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
    }
}

`;

/**************************
 *         COMMENT        *
 *************************/

export const CREATE_COMMENT = gql`
	mutation CreateComment($input: CommentInput!) {
		createComment(input: $input) {
			_id
			commentStatus
			commentGroup
			commentContent
			commentRefId
			memberId
			createdAt
			updatedAt
		}
	}
`;

export const UPDATE_COMMENT = gql`
	mutation UpdateComment($input: CommentUpdate!) {
		updateComment(input: $input) {
			_id
			commentStatus
			commentGroup
			commentContent
			commentRefId
			memberId
			createdAt
			updatedAt
		}
	}
`;

/**************************
 *         FOLLOW        *
 *************************/

export const SUBSCRIBE = gql`
	mutation Subscribe($input: String!) {
		subscribe(input: $input) {
			_id
			followingId
			followerId
			createdAt
			updatedAt
		}
	}
`;

export const UNSUBSCRIBE = gql`
	mutation Unsubscribe($input: String!) {
		unsubscribe(input: $input) {
			_id
			followingId
			followerId
			createdAt
			updatedAt
		}
	}
`;
