import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Stack, Typography, Box, List, ListItem, Button } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import Link from 'next/link';
import { Member } from '../../types/member/member';
import { REACT_APP_API_URL } from '../../config';
import { useQuery } from '@apollo/client';
import { GET_MEMBER } from '../../../apollo/user/query';
import { T } from '../../types/common';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import ArticleIcon from '@mui/icons-material/Article';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import WatchIcon from '@mui/icons-material/Watch';

interface MemberMenuProps {
	subscribeHandler: any;
	unsubscribeHandler: any;
}

const MemberMenu = (props: MemberMenuProps) => {
	const { subscribeHandler, unsubscribeHandler } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const category: any = router.query?.category;
	const [member, setMember] = useState<Member | null>(null);
	const { memberId } = router.query;

	/** APOLLO REQUESTS **/

	const {
		loading: getMemberLoading,
		data: getMemberData,
		error: getMemberError,
		refetch: getMemberRefetch,
	} = useQuery(GET_MEMBER, {
		fetchPolicy: 'network-only',
		variables: { input: memberId },
		skip: !memberId,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setMember(data?.getMember);
		},
	});

	if (device === 'mobile') {
		return <div>MEMBER MENU MOBILE</div>;
	} else {
		return (
			<Stack width={'100%'} padding={'30px 24px'}>
				<Stack className={'profile'}>
					<Box component={'div'} className={'profile-img'}>
						<img
							src={member?.memberImage ? `${REACT_APP_API_URL}/${member?.memberImage}` : '/img/profile/defaultUser.svg'}
							alt={'member-photo'}
						/>
					</Box>
					<Stack className={'user-info'}>
						<Typography className={'user-name'}>{member?.memberNick}</Typography>
						<Box component={'div'} className={'user-phone'}>
							<LocalPhoneIcon sx={{ color: '#fff' }} />
							<Typography className={'p-number'}>{member?.memberPhone}</Typography>
						</Box>
						<Typography className={'view-list'}>{member?.memberType}</Typography>
					</Stack>
				</Stack>
				<Stack className="follow-button-box">
					{member?.meFollowed && member?.meFollowed[0]?.myFollowing ? (
						<>
							<Button
								variant="outlined"
								sx={{ background: '#fff' }}
								onClick={() => unsubscribeHandler(member?._id, getMemberRefetch, memberId)}
							>
								Unfollow
							</Button>
							<Typography>Following</Typography>
						</>
					) : (
						<Button
							variant="contained"
							sx={{ background: '#ff5d18', ':hover': { background: '#ff5d18' } }}
							onClick={() => subscribeHandler(member?._id, getMemberRefetch, memberId)}
						>
							Follow
						</Button>
					)}
				</Stack>
				<Stack className={'sections'}>
					<Stack className={'section'}>
						<Typography className="title" variant={'h5'}>
							Details
						</Typography>
						<List className={'sub-section'}>
							{member?.memberType === 'DEALER' && (
								<ListItem className={category === 'properties' ? 'focus' : ''}>
									<Link
										href={{
											pathname: '/member',
											query: { ...router.query, category: 'properties' },
										}}
										scroll={false}
										style={{ width: '100%' }}
									>
										<div className={'flex-box'}>
											{category === 'properties' ? (
												<WatchIcon sx={{ color: '#fff' }} />
											) : (
												<WatchIcon sx={{ color: '#fff' }} />
											)}
											<Typography className={'sub-title'} variant={'subtitle1'} component={'p'}>
												Watches
											</Typography>
											<Typography className="count-title" variant="subtitle1">
												{member?.memberProperties}
											</Typography>
										</div>
									</Link>
								</ListItem>
							)}
							<ListItem className={category === 'followers' ? 'focus' : ''}>
								<Link
									href={{
										pathname: '/member',
										query: { ...router.query, category: 'followers' },
									}}
									scroll={false}
									style={{ width: '100%' }}
								>
									<div className={'flex-box'}>
										<PersonAddAltIcon sx={{ color: '#fff' }} />
										<Typography className={'sub-title'} variant={'subtitle1'} component={'p'}>
											Followers
										</Typography>
										<Typography className="count-title" variant="subtitle1">
											{member?.memberFollowers}
										</Typography>
									</div>
								</Link>
							</ListItem>
							<ListItem className={category === 'followings' ? 'focus' : ''}>
								<Link
									href={{
										pathname: '/member',
										query: { ...router.query, category: 'followings' },
									}}
									scroll={false}
									style={{ width: '100%' }}
								>
									<div className={'flex-box'}>
										<PersonAddAltIcon sx={{ color: '#fff' }} />
										<Typography className={'sub-title'} variant={'subtitle1'} component={'p'}>
											Followings
										</Typography>
										<Typography className="count-title" variant="subtitle1">
											{member?.memberFollowings}
										</Typography>
									</div>
								</Link>
							</ListItem>
						</List>
					</Stack>
					<Stack className={'section'} sx={{ marginTop: '10px' }}>
						<div>
							<Typography className="title" variant={'h5'}>
								Community
							</Typography>
							<List className={'sub-section'}>
								<ListItem className={category === 'articles' ? 'focus' : ''}>
									<Link
										href={{
											pathname: '/member',
											query: { ...router.query, category: 'articles' },
										}}
										scroll={false}
										style={{ width: '100%' }}
									>
										<div className={'flex-box'}>
											<ArticleIcon sx={{ color: '#fff' }} />

											<Typography className={'sub-title'} variant={'subtitle1'} component={'p'}>
												Blogs
											</Typography>
											<Typography className="count-title" variant="subtitle1">
												{member?.memberBlogs}
											</Typography>
										</div>
									</Link>
								</ListItem>
							</List>
						</div>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default MemberMenu;
