import React, { useState, useEffect } from 'react';
import { Stack, Box, Tabs, Tab } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import PopularPropertyCard from './PopularPropertyCard';
import { Property } from '../../types/property/property';
import Link from 'next/link';
import { PropertiesInquiry } from '../../types/property/property.input';
import { GET_PROPERTIES } from '../../../apollo/user/query';
import { useQuery } from '@apollo/client';
import { T } from '../../types/common';
import { Direction } from '../../enums/common.enum';

interface PopularPropertiesProps {
	initialInput: PropertiesInquiry;
}

const tabLabels = ['New Arrivals', 'Best Sellers', 'Top Rates'];

const sortDirections: Record<string, PropertiesInquiry> = {
	'New Arrivals': { page: 1, limit: 7, sort: 'createdAt', direction: Direction.DESC, search: {} },
	'Best Sellers': { page: 1, limit: 7, sort: 'propertyViews', direction: Direction.DESC , search: {} },
	'Top Rates': { page: 1, limit: 7, sort: 'propertyLikes', direction: Direction.ASC, search: {} },
};

const PopularProperties = (props: PopularPropertiesProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const [tabIndex, setTabIndex] = useState(0);
	const [popularProperties, setPopularProperties] = useState<Property[]>([]);

	const currentTabLabel = tabLabels[tabIndex];
	const currentSort = sortDirections[currentTabLabel];

	const {
		loading: getPropertiesLoading,
		data: getPropertiesData,
		error: getPropertiesError,
		refetch: getPropertiesRefetch,
	} = useQuery(GET_PROPERTIES, {
		fetchPolicy: 'cache-and-network',
		variables: { input: currentSort },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setPopularProperties(data?.getProperties?.list);
		},
	});

	const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
		setTabIndex(newValue);
	};

	if (!popularProperties) return null;

	return (
		<Stack className={'popular-properties'}>
			<Stack className={'container'}>
				<Stack className={'info-box'}>
					<Box component={'div'} className={'left'}>
						<span>Popular properties</span>
						<p>Popularity is based on views</p>
					</Box>
					<Box component={'div'} className={'right'}>
						<div className={'more-box'}>
							<Link href={'/property'}>
								<span>See All Categories</span>
							</Link>
							<img src="/img/icons/rightup.svg" alt="" />
						</div>
					</Box>
				</Stack>

				<Tabs
					value={tabIndex}
					onChange={handleTabChange}
					className={'popular-tab-header'}
					variant="scrollable"
					scrollButtons="auto"
					allowScrollButtonsMobile
				>
					{tabLabels.map((label, index) => (
						<Tab key={index} label={label} className="popular-tab" />
					))}
				</Tabs>

				<Stack className={'card-box'}>
					<Swiper
						className={'popular-property-swiper'}
						slidesPerView={'auto'}
						spaceBetween={25}
						modules={[Autoplay, Navigation, Pagination]}
						navigation={{
							nextEl: '.swiper-popular-next',
							prevEl: '.swiper-popular-prev',
						}}
						pagination={{
							el: '.swiper-popular-pagination',
						}}
					>
						{popularProperties.map((property: Property) => (
							<SwiperSlide key={property._id} className={'popular-property-slide'}>
								<PopularPropertyCard property={property} />
							</SwiperSlide>
						))}
					</Swiper>
				</Stack>

				<Stack className={'pagination-box'}>
					<WestIcon className={'swiper-popular-prev'} />
					<div className={'swiper-popular-pagination'}></div>
					<EastIcon className={'swiper-popular-next'} />
				</Stack>
			</Stack>
		</Stack>
	);
};

PopularProperties.defaultProps = {
	initialInput: {
		page: 1,
		limit: 7,
		sort: 'propertyViews',
		direction: 'DESC',
		search: {},
	},
};

export default PopularProperties;
