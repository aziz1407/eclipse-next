import React, { useState } from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Pagination, Stack, Typography } from '@mui/material';
import CommunityCard from '../common/CommunityCard';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { T } from '../../types/common';
import { Blog } from '../../types/blog/blog';
import { LIKE_TARGET_BLOG } from '../../../apollo/user/mutation';
import { GET_BLOGS } from '../../../apollo/user/query';
import { Messages } from '../../config';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';

const MyArticles: NextPage = ({ initialInput, ...props }: T) => {
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const [searchCommunity, setSearchCommunity] = useState({
		...initialInput,
		search: { memberId: user._id },
	});
	const [boardArticles, setBoardArticles] = useState<Blog[]>([]);
	const [totalCount, setTotalCount] = useState<number>(0);

	/** APOLLO REQUESTS **/
	const [likeTargetBoardArticle] = useMutation(LIKE_TARGET_BLOG);

	const {
		loading: boardArticlesLoading,
		data: boardArticlesData,
		error: getBoardArticlesError,
		refetch: getBlogsRefetch,
	} = useQuery(GET_BLOGS, {
		fetchPolicy: 'network-only',
		variables: {
			input: searchCommunity,
		},
		notifyOnNetworkStatusChange: true,
		onCompleted(data) {
			setBoardArticles(data?.getBlogs?.list);
			setTotalCount(data?.getBlogs?.metaCounter?.[0]?.total);
		},
	});
	/** HANDLERS **/
	const paginationHandler = (e: T, value: number) => {
		setSearchCommunity({ ...searchCommunity, page: value });
	};

	const likeBoArticleHandler = async (e: any, user: any, id: string) => {
		try {
			e.stopPropagation();
			if (!id) return;
			if (!user?._id) throw new Error(Messages.error2);

			await likeTargetBoardArticle({
				variables: {
					input: id,
				},
			});

			await getBlogsRefetch({ input: searchCommunity });

			await sweetTopSmallSuccessAlert('Success!', 750);
		} catch (err: any) {
			console.log('ERROR, likeBoArticleHandler:', err.message);
			await sweetMixinErrorAlert(err.message);
		}
	};

	if (device === 'mobile') {
		return <>ARTICLE PAGE MOBILE</>;
	} else
		return (
			<div id="my-articles-page">
				<Stack className="main-title-box">
					<Stack className="right-box">
						<Typography className="main-title">Blogs</Typography>
						<Typography className="sub-title">We are glad to see you again!</Typography>
					</Stack>
				</Stack>
				<Stack className="article-list-box">
					{boardArticles?.length > 0 ? (
						boardArticles?.map((boardArticle: Blog) => {
							return (
								<CommunityCard
									blog={boardArticle}
									key={boardArticle?._id}
									size={'small'}
									likeArticleHandler={likeBoArticleHandler}
								/>
							);
						})
					) : (
						<div className={'no-data'}>
							<img src="/img/icons/icoAlert.svg" alt="" />
							<p>No Blogs found!</p>
						</div>
					)}
				</Stack>

				{boardArticles?.length > 0 && (
					<Stack className="pagination-conf">
						<Stack className="pagination-box">
							<Pagination
								page={searchCommunity.page}
								count={Math.ceil(searchCommunity.limit)}
								onChange={paginationHandler}
								size="large"
								showFirstButton
								showLastButton
								sx={{
									'& .MuiPaginationItem-root': {
										fontWeight: 600,
										color: '#fff',
									},
								}}
							/>
						</Stack>
						<Stack className="total">
							<Typography>Total {totalCount ?? 0} blog(s) available</Typography>
						</Stack>
					</Stack>
				)}
			</div>
		);
};

MyArticles.defaultProps = {
	initialInput: {
		page: 1,
		limit: 2,
		sort: 'createdAt',
		direction: 'DESC',
		search: {},
	},
};

export default MyArticles;
