import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { Pagination, Stack, Typography } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { useRouter } from 'next/router';
import CommunityCard from '../common/CommunityCard';
import { T } from '../../types/common';
import { Blog } from '../../types/blog/blog';
import { BlogsInquiry } from '../../types/blog/blog.input';
import { useMutation, useQuery } from '@apollo/client';
import { LIKE_TARGET_BLOG } from '../../../apollo/user/mutation';
import { GET_BLOGS } from '../../../apollo/user/query';
import { Messages } from '../../config';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';

const MemberArticles: NextPage = ({ initialInput, ...props }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const [total, setTotal] = useState<number>(0);
	const { memberId } = router.query;
	const [searchFilter, setSearchFilter] = useState<BlogsInquiry>(initialInput);
	const [memberBoArticles, setMemberBoArticles] = useState<Blog[]>([]);

	/** APOLLO REQUESTS **/
	const [likeTargetBoardArticle] = useMutation(LIKE_TARGET_BLOG);

	const {
		loading: boardArticlesLoading,
		data: boardArticles,
		error: getBoardArticlesError,
		refetch: boardArticlesFetch,
	} = useQuery(GET_BLOGS, {
		fetchPolicy: 'network-only',
		variables: {
			input: searchFilter,
		},
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: any) => {
			setMemberBoArticles(data?.getBlogs?.list);
			setTotal(data?.getBlogs?.metaCounter[0]?.total || 0);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		if (memberId) setSearchFilter({ ...initialInput, search: { memberId: memberId } });
	}, [memberId]);

	/** HANDLERS **/
	const paginationHandler = (e: T, value: number) => {
		setSearchFilter({ ...searchFilter, page: value });
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

			await boardArticlesFetch({
				input: searchFilter,
			});

			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			console.log('ERROR, likePropertyHandler:', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	if (device === 'mobile') {
		return <div>MEMBER ARTICLES MOBILE</div>;
	} else {
		return (
			<div id="member-articles-page">
				<Stack className="main-title-box">
					<Stack className="right-box">
						<Typography className="main-title">Articles</Typography>
					</Stack>
				</Stack>
				<Stack className="articles-list-box">
					{memberBoArticles?.length === 0 && (
						<div className={'no-data'}>
							<img src="/img/icons/icoAlert.svg" alt="" />
							<p>No Blogs found!</p>
						</div>
					)}
					{memberBoArticles?.map((boardArticle: Blog) => {
						return (
							<CommunityCard
								blog={boardArticle}
								likeArticleHandler={likeArticleHandler}
								key={boardArticle?._id}
								size={'small'}
							/>
						);
					})}
				</Stack>
				{memberBoArticles?.length !== 0 && (
					<Stack className="pagination-config">
						<Stack className="pagination-box">
							<Pagination
								page={searchFilter.page}
								count={Math.ceil(total / searchFilter.limit)}
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
					</Stack>
				)}
			</div>
		);
	}
};

MemberArticles.defaultProps = {
	initialInput: {
		page: 1,
		limit: 6,
		sort: 'createdAt',
		direction: 'DESC',
		search: {},
	},
};

export default MemberArticles;
