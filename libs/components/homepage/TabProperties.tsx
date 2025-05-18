import React, { useState } from 'react';
import { Stack, Box, Tabs, Tab, Divider, Typography, IconButton } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Property } from '../../types/property/property';
import Link from 'next/link';
import { PropertiesInquiry } from '../../types/property/property.input';
import { GET_PROPERTIES } from '../../../apollo/user/query';
import { useQuery } from '@apollo/client';
import { T } from '../../types/common';
import { Direction } from '../../enums/common.enum';
import { useRouter } from 'next/router';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { REACT_APP_API_URL, topPropertyRank } from '../../config';

interface PopularPropertiesProps {
	initialInput: PropertiesInquiry;
}

const tabLabels = ['New Arrivals', 'Most Viewed', 'Top Favored'];

const sortDirections: Record<string, PropertiesInquiry> = {
	'New Arrivals': { page: 1, limit: 6, sort: 'createdAt', direction: Direction.DESC, search: {} },
	'Most Viewed': { page: 1, limit: 6, sort: 'propertyViews', direction: Direction.DESC, search: {} },
	'Top Favored': { page: 1, limit: 6, sort: 'propertyLikes', direction: Direction.DESC, search: {} },
};

const TabProperties = (props: PopularPropertiesProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const [tabIndex, setTabIndex] = useState(0);
	const [popularProperties, setPopularProperties] = useState<Property[]>([]);
	const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
	const router = useRouter();

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

	const pushDetailHandler = async (propertyId: string) => {
		await router.push({ pathname: '/property/detail', query: { id: propertyId } });
	};

	if (!popularProperties) return null;

	return (
		<Stack className={'popular-properties'}>
			<Stack className={'container'}>
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
					<div className="popular-property-grid">
						{popularProperties.map((property: Property, index: number) => (
							<Stack key={property._id} className="popular-card-box">
								<Box
									component={'div'}
									className={'card-img'}
									style={{
										backgroundImage:
											hoveredIndex === index && property.propertyImages.length > 1
												? `url(${REACT_APP_API_URL}/${property?.propertyImages[1]})`
												: `url(${REACT_APP_API_URL}/${property?.propertyImages[0]})`,
												transition: "background-image 0.3s ease-in-out"
									}}
									onClick={() => pushDetailHandler(property._id)}
									onMouseEnter={() => setHoveredIndex(index)}
									onMouseLeave={() => setHoveredIndex(null)}
								>
									{hoveredIndex === index && property?.propertyRank >= topPropertyRank && (
										<div className={'status'}>
											<img src="/img/icons/electricity.svg" alt="" />
											<span>top</span>
										</div>
									)}

									{hoveredIndex === index && property.propertyBrand && (
										<div className="condition-tag">{property.propertyBrand}</div>
									)}

									{hoveredIndex === index && (
										<div
											style={{
												position: 'absolute',
												bottom: '10px',
												left: tabLabels[tabIndex] === "New Arrivals" ? '75%' : '80%',
												backgroundColor: 'rgba(0, 0, 0, 0.7)',
												padding: '4px 10px',
												borderRadius: '6px',
												fontSize: '12px',
												fontWeight: 600,
												color: '#fff',
												boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
												transition: 'all 0.3s ease-in-out',
												pointerEvents: 'none',
											}}
										>
											{tabLabels[tabIndex] === 'New Arrivals' && new Date(property.createdAt).toLocaleDateString()}
											{tabLabels[tabIndex] === 'Most Viewed' && `${property.propertyViews} views`}
											{tabLabels[tabIndex] === 'Top Favored' && `${property.propertyLikes} likes`}
										</div>
									)}
								</Box>

								<Box component="div" className="property-details">
									<strong className="title" onClick={() => pushDetailHandler(property._id)}>
										{property.propertyModel}
									</strong>
									<p className="price">${property.propertyPrice}</p>
								</Box>
							</Stack>
						))}
					</div>
				</Stack>

				<div className="show-more-container">
					<Link href="/property">
						<button className="show-more-button">SEE ALL</button>
					</Link>
				</div>
			</Stack>
		</Stack>
	);
};

TabProperties.defaultProps = {
	initialInput: {
		page: 1,
		limit: 6,
		sort: 'propertyViews',
		direction: 'DESC',
		search: {},
	},
};

export default TabProperties;
