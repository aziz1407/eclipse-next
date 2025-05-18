import React from 'react';
import { useRouter } from 'next/router';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Stack, Typography, Box, Grid } from '@mui/material';
import { Blog } from '../../types/blog/blog';
import Moment from 'react-moment';
import { REACT_APP_API_URL } from '../../config';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import IconButton from '@mui/material/IconButton';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';

interface CommunityCardProps {
	blog: Blog;
	size?: string;
	likeArticleHandler: any;
}

const CommunityCard = (props: CommunityCardProps) => {
	const { blog, size = 'normal', likeArticleHandler } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const imagePath: string = blog?.blogImage
		? `${REACT_APP_API_URL}/${blog?.blogImage}`
		: '/img/community/communityImg.png';

	/** HANDLERS **/
	const chooseArticleHandler = (e: React.SyntheticEvent, blog: Blog) => {
		router.push(
			{
				pathname: '/community/detail',
				query: { blogCategory: blog?.blogCategory, id: blog?._id },
			},
			undefined,
			{ shallow: true },
		);
	};

	const goMemberPage = (id: string) => {
		if (id === user?._id) router.push('/mypage');
		else router.push(`/member?memberId=${id}`);
	};

	if (device === 'mobile') {
		return <div>COMMUNITY CARD MOBILE</div>;
	} else {
		return (
			<div className="community-general-card-config">
				<Grid container>
					{/* Left side - Image */}
					<Grid item xs={5} className="image-side">
						<div className="image-container" onClick={(e: any) => chooseArticleHandler(e, blog)}>
							<img src={imagePath} alt="" className="card-img" />
						</div>
					</Grid>

					{/* Right side - Content */}
					<Grid item xs={7} className="content-side">
						<div className="content-container">
							<div className="post-date">
								<Moment format="MMM DD, YYYY">{blog?.createdAt}</Moment> | {blog?.blogComments}{' '}
								{blog?.blogComments >= 1 ? 'COMMENT' : 'COMMENTS'}
							</div>

							<Typography className="title" onClick={(e: any) => chooseArticleHandler(e, blog)}>
								{blog?.blogTitle}
							</Typography>

							<Typography className="excerpt">
								{blog?.blogContent.substring(0, 100)}
								{blog?.blogContent?.length > 100 ? '...' : ''}
							</Typography>

							<div className="read-more" onClick={(e: any) => chooseArticleHandler(e, blog)}>
								READ MORE
							</div>

							<div className="author-stats">
								<Typography
									className="author-name"
									onClick={(e: any) => {
										e.stopPropagation();
										goMemberPage(blog?.memberData?._id as string);
									}}
								>
									{blog?.memberData?.memberNick}
								</Typography>

								<div className="stats">
									<div className="stat-item">
										<IconButton size="small">
											<RemoveRedEyeIcon fontSize="small" sx={{ color: 'grey' }} />
										</IconButton>
										<span>{blog?.blogViews}</span>
									</div>

									<div className="stat-item">
										<IconButton
											size="small"
											onClick={(e: any) => {
												likeArticleHandler(e, user, blog?._id);
											}}
										>
											{blog?.meLiked && blog?.meLiked[0]?.myFavorite ? (
												<ThumbUpIcon sx={{ color: '#eb6753' }} />
											) : (
												<ThumbUpOffAltIcon sx={{ color: 'grey' }} />
											)}
										</IconButton>
										<span>{blog?.blogLikes}</span>
									</div>
								</div>
							</div>
						</div>
					</Grid>
				</Grid>
			</div>
		);
	}
};

export default CommunityCard;
