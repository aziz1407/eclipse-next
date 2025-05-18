import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { Button, Stack, Typography, Backdrop, Pagination } from '@mui/material';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import Moment from 'react-moment';
import { userVar } from '../../apollo/store';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ChatIcon from '@mui/icons-material/Chat';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import { CommentInput, CommentsInquiry } from '../../libs/types/comment/comment.input';
import { Comment } from '../../libs/types/comment/comment';
import dynamic from 'next/dynamic';
import { CommentGroup, CommentStatus } from '../../libs/enums/comment.enum';
import { T } from '../../libs/types/common';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Blog } from '../../libs/types/blog/blog';
import { CREATE_COMMENT, LIKE_TARGET_BLOG, UPDATE_COMMENT } from '../../apollo/user/mutation';
import { GET_BLOG, GET_COMMENTS } from '../../apollo/user/query';
import { Messages } from '../../libs/config';
import {
	sweetConfirmAlert,
	sweetMixinErrorAlert,
	sweetMixinSuccessAlert,
	sweetTopSmallSuccessAlert,
} from '../../libs/sweetAlert';
import { CommentUpdate } from '../../libs/types/comment/comment.update';
const ToastViewerComponent = dynamic(() => import('../../libs/components/community/TViewer'), { ssr: false });

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const WatchDetail: NextPage = ({ initialInput, ...props }: T) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const { query } = router;

	const blogId = query?.id as string;
	const blogCategory = query?.blogCategory as string;

	const [comment, setComment] = useState<string>('');
	const [wordsCnt, setWordsCnt] = useState<number>(0);
	const [updatedCommentWordsCnt, setUpdatedCommentWordsCnt] = useState<number>(0);
	const user = useReactiveVar(userVar);
	const [comments, setComments] = useState<Comment[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [searchFilter, setSearchFilter] = useState<CommentsInquiry>({
		...initialInput,
	});
	const [authorImage, setAuthorImage] = useState<string>();
	const [openBackdrop, setOpenBackdrop] = useState<boolean>(false);
	const [updatedComment, setUpdatedComment] = useState<string>('');
	const [updatedCommentId, setUpdatedCommentId] = useState<string>('');
	const [likeLoading, setLikeLoading] = useState<boolean>(false);
	const [blog, setBlog] = useState<Blog>();
	const [relatedPosts, setRelatedPosts] = useState<Blog[]>([]);

	/** APOLLO REQUESTS **/
	const [likeTargetBoardArticle] = useMutation(LIKE_TARGET_BLOG);
	const [createComment] = useMutation(CREATE_COMMENT);
	const [updateComment] = useMutation(UPDATE_COMMENT);

	const {
		loading: boardArticleLoading,
		data: boardArticleData,
		error: boardArticleError,
		refetch: boardArticleRefetch,
	} = useQuery(GET_BLOG, {
		fetchPolicy: 'network-only',
		variables: {
			input: blogId,
		},
		notifyOnNetworkStatusChange: true,
		onCompleted(data: any) {
			setBlog(data?.getBlog);
			if (data?.getBlog.memberData.memberImage) {
				setAuthorImage(`${process.env.REACT_APP_API_URL}/${data?.getBlog?.memberData?.memberImage}`);
			}

			// Sample related posts - in real app you'd fetch these based on blog category or tags
			setRelatedPosts;
		},
	});

	const {
		loading: getCommentsLoading,
		data: getCommentsData,
		error: getCommentsError,
		refetch: getCommentsRefetch,
	} = useQuery(GET_COMMENTS, {
		fetchPolicy: 'cache-and-network',
		variables: {
			input: searchFilter,
		},
		notifyOnNetworkStatusChange: true,
		onCompleted(data: any) {
			setComments(data.getComments.list);
			setTotal(data.getComments?.metaCounter[0]?.total || 0);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		if (blogId) setSearchFilter({ ...searchFilter, search: { commentRefId: blogId } });
	}, [blogId]);

	/** HANDLERS **/
	const categoryChangeHandler = (category: string) => {
		router.replace(
			{
				pathname: '/community',
				query: { blogCategory: category },
			},
			'/',
			{ shallow: true },
		);
	};

	const likeArticleHandler = async (user: any, id: string) => {
		try {
			if (likeLoading) return;
			if (!id) return;
			if (!user._id) throw new Error(Messages.error2);

			setLikeLoading(true);

			await likeTargetBoardArticle({
				variables: {
					input: id,
				},
			});
			await boardArticleRefetch({ input: blogId });
			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			console.log('ERROR, likeArticleHandler:', err.message);
			sweetMixinErrorAlert(err.message).then();
		} finally {
			setLikeLoading(false);
		}
	};

	const createCommentHandler = async () => {
		if (!comment) return;
		try {
			if (!user?._id) throw new Error(Messages.error2);
			const commentInput: CommentInput = {
				commentGroup: CommentGroup.BLOG,
				commentRefId: blogId,
				commentContent: comment,
			};
			await createComment({
				variables: {
					input: commentInput,
				},
			});
			await getCommentsRefetch({ input: searchFilter });
			await boardArticleRefetch({ input: blogId });
			setComment('');
			await sweetMixinSuccessAlert('Comment added successfully!');
		} catch (error: any) {
			await sweetMixinErrorAlert(error.message);
		}
	};

	const updateCommentHandler = async (commentId: string, commentStatus?: CommentStatus.DELETE) => {
		try {
			if (!user?._id) throw new Error(Messages.error2);
			if (!commentId) throw new Error('Select a comment to update!');
			if (updatedComment === comments?.find((comment) => comment?._id === commentId)?.commentContent) return;

			const updateData: CommentUpdate = {
				_id: commentId,
				...(commentStatus && { commentStatus: commentStatus }),
				...(updatedComment && { commentContent: updatedComment }),
			};

			if (!updateData?.commentContent && !updateData?.commentStatus)
				throw new Error('Provide data to update your comment!');

			if (commentStatus) {
				if (await sweetConfirmAlert('Do you want to delete this comment?')) {
					await updateComment({
						variables: {
							input: updateData,
						},
					});
					await sweetMixinSuccessAlert('Comment deleted successfully!');
					return;
				}
			} else {
				await updateComment({
					variables: {
						input: updateData,
					},
				});
				await sweetMixinSuccessAlert('Comment updated successfully!');
			}

			await getCommentsRefetch({ input: searchFilter });
		} catch (error: any) {
			await sweetMixinErrorAlert(error.message);
		} finally {
			setOpenBackdrop(false);
			setUpdatedCommentWordsCnt(0);
			setUpdatedComment('');
			setUpdatedCommentId('');
		}
	};

	const getCommentAuthorImage = (imageUrl: string | undefined) => {
		if (imageUrl) return `${process.env.REACT_APP_API_URL}/${imageUrl}`;
		else return '/img/watches/default-avatar.png';
	};

	const goToAuthorPage = (id: any) => {
		if (id === user?._id) router.push('/mypage');
		else router.push(`/author?id=${id}`);
	};

	const cancelButtonHandler = () => {
		setOpenBackdrop(false);
		setUpdatedComment('');
		setUpdatedCommentWordsCnt(0);
	};

	const updateCommentInputHandler = (value: string) => {
		if (value.length > 100) return;
		setUpdatedCommentWordsCnt(value.length);
		setUpdatedComment(value);
	};

	const paginationHandler = (e: T, value: number) => {
		setSearchFilter({ ...searchFilter, page: value });
	};

	const goToArticle = (id: string) => {
		router.push({
			pathname: '/watch-detail',
			query: { id, blogCategory },
		});
	};

	if (device === 'mobile') {
		return <div>WATCH DETAIL PAGE MOBILE</div>;
	} else {
		return (
			<div id="watch-detail-page">
				<div className="container">
					<Stack className="main-box">
						<Stack className="left-config">
							<Stack className={'image-info'}>
								<Stack className={'blog-name'}>
									<Typography className={'name'}>WATCH BLOG</Typography>
								</Stack>
							</Stack>
							<div className="categories-container">
								<Typography className="categories-title">CATEGORIES</Typography>
								<div className="categories-list">
									<div
										className={`category-item ${blogCategory === 'GENERAL' ? 'active' : ''}`}
										onClick={() => categoryChangeHandler('GENERAL')}
									>
										<Typography>General</Typography>
									</div>
									<div
										className={`category-item ${blogCategory === 'LIFESTYLE' ? 'active' : ''}`}
										onClick={() => categoryChangeHandler('LIFESTYLE')}
									>
										<Typography>Lifestyle</Typography>
									</div>
									<div
										className={`category-item ${blogCategory === 'INSTRUCTIVE' ? 'active' : ''}`}
										onClick={() => categoryChangeHandler('INSTRUCTIVE')}
									>
										<Typography>Instructive</Typography>
									</div>
								</div>
							</div>
						</Stack>
						<div className="watch-detail-config">
							<Stack className="title-box">
								<Stack className="left">
									<Typography className="title">{blogCategory || 'WATCH'} BLOG</Typography>
									<Typography className="sub-title">Discover the latest in horology and timepiece elegance</Typography>
								</Stack>
								<Button
									onClick={() =>
										router.push({
											pathname: '/write',
										})
									}
									className="right"
								>
									Write
								</Button>
							</Stack>
							<div className="config">
								<Stack className="first-box-config">
									<Stack className="content-and-info">
										<Stack className="content">
											<Stack className="author-info">
												<img
													src={authorImage}
													alt=""
													className="author-img"
													onClick={() => goToAuthorPage(blog?.memberData?._id)}
													style={{ marginRight: '50px' }}
												/>
												<Typography
													className="author-nick"
													onClick={() => goToAuthorPage(blog?.memberData?._id)}
													sx={{ marginRight: '55px' }}
												>
													{blog?.memberData?.memberNick || 'Writer'}
												</Typography>
												<Moment className={'time-added'} format={'DD.MM.YY HH:mm'}>
													{blog?.createdAt || new Date().toISOString()}
												</Moment>
											</Stack>
										</Stack>
										<Stack className="info">
											<Stack className="icon-info">
												{blog?.meLiked && blog?.meLiked[0]?.myFavorite ? (
													<ThumbUpAltIcon onClick={() => likeArticleHandler(user, blog?._id)} />
												) : (
													<ThumbUpOffAltIcon onClick={() => likeArticleHandler(user, blog?._id || '1')} />
												)}
												<Typography className="text">{blog?.blogLikes || 0}</Typography>
											</Stack>
											<Stack className="icon-info">
												<VisibilityIcon />
												<Typography className="text">{blog?.blogViews || 0}</Typography>
											</Stack>
											<Stack className="icon-info">
												{total > 0 ? <ChatIcon /> : <ChatBubbleOutlineRoundedIcon />}
												<Typography className="text">{blog?.blogComments || 0}</Typography>
											</Stack>
										</Stack>
									</Stack>

									<Stack>
										<Typography className="content-data">{blog?.blogTitle}</Typography>
										<ToastViewerComponent markdown={blog?.blogContent} className={'watch-content'} />
									</Stack>
								</Stack>

								<Stack
									className="second-box-config"
									sx={{ borderBottom: total > 0 ? 'none' : '1px solid #2d2d2d', border: '1px solid #2d2d2d' }}
								>
									<Typography className="title-text">Comments ({total})</Typography>
									<Stack className="leave-comment">
										<input
											type="text"
											placeholder="Leave a comment"
											value={comment}
											onChange={(e) => {
												if (e.target.value.length > 100) return;
												setWordsCnt(e.target.value.length);
												setComment(e.target.value);
											}}
										/>
										<Stack className="button-box">
											<Button onClick={createCommentHandler}>comment</Button>
										</Stack>
									</Stack>
								</Stack>

								{total > 0 && (
									<Stack className="comments">
										<Typography className="comments-title">Comments</Typography>
									</Stack>
								)}

								{comments?.map((commentData, index) => {
									return (
										<Stack className="comments-box" key={commentData?._id}>
											<Stack className="main-comment">
												<Stack className="author-info">
													<Stack
														className="name-date"
														onClick={() => goToAuthorPage(commentData?.memberData?._id as string)}
													>
														<img
															src={getCommentAuthorImage(commentData?.memberData?.memberImage)}
															alt=""
															style={{ marginRight: '100px' }}
														/>
														<Stack className="name-date-column">
															<Typography className="name">{commentData?.memberData?.memberNick}</Typography>
															<Typography className="date">
																<Moment className={'time-added'} format={'DD.MM.YY HH:mm'}>
																	{commentData?.createdAt}
																</Moment>
															</Typography>
														</Stack>
													</Stack>
												</Stack>
												<Stack className="content">
													<Typography>{commentData?.commentContent}</Typography>
												</Stack>
											</Stack>
										</Stack>
									);
								})}

								{total > 0 && (
									<Stack className="pagination-box">
										<Pagination
											count={Math.ceil(total / searchFilter.limit) || 1}
											page={searchFilter.page}
											shape="circular"
											onChange={paginationHandler}
										/>
									</Stack>
								)}
							</div>
						</div>
					</Stack>
				</div>
			</div>
		);
	}
};

WatchDetail.defaultProps = {
	initialInput: {
		page: 1,
		limit: 5,
		sort: 'createdAt',
		direction: 'DESC',
		search: { commentRefId: '' },
	},
};

export default withLayoutBasic(WatchDetail);
