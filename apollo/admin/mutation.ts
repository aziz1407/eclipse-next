import { gql } from '@apollo/client';

/**************************
 *         MEMBER         *
 *************************/

export const UPDATE_MEMBER_BY_ADMIN = gql`
	mutation UpdateMemberByAdmin($input: MemberUpdate!) {
		updateMemberByAdmin(input: $input) {
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

export const UPDATE_PROPERTY_BY_ADMIN = gql`
	mutation UpdatePropertyByAdmin($input: PropertyUpdate!) {
		updatePropertyByAdmin(input: $input) {
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
			propertyYear
			propertyMovement
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

export const REMOVE_PROPERTY_BY_ADMIN = gql`
	mutation RemovePropertyByAdmin($input: String!) {
		removePropertyByAdmin(propertyId: $input) {
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
			propertyYear
			propertyMovement
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

export const UPDATE_BLOG_BY_ADMIN = gql`
	mutation UpdateBlogByAdmin($input: BlogUpdate!) {
		updateBlogByAdmin(input: $input) {
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

export const REMOVE_BLOG_BY_ADMIN = gql`
	mutation RemoveBlogByAdmin($input: String!) {
		removeBlogByAdmin(blogId: $input) {
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

export const REMOVE_COMMENT_BY_ADMIN = gql`
	mutation RemoveCommentByAdmin($input: String!) {
		removeCommentByAdmin(commentId: $input) {
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
 *         NOTICE        *
 *************************/

export const CREATE_NOTICE_BY_ADMIN = gql`
	mutation CreateNotice($input: NoticeInput!) {
		createNotice(input: $input) {
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

export const UPDATE_NOTICE_BY_ADMIN = gql`
	mutation UpdateNotice($noticeId: String!, $input: NoticeUpdate!) {
		updateNotice(noticeId: $noticeId, input: $input) {
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

export const REMOVE_NOTICE_BY_ADMIN = gql`
	mutation RemoveNotice($input: String!) {
		removeNotice(noticeId: $input) {
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
