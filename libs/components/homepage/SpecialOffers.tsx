import React, { useEffect, useState } from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import { Property } from '../../types/property/property';
import { PropertiesInquiry } from '../../types/property/property.input';
import SpecialOfferCard from './SpecialOfferCard';
import { useMutation, useQuery } from '@apollo/client';
import { GET_PROPERTIES } from '../../../apollo/user/query';
import { T } from '../../types/common';
import { LIKE_TARGET_PROPERTY } from '../../../apollo/user/mutation';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';
import { Message } from '../../enums/common.enum';

interface SpecialOfferProps {
	initialInput: PropertiesInquiry;
}

const SpecialOffers = (props: SpecialOfferProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const [trendProperties, setTrendProperties] = useState<Property[]>([]);

	/** APOLLO REQUESTS **/
	const [likeTargetProperty] = useMutation(LIKE_TARGET_PROPERTY);

	const {
		loading: getPropertiesLoading,
		data: getPropertiesData,
		error: getPropertiesError,
		refetch: getPropertiesRefetch,
	} = useQuery(GET_PROPERTIES, {
		fetchPolicy: 'cache-and-network',
		variables: { input: initialInput },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setTrendProperties(data?.getProperties?.list);
		},
	});

	const CountdownTimer = ({ endDate }: { endDate: string }) => {
		const [timeLeft, setTimeLeft] = useState('');

		useEffect(() => {
			const updateTimer = () => {
				const now = new Date().getTime();
				const end = new Date(endDate).getTime();
				const diff = end - now;

				if (diff <= 0) {
					setTimeLeft('00 : 00 : 00 : 00');
					return;
				}

				const days = Math.floor(diff / (1000 * 60 * 60 * 24));
				const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
				const minutes = Math.floor((diff / (1000 * 60)) % 60);
				const seconds = Math.floor((diff / 1000) % 60);

				const formatNumber = (num: number) => num.toString().padStart(2, '0');
				setTimeLeft(`${formatNumber(days)} : ${formatNumber(hours)} : ${formatNumber(minutes)} : ${formatNumber(seconds)}`);
			};

			updateTimer();
			const interval = setInterval(updateTimer, 1000);

			return () => clearInterval(interval);
		}, [endDate]);

		return (
			<div className="countdown-timer">
				<span className="timer-label">Ends in:</span>
				<span className="timer-display">{timeLeft}</span>
			</div>
		);
	};

	/** HANDLERS **/
	const likePropertyHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);
			//execute likePropertyHandler Mutation
			await likeTargetProperty({ variables: { input: id } });

			//execute getPropertiesRefetch
			await getPropertiesRefetch({ input: initialInput });

			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			console.log('ERROR, likePropertyHandler', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	if (!trendProperties) return null;

	if (device === 'mobile') {
		return (
			<Box className="deals-section">
				<Box className="deals-container">
					<Box className="deals-header">
						<h2 className="deals-title">Today's Deals</h2>
						<CountdownTimer endDate="2025-05-31T23:59:59Z" />
					</Box>
					
					<Box className="deals-content">
						{trendProperties.length === 0 ? (
							<Box className="empty-deals">
								Deals Empty
							</Box>
						) : (
							<Swiper
								className="deals-swiper"
								slidesPerView="auto"
								spaceBetween={20}
								modules={[Autoplay]}
								autoplay={{
									delay: 3000,
									disableOnInteraction: false,
								}}
							>
								{trendProperties.map((property: Property) => (
									<SwiperSlide key={property._id} className="deal-slide">
										<SpecialOfferCard 
											property={property} 
											likePropertyHandler={likePropertyHandler} 
										/>
									</SwiperSlide>
								))}
							</Swiper>
						)}
					</Box>
				</Box>
			</Box>
		);
	} else {
		return (
			<Box className="deals-section">
				<Box className="deals-container">
					<Box className="deals-header">
						<Box className="header-left">
							<h2 className="deals-title">Today's Deals</h2>
							<CountdownTimer endDate="2025-06-06T23:59:59Z"/>
						</Box>
						<Box className="header-right">
							<Box className="navigation-controls">
								<button className="nav-btn prev-btn">
									<WestIcon />
								</button>
								<div className="pagination-dots"></div>
								<button className="nav-btn next-btn">
									<EastIcon />
								</button>
							</Box>
						</Box>
					</Box>
					
					<Box className="deals-content">
						{trendProperties.length === 0 ? (
							<Box className="empty-deals">
								Deals Empty
							</Box>
						) : (
							<Swiper
								className="deals-swiper"
								slidesPerView={4}
								spaceBetween={20}
								modules={[Navigation, Pagination, Autoplay]}
								navigation={{
									nextEl: '.next-btn',
									prevEl: '.prev-btn',
								}}

								autoplay={{
									delay: 4000,
									disableOnInteraction: false,
								}}
								breakpoints={{
									
								}}
							>
								{trendProperties.map((property: Property) => (
									<SwiperSlide key={property._id} className="deal-slide">
										<SpecialOfferCard 
											property={property} 
											likePropertyHandler={likePropertyHandler} 
										/>
									</SwiperSlide>
								))}
							</Swiper>
						)}
					</Box>
				</Box>
			</Box>
		);
	}
};

SpecialOffers.defaultProps = {
	initialInput: {
		page: 1,
		limit: 10,
		sort: 'propertyPrice',
		direction: 'ASC',
		search: {},
	},
};

export default SpecialOffers;