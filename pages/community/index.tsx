import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Stack, Tab, Typography, Button, Pagination, Link, IconButton, PaginationItem } from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { Blog } from '../../libs/types/blog/blog';
import { T } from '../../libs/types/common';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { BlogsInquiry } from '../../libs/types/blog/blog.input';
import { BlogCategory } from '../../libs/enums/blog.enum';
import { GET_BLOGS } from '../../apollo/user/query';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { LIKE_TARGET_BLOG } from '../../apollo/user/mutation';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import { Messages, REACT_APP_API_URL } from '../../libs/config';
import Moment from 'react-moment';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { userVar } from '../../apollo/store';
import CommunityCard from '../../libs/components/common/CommunityCard';

const Community: NextPage = ({ initialInput, ...props }: T) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const { query } = router;
	const user = useReactiveVar(userVar);
	const blogCategory = query?.blogCategory as string;
	const [searchCommunity, setSearchCommunity] = useState<BlogsInquiry>(initialInput);
	const [blogs, setBlogs] = useState<Blog[]>([]);
	const [totalCount, setTotalCount] = useState<number>(0);
	if (blogCategory) initialInput.search.blogCategory = blogCategory;

	/** APOLLO REQUESTS **/

	const [likeTargetBoardArticle] = useMutation(LIKE_TARGET_BLOG);

	const {
		loading: boardArticlesLoading,
		data: boardArticlesData,
		error: boardArticlesError,
		refetch: getBlogsRefetch,
	} = useQuery(GET_BLOGS, {
		fetchPolicy: 'cache-and-network',
		variables: { input: searchCommunity },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setBlogs(data?.getBlogs?.list);
			setTotalCount(data?.getBlogs?.metaCounter[0]?.total);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		if (!query?.blogCategory)
			router.push(
				{
					pathname: router.pathname,
					query: { blogCategory: 'GENERAL' },
				},
				router.pathname,
				{ shallow: true },
			);
	}, []);

	/** HANDLERS **/
	const tabChangeHandler = async (e: T, value: string) => {
		console.log(value);

		setSearchCommunity({ ...searchCommunity, page: 1, search: { blogCategory: value as BlogCategory } });
		await router.push(
			{
				pathname: '/community',
				query: { blogCategory: value },
			},
			router.pathname,
			{ shallow: true },
		);
	};

	const paginationHandler = (e: T, value: number) => {
		setSearchCommunity({ ...searchCommunity, page: value });
	};

	const likeArticleHandler = async (e: any, user: any, id: string) => {
		try {
			e.stopPropagation();
			if (!id) return;
			if (!user._id) throw new Error(Messages.error2);

			await likeTargetBoardArticle({
				variables: {
					input: id,
				},
			});

			await getBlogsRefetch({ input: searchCommunity });
			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			console.log('Error, likePropertyHandler', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	if (device === 'mobile') {
		return <h1>COMMUNITY PAGE MOBILE</h1>;
	} else {
		return (
			<div id="community-list-page">
				<div className="container">
					<TabContext value={searchCommunity.search.blogCategory}>
						<Stack className="main-box">
							<Stack className="left-config">
								<Stack className="title-section">
									<Typography variant="h3" className="categories-title">
										CATEGORIES
									</Typography>
								</Stack>

								<TabList
									orientation="vertical"
									aria-label="blog categories tabs"
									TabIndicatorProps={{
										style: { display: 'none', marginBottom: '50px' },
									}}
									onChange={tabChangeHandler}
								>
									<Tab
										value={'GENERAL'}
										label={'General'}
										className={`tab-button ${searchCommunity.search.blogCategory == 'GENERAL' ? 'active' : ''}`}
									/>
									<Tab
										value={'LIFESTYLE'}
										label={'Lifestyle'}
										className={`tab-button ${searchCommunity.search.blogCategory == 'LIFESTYLE' ? 'active' : ''}`}
									/>
									<Tab
										value={'INSTRUCTIVE'}
										label={'Instructive'}
										className={`tab-button ${searchCommunity.search.blogCategory == 'INSTRUCTIVE' ? 'active' : ''}`}
									/>
								</TabList>

								<Stack className="recent-posts">
									<Typography variant="h4" className="recent-posts-title">
										RECENT POSTS
									</Typography>
									<div className="recent-post-list">
										{blogs.slice(0, 4).map((blog, index) => (
											<div
												key={index}
												className="recent-post-item"
												onClick={() => router.push(`/community/detail?blogCategory${blog._id}`)}
											>
												<div className="post-thumbnail">
													<img
														style={{
															backgroundImage: `url(${
																blog?.blogImage ? `${REACT_APP_API_URL}/${blog?.blogImage}` : '/img/watches/all.jpg'
															})`,
															backgroundSize: 'cover',
														}}
													/>
												</div>
												<div className="post-details">
													<Typography className="post-date">
														<Moment format="MMMM DD, YYYY">{blog.createdAt}</Moment>
													</Typography>
													<Typography className="post-title">{blog.blogTitle}</Typography>
												</div>
											</div>
										))}
									</div>
								</Stack>
							</Stack>

							<Stack className="right-config">
								<Stack className="panel-config">
									<Stack className="title-box">
										<Stack className="left">
											<Typography className="title">WATCH BLOG</Typography>
											<Typography className="sub-title">
												Discover the latest in horology and timepiece elegance
											</Typography>
										</Stack>
										<Button
											onClick={() =>
												router.push({
													pathname: '/mypage',
													query: {
														category: 'writeArticle',
													},
												})
											}
											className="right"
										>
											Write
										</Button>
									</Stack>

									<TabPanel value="GENERAL">
										<Stack className="blog-list">
											{totalCount ? (
												blogs?.map((blog: Blog) => (
													<CommunityCard blog={blog} key={blog?._id} likeArticleHandler={likeArticleHandler} />
												))
											) : (
												<Stack className={'no-data'}>
													<img src="/img/icons/icoAlert.svg" alt="" />
													<p>No Article found!</p>
												</Stack>
											)}
										</Stack>
									</TabPanel>
									<TabPanel value="LIFESTYLE">
										<Stack className="blog-list">
											{totalCount ? (
												blogs?.map((blog: Blog) => (
													<CommunityCard blog={blog} key={blog?._id} likeArticleHandler={likeArticleHandler} />
												))
											) : (
												<Stack className={'no-data'}>
													<img src="/img/icons/icoAlert.svg" alt="" />
													<p>No Article found!</p>
												</Stack>
											)}
										</Stack>
									</TabPanel>
									<TabPanel value="INSTRUCTIVE">
										<Stack className="blog-list">
											{totalCount ? (
												blogs?.map((blog: Blog) => (
													<CommunityCard blog={blog} key={blog?._id} likeArticleHandler={likeArticleHandler} />
												))
											) : (
												<Stack className={'no-data'}>
													<img src="/img/icons/icoAlert.svg" alt="" />
													<p>No Article found!</p>
												</Stack>
											)}
										</Stack>
									</TabPanel>									
								</Stack>
							</Stack>
						</Stack>
					</TabContext>

					{totalCount > 0 && (
						<Stack className="pagination-config">
							<Stack className="pagination-box">
								<Pagination
									count={Math.ceil(totalCount / searchCommunity.limit)}
									page={searchCommunity.page}
									onChange={paginationHandler}
									renderItem={(item) => (
										<PaginationItem
											{...item}
											sx={{
												borderRadius: '50%',
												padding: '6px 5px',
												fontWeight: 500,
												fontSize: '16px',
												color: '#fff',
												border: '1px solid #333',
												backgroundColor: '#111',
												transition: 'all 0.3s ease',
												'&:hover': {
													backgroundColor: '#1a1a1a',
													color: '#fff',
													boxShadow: '0 0 10px rgba(212, 175, 55, 0.4)',
												},
												'&.Mui-selected': {
													backgroundColor: '#fafafa',
													color: '#111',
													borderColor: '#d4af37',
													boxShadow: '0 0 12px rgba(212, 175, 55, 0.6)',
												},
											}}
										/>
									)}
									sx={{
										display: 'flex',
										justifyContent: 'center',
										mt: 4,
										'& .MuiPagination-ul': {
											gap: '14px',
										},
									}}
								/>
							</Stack>
							<Stack className="total-result">
								<Typography>
									Total {totalCount} blog{totalCount > 1 ? 's' : ''} available
								</Typography>
							</Stack>
						</Stack>
					)}
				</div>
			</div>
		);
	}
};

Community.defaultProps = {
	initialInput: {
		page: 1,
		limit: 6,
		sort: 'createdAt',
		direction: 'ASC',
		search: {
			blogCategory: 'GENERAL',
		},
	},
};

export default withLayoutBasic(Community);
