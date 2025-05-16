import React from 'react';
import Link from 'next/link';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Box } from '@mui/material';
import Moment from 'react-moment';
import { Blog } from '../../types/blog/blog';

interface CommunityCardProps {
	vertical: boolean;
	blog: Blog;
	index: number;
}

const CommunityCard = (props: CommunityCardProps) => {
	const { vertical, blog, index } = props;
	const device = useDeviceDetect();
	const blogImage = blog?.blogImage
		? `${process.env.REACT_APP_API_URL}/${blog?.blogImage}`
		: '/img/event.svg';

	if (device === 'mobile') {
		return <div>COMMUNITY CARD (MOBILE)</div>;
	} else {
		if (vertical) {
			return (
				<Link href={`/community/detail?articleCategory=${blog?.blogCategory}&id=${blog?._id}`}>
					<Box component={'div'} className={'vertical-card'}>
						<div className={'community-img'} style={{ backgroundImage: `url(${blogImage})` }}>
							<div>{index + 1}</div>
						</div>
						<strong>{blog?.blogTitle}</strong>
						<span>Free Board</span>
					</Box>
				</Link>
			);
		} else {
			return (
				<>
					<Link href={`/community/detail?articleCategory=${blog?.blogCategory}&id=${blog?._id}`}>
						<Box component={'div'} className="horizontal-card">
							<img src={blogImage} alt="" />
							<div>
								<strong>{blog.blogTitle}</strong>
								<span>
									<Moment format="DD.MM.YY">{blog?.createdAt}</Moment>
								</span>
							</div>
						</Box>
					</Link>
				</>
			);
		}
	}
};

export default CommunityCard;
