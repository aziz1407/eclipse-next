import React, { useEffect, useState } from 'react';
import { Stack, Box } from '@mui/material';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import { useMutation, useQuery } from '@apollo/client';
import { useTranslation } from 'next-i18next';

import useDeviceDetect from '../../hooks/useDeviceDetect';
import SpecialOfferCard from './SpecialOfferCard';

import { GET_PROPERTIES } from '../../../apollo/user/query';
import { LIKE_TARGET_PROPERTY } from '../../../apollo/user/mutation';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';
import { Message } from '../../enums/common.enum';
import { Property } from '../../types/property/property';
import { PropertiesInquiry } from '../../types/property/property.input';
import { T } from '../../types/common';

interface SpecialOfferProps {
	initialInput: PropertiesInquiry;
}

const SpecialOffers = (props: SpecialOfferProps) => {
	const { t } = useTranslation('common');
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
				<span className="timer-label">{t('Ends in')}:</span>
				<span className="timer-display">{timeLeft}</span>
			</div>
		);
	};

	/** HANDLERS **/
	const likePropertyHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);
			await likeTargetProperty({ variables: { input: id } });
			await getPropertiesRefetch({ input: initialInput });
			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			console.log('ERROR, likePropertyHandler', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	if (!trendProperties) return null;

	const renderSwiper = () => (
		<Swiper
			className="deals-swiper"
			slidesPerView={device === 'mobile' ? 'auto' : 4}
			spaceBetween={20}
			modules={[Navigation, Pagination, Autoplay]}
			navigation={device === 'mobile' ? undefined : {
				nextEl: '.next-btn',
				prevEl: '.prev-btn',
			}}
			autoplay={{
				delay: device === 'mobile' ? 3000 : 4000,
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
	);

	return (
		<Box className="deals-section">
			<Box className="deals-container">
				<Box className="deals-header">
					{device === 'mobile' ? (
						<>
							<h2 className="deals-title">{t("Hot Deals")}</h2>
							<CountdownTimer endDate="2025-05-31T23:59:59Z" />
						</>
					) : (
						<>
							<Box className="header-left">
								<h2 className="deals-title">{t("Hot Deals")}</h2>
								<CountdownTimer endDate="2025-06-10T23:59:59Z" />
							</Box>
							<Box className="header-right">
								<Box className="navigation-controls">
									<button className="nav-btn prev-btn"><WestIcon /></button>
									<div className="pagination-dots"></div>
									<button className="nav-btn next-btn"><EastIcon /></button>
								</Box>
							</Box>
						</>
					)}
				</Box>

				<Box className="deals-content">
					{trendProperties.length === 0 ? (
						<Box className="empty-deals">
							{t('Deals Empty')}
						</Box>
					) : (
						renderSwiper()
					)}
				</Box>
			</Box>
		</Box>
	);
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
