import React, { useEffect, useState } from 'react';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import Head from 'next/head';
import Top from '../Top';
import Footer from '../Footer';
import { Stack } from '@mui/material';
import FiberContainer from '../common/FiberContainer';
import { userVar } from '../../../apollo/store';
import { useReactiveVar } from '@apollo/client';
import { getJwtToken, updateUserInfo } from '../../auth';
import Chat from '../Chat';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import HeaderFilter from '../homepage/HeaderFilter';
import { useRouter } from 'next/router';

const withLayoutMain = (Component: any) => {
	return (props: any) => {
		const device = useDeviceDetect();
		const user = useReactiveVar(userVar);
		const [currentSlide, setCurrentSlide] = useState(0);
		const router = useRouter();

		// Slider data matching your images
		const slides = [
			{
				id: 1,
				backgroundImage: '/img/watches/header8.jpg',
				brand: 'SPECIAL DAY',
				title: 'Sleek Style',
				subtitle: 'Luxury Line',
				buttonText: 'SHOP NOW',
			},
			{
				id: 2,
				backgroundImage: '/img/watches/header23.jpg',
				brand: 'ÉCLIPSE STORE',
				title: 'Smart Luxe',
				subtitle: 'Elite Series',
				buttonText: 'SHOP NOW',
			},
			{
				id: 3,
				backgroundImage: '/img/watches/header22.jpg',
				brand: 'PREMIUM SERIES',
				title: 'Pure Class',
				subtitle: 'Posh Picks',
				buttonText: 'SHOP NOW',
			},
		];

		/** LIFECYCLES **/
		useEffect(() => {
			const jwt = getJwtToken();
			if (jwt) updateUserInfo(jwt);
		}, []);

		// Auto-slide every 10 seconds
		useEffect(() => {
			const interval = setInterval(() => {
				setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
			}, 10000);

			return () => clearInterval(interval);
		}, [slides.length]);

		/** HANDLERS **/
		const handlePrevSlide = () => {
			setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
		};

		const handleNextSlide = () => {
			setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
		};

		const handleShopNow = () => {
			router.push('/property');
		};

		if (device == 'mobile') {
			return (
				<>
					<Head>
						<title>Eclipse</title>
						<meta name={'title'} content={`Nestar`} />
					</Head>
					<Stack id="mobile-wrap">
						<Stack id={'top'}>
							<Top />
						</Stack>

						<Stack id={'main'}>
							<Component {...props} />
						</Stack>

						<Stack id={'footer'}>
							<Footer />
						</Stack>
					</Stack>
				</>
			);
		} else {
			return (
				<>
					<Head>
						<title>Eclipse</title>
						<meta name={'title'} content={`Nestar`} />
					</Head>
					<Stack id="pc-wrap">
						<Stack id={'top'}>
							<Top />
						</Stack>

						<Stack
							className={'header-main'}
							style={{ backgroundImage: `url('${slides[currentSlide].backgroundImage}')` }}
						>
							<FiberContainer />

							{/* Navigation Buttons */}
							<button className="nav-btn prev-btn" onClick={handlePrevSlide}>
								<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
									<path
										d="M15 18l-6-6 6-6"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
							</button>

							<button className="nav-btn next-btn" onClick={handleNextSlide}>
								<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
									<path
										d="M9 18l6-6-6-6"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
							</button>

							{/* Slide Content */}
							<div className="slide-content">
								<div className="slide-text">
									<div className="slide-brand">{slides[currentSlide].brand}</div>
									<h1 className="slide-title">
										{slides[currentSlide].title}
										<br />
										{slides[currentSlide].subtitle}
									</h1>
									<button className="slide-button" onClick={handleShopNow}>
										{slides[currentSlide].buttonText}
									</button>
								</div>
							</div>

							<Stack className={'container'}>
								<HeaderFilter />
							</Stack>
						</Stack>

						<Stack id={'main'}>
							<Component {...props} />
						</Stack>

						<Chat />

						<Stack id={'footer'}>
							<Footer />
						</Stack>
					</Stack>
				</>
			);
		}
	};
};

export default withLayoutMain;