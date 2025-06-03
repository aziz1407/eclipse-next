import React from 'react';
import { useRouter } from 'next/router';
import { Stack, Typography, Box, List, ListItem } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import Link from 'next/link';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { REACT_APP_API_URL } from '../../config';
import { logOut } from '../../auth';
import { sweetConfirmAlert } from '../../sweetAlert';
import WatchIcon from '@mui/icons-material/Watch';
import { useTranslation } from 'next-i18next';

const MyMenu = () => {
	const device = useDeviceDetect();
	const router = useRouter();
	const pathname = router.query.category ?? 'myProfile';
	const category = router.query?.category ?? 'myProfile';
	const user = useReactiveVar(userVar);
	const { t } = useTranslation('common');


	// Luxury color palette
	const colors = {
		primaryGold: '#d4af37',
		secondaryGold: '#b8860b',
		accentGold: '#ffd700',
		lightGold: '#f4e4bc',
		primaryDark: '#1a1a1a',
		secondaryDark: '#2d2d2d',
		tertiaryDark: '#3a3a3a',
		charcoal: '#404040',
		textPrimary: '#ffffff',
		textSecondary: '#cccccc',
		textMuted: '#999999',
		borderLight: 'rgba(212, 175, 55, 0.3)',
		borderDark: 'rgba(255, 255, 255, 0.1)',
		shadowGold: 'rgba(212, 175, 55, 0.2)',
		shadowDark: 'rgba(0, 0, 0, 0.3)',
	};

	/** HANDLERS **/
	const logoutHandler = async () => {
		try {
			if (await sweetConfirmAlert('Do you want to logout?')) logOut();
		} catch (err: any) {
			console.log('ERROR, logoutHandler:', err.message);
		}
	};

	// Menu items configuration
	const menuSections = [
		{
			title: t('WATCH COLLECTION'),
			items: user.memberType === 'DEALER' ? [
				{
					key: 'addProperty',
					label: t('Add New Watch'),
					icon: '/img/icons/newTab.svg',
					activeIcon: '/img/icons/whiteTab.svg',
				},
				{
					key: 'myProperties',
					label: t('My Watches'),
					icon: '/img/icons/home.svg',
					activeIcon: '/img/icons/homeWhite.svg',
				},
			] : [],
		},
		{
			title: t('PERSONAL VAULT'),
			items: [
				{
					key: 'myFavorites',
					label: t('Favorites'),
					icon: '/img/icons/like.svg',
					activeIcon: '/img/icons/likeWhite.svg',
				},
				{
					key: 'recentlyVisited',
					label: t('Recently Visited'),
					icon: '/img/icons/search.svg',
					activeIcon: '/img/icons/searchWhite.svg',
				},
			],
		},
		{
			title: t('COMMUNITY'),
			items: [
				{
					key: 'followers',
					label: t('Followers'),
					customIcon: true,
				},
				{
					key: 'followings',
					label: t('Following'),
					customIcon: true,
				},
				{
					key: 'myBlogs',
					label: t('My Blogs'),
					icon: '/img/icons/discovery.svg',
					activeIcon: '/img/icons/discoveryWhite.svg',
				},
				{
					key: 'writeBlog',
					label: t('Write Blog'),
					icon: '/img/icons/newTab.svg',
					activeIcon: '/img/icons/whiteTab.svg',
				},
			],
		},
		{
			title: t('ACCOUNT'),
			items: [
				{
					key: 'myProfile',
					label: t('Profile'),
					icon: '/img/icons/user.png',
					activeIcon: '/img/icons/userWhite.svg',
				},
			],
		},
	];

	const FollowerIcon = ({ isActive, type }: { isActive: boolean; type: string }) =>  (
		<svg
			style={{
				width: '18px',
				height: '18px',
				marginRight: '12px',
				filter: isActive ? 'brightness(0) invert(1)' : 'brightness(0) invert(1)',
			}}
			fill={isActive ? 'white' : 'white'}
			viewBox="0 0 328 328"
		>
			<g>
				<path d="M52.25,64.001c0,34.601,28.149,62.749,62.75,62.749c34.602,0,62.751-28.148,62.751-62.749S149.602,1.25,115,1.25C80.399,1.25,52.25,29.4,52.25,64.001z"/>
				{type === 'followers' ? (
					<path d="M217.394,262.357c2.929,2.928,6.768,4.393,10.606,4.393c3.839,0,7.678-1.465,10.607-4.394c5.857-5.858,5.857-15.356-0.001-21.214l-19.393-19.391l19.395-19.396c5.857-5.858,5.857-15.356-0.001-21.214c-5.858-5.857-15.356-5.856-21.214,0.001l-30,30.002c-2.813,2.814-4.393,6.629-4.393,10.607c0,3.979,1.58,7.794,4.394,10.607L217.394,262.357z"/>
				) : (
					<path d="M228.606,181.144c-5.858-5.857-15.355-5.858-21.214-0.001c-5.857,5.857-5.857,15.355,0,21.214l19.393,19.396l-19.393,19.391c-5.857,5.857-5.857,15.355,0,21.214c2.93,2.929,6.768,4.394,10.607,4.394c3.838,0,7.678-1.465,10.605-4.393l30-29.998c2.813-2.814,4.395-6.629,4.395-10.607c0-3.978-1.58-7.793-4.394-10.607L228.606,181.144z"/>
				)}
				<path d="M15,286.75h125.596c19.246,24.348,49.031,40,82.404,40c57.896,0,105-47.103,105-105c0-57.896-47.104-105-105-105c-34.488,0-65.145,16.716-84.297,42.47c-7.764-1.628-15.695-2.47-23.703-2.47c-63.411,0-115,51.589-115,115C0,280.034,6.716,286.75,15,286.75z M223,146.75c41.355,0,75,33.645,75,75s-33.645,75-75,75s-75-33.645-75-75S181.644,146.75,223,146.75z"/>
			</g>
		</svg>
	);

	if (device === 'mobile') {
		return <div>MY MENU</div>;
	}

	return (
		<Stack
			sx={{
				position: 'sticky',
				top: '20px',
				width: '100%',
				padding: '20px',
				background: `linear-gradient(180deg, ${colors.primaryDark} 0%, ${colors.secondaryDark} 100%)`,
				borderRadius: '30px',
				border: `1px solid ${colors.borderLight}`,
				boxShadow: `0px 8px 32px ${colors.shadowDark}, 0px 2px 8px ${colors.shadowGold}`,
				height: 'fit-content',
				maxHeight: 'calc(100vh - 40px)',
				overflow: 'auto',
				maxWidth: '400px',
				alignSelf: 'flex-start',
				marginTop: "100px",
				marginBottom: "90px",
				marginLeft: "10px",
				'&::-webkit-scrollbar': {
					width: '8px',
				},
				'&::-webkit-scrollbar-track': {
					background: colors.secondaryDark,
					borderRadius: '10px',
				},
				'&::-webkit-scrollbar-thumb': {
					background: colors.primaryGold,
					borderRadius: '10px',
					'&:hover': {
						background: colors.accentGold,
					},
				},
			}}
		>
			{/* Profile Section */}
			<Stack
				sx={{
					flexDirection: 'row',
					alignItems: 'center',
					padding: '15px',
					marginBottom: '20px',
					background: `linear-gradient(135deg, ${colors.tertiaryDark} 0%, ${colors.charcoal} 100%)`,
					borderRadius: '25px',
					border: `1px solid ${colors.borderLight}`,
					boxShadow: `inset 0px 1px 0px rgba(212, 175, 55, 0.1)`,
				}}
			>
				<Box
					sx={{
						width: '60px',
						height: '60px',
						borderRadius: '50%',
						border: `3px solid ${colors.primaryGold}`,
						boxShadow: `0px 4px 12px ${colors.shadowGold}`,
						overflow: 'hidden',
						marginRight: '15px',
					}}
				>
					<img
						src={user?.memberImage ? `${REACT_APP_API_URL}/${user?.memberImage}` : '/img/profile/defaultUser.svg'}
						alt="member-photo"
						style={{
							width: '100%',
							height: '100%',
							objectFit: 'cover',
						}}
					/>
				</Box>
				<Stack sx={{ flex: 1 }}>
					<Typography
						sx={{
							color: colors.textPrimary,
							fontSize: '16px',
							fontWeight: 600,
							marginBottom: '4px',
							textShadow: '0px 1px 2px rgba(0, 0, 0, 0.5)',
						}}
					>
						{user?.memberNick}
					</Typography>
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							marginBottom: '3px',
						}}
					>
						<img
							src="/img/icons/call.svg"
							alt="phone"
							style={{
								width: '14px',
								height: '14px',
								marginRight: '6px',
								filter: 'brightness(0) invert(1)',
							}}
						/>
						<Typography
							sx={{
								color: colors.textSecondary,
								fontSize: '13px',
							}}
						>
							{user?.memberPhone}
						</Typography>
					</Box>
					{user?.memberType === 'ADMIN' ? (
						<a href="/_admin/users" target="_blank" rel="noopener noreferrer">
							<Typography
								sx={{
									color: colors.accentGold,
									fontSize: '12px',
									fontWeight: 600,
									cursor: 'pointer',
									textDecoration: 'none',
									'&:hover': {
										color: colors.primaryGold,
									},
								}}
							>
								{user?.memberType}
							</Typography>
						</a>
					) : (
						<Typography
							sx={{
								color: colors.primaryGold,
								fontSize: '12px',
								fontWeight: 600,
								textTransform: 'uppercase',
								letterSpacing: '1px',
							}}
						>
							{user?.memberType}
						</Typography>
					)}
				</Stack>
			</Stack>

			{/* Menu Sections */}
			<Stack sx={{ gap: '16px' }}>
				{menuSections.map((section, sectionIndex) => {
					// Filter out empty sections
					if (section.items.length === 0) return null;
					
					return (
						<Stack key={sectionIndex}>
							<Typography
								sx={{
									color: colors.primaryGold,
									fontSize: '11px',
									fontWeight: 700,
									textTransform: 'uppercase',
									letterSpacing: '1.5px',
									marginBottom: '12px',
									paddingBottom: '6px',
									borderBottom: `1px solid ${colors.borderLight}`,
								}}
							>
								{section.title}
							</Typography>
							<List sx={{ padding: 0, gap: '2px', display: 'flex', flexDirection: 'column' }}>
								{section.items.map((item) => {
									const isActive = pathname === item.key;
									
									return (
										<ListItem
											key={item.key}
											sx={{
												padding: 0,
												marginBottom: '2px',
											}}
										>
											<Link
												href={{
													pathname: '/mypage',
													query: { category: item.key },
												}}
												scroll={false}
												style={{ textDecoration: 'none', width: '100%' }}
											>
												<Box
													sx={{
														display: 'flex',
														alignItems: 'center',
														padding: '10px 14px',
														borderRadius: '20px',
														cursor: 'pointer',
														transition: 'all 0.3s ease',
														background: isActive 
															? `linear-gradient(135deg, ${colors.primaryGold} 0%, ${colors.secondaryGold} 100%)`
															: 'transparent',
														color: isActive ? colors.primaryDark : colors.textSecondary,
														boxShadow: isActive ? `0px 4px 12px ${colors.shadowGold}` : 'none',
														'&:hover': {
															background: isActive 
																? `linear-gradient(135deg, ${colors.primaryGold} 0%, ${colors.secondaryGold} 100%)`
																: `rgba(212, 175, 55, 0.1)`,
															color: isActive ? colors.primaryDark : colors.textPrimary,
														},
													}}
												>
													{item.customIcon ? (
														<FollowerIcon 
															isActive={isActive} 
															type={item.key}
														/>
													) : (
														<img
															src={isActive ? item.activeIcon : item.icon}
															alt="icon"
															style={{
																width: '16px',
																height: '16px',
																marginRight: '10px',
																filter: !isActive ? 'brightness(0) invert(1)' : 'none',
															}}
														/>
													)}
													<Typography
														sx={{
															fontSize: '13px',
															fontWeight: isActive ? 600 : 500,
															flex: 1,
														}}
													>
														{item.label}
													</Typography>
												</Box>
											</Link>
										</ListItem>
									);
								})}
							</List>
						</Stack>
					);
				})}

				{/* Logout Section */}
				<Stack sx={{ marginTop: '-10px' }}>
					<ListItem sx={{ padding: 0 }}>
						<Box
							onClick={logoutHandler}
							sx={{
								display: 'flex',
								alignItems: 'center',
								padding: '10px 14px',
								borderRadius: '20px',
								cursor: 'pointer',
								transition: 'all 0.3s ease',
								background: 'transparent',
								color: colors.textMuted,
								width: '100%',
								border: `1px solid ${colors.borderDark}`,
								'&:hover': {
									background: 'rgba(231, 76, 60, 0.1)',
									color: '#e74c3c',
									borderColor: 'rgba(231, 76, 60, 0.3)',
								},
							}}
						>
							<img
								src="/img/icons/logout.svg"
								alt="logout"
								style={{
									width: '16px',
									height: '16px',
									marginRight: '10px',
									filter: 'brightness(0) invert(1)',
								}}
							/>
							<Typography
								sx={{
									fontSize: '13px',
									fontWeight: 500,
								}}
							>
								{t("Logout")}
							</Typography>
						</Box>
					</ListItem>
				</Stack>
			</Stack>
		</Stack>
	);
};

export default MyMenu;