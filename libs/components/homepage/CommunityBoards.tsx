import React, { useState } from 'react';
import Link from 'next/link';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Stack, Typography } from '@mui/material';
import CommunityCard from './CommunityCard';
import { Blog } from '../../types/board-article/blog';
import { GET_BLOGS } from '../../../apollo/user/query';
import { useQuery } from '@apollo/client';
import { BlogCategory } from '../../enums/blog.enum';
import { T } from '../../types/common';

const CommunityBoards = () => {
	const device = useDeviceDetect();
	const [searchCommunity, setSearchCommunity] = useState({
		page: 1,
		sort: 'blogViews',
		direction: 'DESC',
	});
	const [newsArticles, setNewsArticles] = useState<Blog[]>([]);
	const [freeArticles, setFreeArticles] = useState<Blog[]>([]);

	/** APOLLO REQUESTS **/
	const {
		loading: getGeneralBlogsLoading,
		data: getGeneralBlogsData,
		error: getGeneralBlogsError,
		refetch: getGeneralBlogsRefetch,
	} = useQuery(GET_BLOGS, {
		fetchPolicy: 'network-only',
		variables: { input: { ...searchCommunity, limit: 6, search: { blogCategory: BlogCategory.INSTRUCTIVE } } },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setNewsArticles(data?.getBlogs?.list);
		},
	});

	const {
		loading: getLifeStyleBlogsLoading,
		data: getLifeStyleBlogsData,
		error: getLifeStyleBlogsError,
		refetch: getLifeStyleBlogsRefetch,
	} = useQuery(GET_BLOGS, {
		fetchPolicy: 'network-only',
		variables: { input: { ...searchCommunity, limit: 3, search: { blogCategory: BlogCategory.LIFESTYLE } } },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setFreeArticles(data?.getBlogs?.list);
		},
	});

	if (device === 'mobile') {
		return <div>COMMUNITY BOARDS (MOBILE)</div>;
	} else {
		return (
			<Stack className={'community-board'}>
				<Stack className={'container'}>
					<Stack>
						<Typography variant={'h1'}>BLOGS</Typography>
					</Stack>
					<Stack className="community-main">
						<Stack className={'community-left'}>
							<Stack className={'content-top'}>
								<Link href={'/community?blogCategory=GENERAL'}>
									<span>General</span>
								</Link>
								<img src="/img/icons/arrowBig.svg" alt="" />
							</Stack>
							<Stack className={'card-wrap'}>
								{newsArticles.map((blog, index) => {
									return <CommunityCard vertical={true} blog={blog} index={index} key={blog?._id} />;
								})}
							</Stack>
						</Stack>
						<Stack className={'community-right'}>
							<Stack className={'content-top'}>
								<Link href={'/community?blogCategory=LIFESTYLE'}>
									<span>LifeStyle</span>
								</Link>
								<img src="/img/icons/arrowBig.svg" alt="" />
							</Stack>
							<Stack className={'card-wrap vertical'}>
								{freeArticles.map((blog, index) => {
									return <CommunityCard vertical={false} blog={blog} index={index} key={blog?._id} />;
								})}
							</Stack>
						</Stack>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default CommunityBoards;
