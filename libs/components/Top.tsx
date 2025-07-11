import React, { useCallback, useEffect, useRef } from 'react';
import { useState } from 'react';
import { useRouter, withRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { getJwtToken, logOut, updateUserInfo } from '../auth';
import { Stack, Box, IconButton, Badge } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import { alpha, styled } from '@mui/material/styles';
import Menu, { MenuProps } from '@mui/material/Menu';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { CaretDown } from 'phosphor-react';
import useDeviceDetect from '../hooks/useDeviceDetect';
import Link from 'next/link';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import { useReactiveVar } from '@apollo/client';
import { socketVar, userVar } from '../../apollo/store';
import { Logout, Search, ShoppingBag } from '@mui/icons-material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { REACT_APP_API_URL } from '../config';
import NotificationModal from './common/NotificationModal';

const Top = () => {
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const socket = useReactiveVar(socketVar);
	const { t, i18n } = useTranslation('common');
	const router = useRouter();
	const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null);
	const [lang, setLang] = useState<string | null>('en');
	const drop = Boolean(anchorEl2);
	const [colorChange, setColorChange] = useState(false);
	const [anchorEl, setAnchorEl] = React.useState<any | HTMLElement>(null);
	let open = Boolean(anchorEl);
	const [bgColor, setBgColor] = useState<boolean>(false);
	const [logoutAnchor, setLogoutAnchor] = React.useState<null | HTMLElement>(null);
	const logoutOpen = Boolean(logoutAnchor);
	const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
	const [notificationAnchor, setNotificationAnchor] = React.useState<null | HTMLElement>(null);
	const notificationOpen = Boolean(notificationAnchor);

	/** LIFECYCLES **/
	useEffect(() => {
		if (localStorage.getItem('locale') === null) {
			localStorage.setItem('locale', 'en');
			setLang('en');
		} else {
			setLang(localStorage.getItem('locale'));
		}
	}, [router]);

	useEffect(() => {
		switch (router.pathname) {
			case '/property/detail':
				setBgColor(true);
				break;
			default:
				break;
		}
	}, [router]);

	useEffect(() => {
		const jwt = getJwtToken();
		if (jwt) updateUserInfo(jwt);
	}, []);

	useEffect(() => {
		if (socket && user?._id) {
			console.log('TopBasic: Setting up notification listener', {
				socketState: socket.readyState,
				userId: user._id,
			});

			socket.onmessage = (msg) => {
				try {
					const data = JSON.parse(msg.data);
					console.log('TopBasic: Received message:', data);

					if (data.event === 'notification') {
						console.log('TopBasic: Received notification:', data.payload);
						// Update badge state for new notifications
						if (data.payload.status === 'WAIT') {
							setHasUnreadNotifications(true);
						}
					} else if (data.event === 'unreadNotifications') {
						console.log('TopBasic: Received initial unread notifications:', data.payload);
						// If there are any unread notifications, show the badge
						if (data.payload && data.payload.length > 0) {
							setHasUnreadNotifications(true);
						}
					}
				} catch (error) {
					console.error('TopBasic: Error processing message:', error);
				}
			};

			socket.onerror = (error) => {
				console.error('TopBasic: WebSocket error:', error);
			};
		}

		return () => {
			if (socket) {
				console.log('TopBasic: Cleaning up notification listener');
				socket.onmessage = null;
				socket.onerror = null;
			}
		};
	}, [socket, user]);

	/** HANDLERS **/
	const langClick = (e: any) => {
		setAnchorEl2(e.currentTarget);
	};

	const langClose = () => {
		setAnchorEl2(null);
	};

	const langChoice = useCallback(
		async (e: any) => {
			setLang(e.target.id);
			localStorage.setItem('locale', e.target.id);
			setAnchorEl2(null);
			await router.push(router.asPath, router.asPath, { locale: e.target.id });
		},
		[router],
	);

	const changeNavbarColor = () => {
		if (window.scrollY >= 50) {
			setColorChange(true);
		} else {
			setColorChange(false);
		}
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleHover = (event: any) => {
		if (anchorEl !== event.currentTarget) {
			setAnchorEl(event.currentTarget);
		} else {
			setAnchorEl(null);
		}
	};

	const handleNotificationClick = (event: React.MouseEvent<HTMLElement>) => {
		setNotificationAnchor(event.currentTarget);
	};

	const handleNotificationClose = () => {
		setNotificationAnchor(null);
	};

	const handleUnreadCountChange = (count: number) => {
		setHasUnreadNotifications(count > 0);
	};

	const StyledMenu = styled((props: MenuProps) => (
		<Menu
			elevation={0}
			anchorOrigin={{
				vertical: 'bottom',
				horizontal: 'right',
			}}
			transformOrigin={{
				vertical: 'top',
				horizontal: 'right',
			}}
			{...props}
		/>
	))(({ theme }) => ({
		'& .MuiPaper-root': {
			borderRadius: 4,
			marginTop: '5px',
			minWidth: 140,
			boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.15)',
			'& .MuiMenu-list': {
				padding: '4px 0',
			},
			'& .MuiMenuItem-root': {
				fontSize: 14,
				padding: '8px 12px',
				'& .img-flag': {
					width: 20,
					height: 14,
					marginRight: 8,
					borderRadius: 2,
					objectFit: 'cover',
					flexShrink: 0,
				},
			},
		},
	}));

	if (typeof window !== 'undefined') {
		window.addEventListener('scroll', changeNavbarColor);
	}

	if (device == 'mobile') {
		return (
			<Stack className={'top'}>
				<Link href={'/'}>
					<div>{t('Home')}</div>
				</Link>
				<Link href={'/property'}>
					<div>{t('Watches')}</div>
				</Link>
				<Link href={'/agent'}>
					<div> {t('Dealers')} </div>
				</Link>
				<Link href={'/community?blogCategory=GENERAL'}>
					<div> {t('Blogs')} </div>
				</Link>
				<Link href={'/cs'}>
					<div> {t('CS')} </div>
				</Link>
			</Stack>
		);
	} else {
		return (
			<Stack className={'navbar'}>
				<Stack className={`navbar-main ${colorChange ? 'transparent' : ''} ${bgColor ? 'transparent' : ''}`}>
					<Stack className={'container'}>
						<Box component={'div'} className={'left-links'} sx={{ fontFamily: 'sans-serif' }}>
							<Link href={'/'}>
								<div>{t('Home')}</div>
							</Link>
							<Link href={'/property'}>
								<div>{t('Properties')}</div>
							</Link>
							<Link href={'/agent'}>
								<div>{t('Agents')}</div>
							</Link>
							<Link href={'/community'}>
								<div>{t('Community')}</div>
							</Link>
							<Link href={'/mypage'}>
								<div>{t('My Page')}</div>
							</Link>
							<Link href={'/cs'}>
								<div>{t('CS')}</div>
							</Link>
						</Box>

						<Box component={'div'} className={'logo-box'}>
							<Link href={'/'}>
								<div>Éclipse</div>
							</Link>
						</Box>

						<Box component={'div'} className={'navbar-icons-right'}>
							{user?._id ? (
								<Link href={'/mypage?category=myFavorites'}>
									<FavoriteBorderIcon sx={{ color: '#eeeeeeed', fontSize: 22, cursor: 'pointer', marginTop: '5px' }} />
								</Link>
							) : null}

							{user?._id && (
								<>
									<IconButton onClick={handleNotificationClick} size="small" sx={{ mr: 2 }}>
										<Badge color="error" variant="dot" invisible={!hasUnreadNotifications}>
											<NotificationsOutlinedIcon className={'notification-icon'} />
										</Badge>
									</IconButton>
									<NotificationModal
										anchorEl={notificationAnchor}
										open={notificationOpen}
										onClose={handleNotificationClose}
										onUnreadCountChange={handleUnreadCountChange}
									/>
								</>
							)}

							{user?._id ? (
								<>
									<div className={'login-user'} onClick={(event: any) => setLogoutAnchor(event.currentTarget)}>
										<img
											src={
												user?.memberImage ? `${REACT_APP_API_URL}/${user?.memberImage}` : '/img/profile/defaultUser.svg'
											}
											alt=""
										/>
									</div>
									<Menu
										id="basic-menu"
										anchorEl={logoutAnchor}
										open={logoutOpen}
										onClose={() => {
											setLogoutAnchor(null);
										}}
										sx={{ mt: '5px' }}
									>
										<MenuItem onClick={() => logOut()}>
											<Logout fontSize="small" style={{ color: 'blue', marginRight: '10px' }} />
											Logout
										</MenuItem>
									</Menu>
								</>
							) : (
								<Link href={'/account/join'}>
									<AccountCircleOutlinedIcon sx={{ color: '#eeeeeeed', fontSize: 24, cursor: 'pointer' }} />
								</Link>
							)}

							<div className={'lan-box'}>
								<Button
									disableRipple
									className="btn-lang"
									onClick={langClick}
									endIcon={<CaretDown size={14} color="#eeeeeeed" weight="fill" />}
									sx={{
										color: '#eeeeeeed',
										'&:hover': {
											backgroundColor: 'transparent',
										},
									}}
								>
									<Box component={'div'} className={'flag'}>
										{lang !== null ? (
											<img src={`/img/flag/lang${lang}.png`} alt={'usaFlag'} />
										) : (
											<img src={`/img/flag/langen.png`} alt={'usaFlag'} />
										)}
									</Box>
								</Button>
								<StyledMenu anchorEl={anchorEl2} open={drop} onClose={langClose}>
									<MenuItem disableRipple onClick={langChoice} id="en">
										<img
											className="img-flag"
											src={'/img/flag/langen.png'}
											onClick={langChoice}
											id="en"
											alt={'usaFlag'}
										/>
										{t('English')}
									</MenuItem>
									<MenuItem disableRipple onClick={langChoice} id="kr">
										<img
											className="img-flag"
											src={'/img/flag/langkr.png'}
											onClick={langChoice}
											id="kr"
											alt={'koreanFlag'}
										/>
										{t('Korean')}
									</MenuItem>
									<MenuItem disableRipple onClick={langChoice} id="ru">
										<img
											className="img-flag"
											src={'/img/flag/langru.png'}
											onClick={langChoice}
											id="ru"
											alt={'russiaFlag'}
										/>
										{t('Russian')}
									</MenuItem>
									<MenuItem disableRipple onClick={langChoice} id="uz">
										<img
											className="img-flag"
											src={'/img/flag/languz.png'}
											onClick={langChoice}
											id="uz"
											alt={'uzbekFlag'}
										/>
										{t('Uzbek')}
									</MenuItem>
									<MenuItem disableRipple onClick={langChoice} id="ar">
										<img
											className="img-flag"
											src={'/img/flag/langar.png'}
											onClick={langChoice}
											id="ar"
											alt={'arabicFlag'}
										/>
										{t('Arabic')}
									</MenuItem>
								</StyledMenu>
							</div>
						</Box>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default withRouter(Top);
