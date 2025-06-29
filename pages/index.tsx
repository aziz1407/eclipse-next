import { useEffect, useState } from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../libs/hooks/useDeviceDetect';
import withLayoutMain from '../libs/components/layout/LayoutHome';
import CommunityBoards from '../libs/components/homepage/CommunityBoards';
import TopAgents from '../libs/components/homepage/TopAgents';
import TabProperties from '../libs/components/homepage/TabProperties';
import Category from '../libs/components/homepage/Category';
import Advertisement from '../libs/components/homepage/Advertisement';
import SpecialOffers from '../libs/components/homepage/SpecialOffers';
import { Stack } from '@mui/material';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import AOS from 'aos';
import 'aos/dist/aos.css';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const Home: NextPage = () => {
	const device = useDeviceDetect();
	const [showLoader, setShowLoader] = useState(true);

	useEffect(() => {
		AOS.init({
			duration: 1200,
			easing: 'ease-out-cubic',
			once: true,
			mirror: false,
			offset: 120,
			delay: 20,
			anchorPlacement: 'top-bottom',
		});

		const handlePageLoad = () => {
			setShowLoader(false);
			setTimeout(() => {
				AOS.refresh();
			}, 300);
		};

		// Hide loader after page loads or maximum 1.5 seconds
		const timeout = setTimeout(() => {
			setShowLoader(false);
		}, 1500);

		if (document.readyState === 'complete') {
			handlePageLoad();
			clearTimeout(timeout);
		} else {
			window.addEventListener('load', () => {
				handlePageLoad();
				clearTimeout(timeout);
			});
		}

		return () => {
			clearTimeout(timeout);
			window.removeEventListener('load', handlePageLoad);
		};
	}, []);

	const Content = (
		<Stack className="home-page">
			<div data-aos="fade-up" data-aos-delay="0">
				<SpecialOffers />
			</div>
			<div data-aos="fade-up" data-aos-delay="100">
				<Category />
			</div>
			<div data-aos="fade-up" data-aos-delay="200">
				<Advertisement />
			</div>
			<div data-aos="fade-up" data-aos-delay="300">
				<TabProperties />
			</div>
			<div data-aos="fade-up" data-aos-delay="400">
				<TopAgents />
			</div>
			<div data-aos="fade-up" data-aos-delay="500">
				<CommunityBoards />
			</div>
		</Stack>
	);

	return (
		<>
			{showLoader && (
				<div className="page-loader">
					<div className="loader-content">
						<div className="animated-watch">
							<svg width="110" height="110" viewBox="0 0 100 100">
								<circle cx="50" cy="50" r="48" stroke="#333" strokeWidth="4" fill="#fff" />
								<circle cx="50" cy="50" r="3" fill="#000" />
								<line
									className="second-hand"
									x1="50"
									y1="50"
									x2="50"
									y2="15"
									stroke="#d00"
									strokeWidth="2"
								>
									<animateTransform
										attributeName="transform"
										type="rotate"
										from="0 50 50"
										to="360 50 50"
										dur="2s"
										repeatCount="indefinite"
									/>
								</line>
								<line x1="50" y1="50" x2="50" y2="30" stroke="#000" strokeWidth="4" />
								<line x1="50" y1="50" x2="50" y2="20" stroke="#000" strokeWidth="3" />
							</svg>
						</div>
						<div className="dots">
							<span>.</span>
							<span>.</span>
							<span>.</span>
							<span>.</span>
							<span>.</span>
						</div>
					</div>
				</div>
			)}

			{!showLoader &&
				(device === 'mobile' ? (
					<Stack className="home-page">
						<SpecialOffers />
						<Category />
						<TabProperties />
						<Advertisement />
						<TopAgents />
						<CommunityBoards />
					</Stack>
				) : (
					Content
				))}

			<style jsx>{`
				.page-loader {
					position: fixed;
					top: 0;
					left: 0;
					z-index: 9999;
					width: 100%;
					height: 100vh;
					background-color: #fff;
					display: flex;
					align-items: center;
					justify-content: center;
					opacity: ${showLoader ? '1' : '0'};
					transition: opacity 0.3s ease-out;
				}

				.loader-content {
					display: flex;
					flex-direction: row;
					align-items: center;
					gap: 20px;
				}

				.animated-watch {
					width: 110px;
					height: 110px;
					display: flex;
					align-items: center;
					justify-content: center;
				}

				.dots {
					display: flex;
					gap: 6px;
				}

				.dots span {
					font-size: 54px;
					font-weight: bold;
					color: #333;
					animation: blink 1.4s infinite;
				}

				.dots span:nth-child(2) {
					animation-delay: 0.2s;
				}
				.dots span:nth-child(3) {
					animation-delay: 0.4s;
				}
				.dots span:nth-child(4) {
					animation-delay: 0.6s;
				}
				.dots span:nth-child(5) {
					animation-delay: 0.8s;
				}

				@keyframes blink {
					0%,
					80%,
					100% {
						opacity: 0;
					}
					40% {
						opacity: 1;
					}
				}
			`}</style>
		</>
	);
};

export default withLayoutMain(Home);