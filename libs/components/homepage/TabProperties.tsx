import React, { useState } from 'react';
import { Stack, Box, Tabs, Tab } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Property } from '../../types/property/property';
import Link from 'next/link';
import { PropertiesInquiry } from '../../types/property/property.input';
import { GET_PROPERTIES } from '../../../apollo/user/query';
import { useQuery, useMutation } from '@apollo/client';
import { T } from '../../types/common';
import { Direction } from '../../enums/common.enum';
import { useRouter } from 'next/router';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { REACT_APP_API_URL } from '../../config';
import { LIKE_TARGET_PROPERTY } from '../../../apollo/user/mutation';
import { sweetTopSmallSuccessAlert, sweetMixinErrorAlert } from '../../sweetAlert';

interface PopularPropertiesProps {
	initialInput: PropertiesInquiry;
}

const tabLabels = ['Latest', 'Favorites', 'Bestselling'];

const sortDirections: Record<string, PropertiesInquiry> = {
	Latest: { page: 1, limit: 6, sort: 'createdAt', direction: Direction.DESC, search: {} },
	Favorites: { page: 1, limit: 6, sort: 'propertyLikes', direction: Direction.DESC, search: {} },
	Bestselling: { page: 1, limit: 6, sort: 'propertyViews', direction: Direction.DESC, search: {} },
};

const TabProperties = (props: PopularPropertiesProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const [tabIndex, setTabIndex] = useState(0);
	const [popularProperties, setPopularProperties] = useState<Property[]>([]);
	const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
	const router = useRouter();
	const [likeTargetProperty] = useMutation(LIKE_TARGET_PROPERTY);

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

	const likePropertyHandler = async (propertyId: string) => {
		try {
			if (!propertyId) return;
			await likeTargetProperty({ variables: { input: propertyId } });
			await getPropertiesRefetch({ input: currentSort });
			await sweetTopSmallSuccessAlert('Liked!', 800);
		} catch (err: any) {
			console.log('ERROR, likePropertyHandler', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	if (!popularProperties) return null;

	return (
		<Stack className="popular-properties">
			<Stack className="container">
				<Tabs
					value={tabIndex}
					onChange={handleTabChange}
					className="popular-tab-header"
					TabIndicatorProps={{ style: { display: 'none' } }}
				>
					{tabLabels.map((label, index) => (
						<Tab key={index} label={label} disableRipple className="popular-tab" />
					))}
				</Tabs>

				<Stack className="card-box">
					<div className="popular-property-grid">
						{popularProperties.map((property: Property, index: number) => (
							<Stack key={property._id} className="popular-card-box">
								<Box
									className="card-img"
									sx={{
										backgroundImage: `url(${REACT_APP_API_URL}/${property?.propertyImages[0]})`,
										'&:hover': {
											backgroundImage:
												property.propertyImages.length > 1
													? `url(${REACT_APP_API_URL}/${property?.propertyImages[1]})`
													: `url(${REACT_APP_API_URL}/${property?.propertyImages[0]})`,
										},
									}}
									onClick={() => pushDetailHandler(property._id)}
									onMouseEnter={() => setHoveredIndex(index)}
									onMouseLeave={() => setHoveredIndex(null)}
								>
									{hoveredIndex === index && (
										<>
											{property.propertyBrand && <span className="brand-tag">{property.propertyBrand}</span>}
											<button
												className="like-button"
												onClick={(e) => {
													e.stopPropagation();
													likePropertyHandler(property._id);
												}}
											>
												{property?.meLiked && property?.meLiked[0]?.myFavorite ? (
													<FavoriteIcon sx={{ color: 'red' }} />
												) : (
													<FavoriteBorderIcon sx={{ color: 'black' }} />
												)}
											</button>
											<div className="property-stats">
												{tabLabels[tabIndex] === 'Latest' && (
													<span>{new Date(property.createdAt).toLocaleDateString()}</span>
												)}
												{tabLabels[tabIndex] === 'Favorites' && <span>{property.propertyLikes} likes</span>}
												{tabLabels[tabIndex] === 'Bestselling' && <span>{property.propertyViews} views</span>}
											</div>
											<button
												className="eye-button"
												onClick={(e) => {
													e.stopPropagation();
													pushDetailHandler(property._id);
												}}
											>
												<RemoveRedEyeIcon sx={{ color: 'black' }} />
											</button>
										</>
									)}
								</Box>

								<Box className="property-details">
									<h3 onClick={() => pushDetailHandler(property._id)}>{property.propertyModel}</h3>
									<p className="price">${property.propertyPrice.toLocaleString()}</p>
								</Box>
							</Stack>
						))}
					</div>
				</Stack>

				<div className="show-more-container">
					<Link href="/property">
						<button className="show-more-button">EXPLORE MORE</button>
					</Link>
				</div>
			</Stack>

			<style jsx global>{`
				.popular-properties {
					padding: 80px 0;
					background-color: #090a0c;
					color: #fafafa;
				}

				.popular-properties .container {
					width: 100%;
					max-width: 1200px;
					margin: 0 auto;
					padding: 0 20px;
				}

				.popular-tab-header {
					margin-bottom: 40px;
				}

				.card-box {
					margin-bottom: 50px;
				}

				.popular-property-grid {
					display: grid;
					grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
					gap: 25px;
				}

				.popular-card-box {
					position: relative;
					transition: transform 0.3s ease;
				}

				.popular-card-box:hover {
					transform: translateY(-5px);
				}

				.card-img {
					position: relative;
					height: 300px;
					background-size: cover;
					background-position: center;
					cursor: pointer;
					border-radius: 8px;
					overflow: hidden;
					transition: all 0.4s ease;
					box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
				}

				.card-img:hover {
					box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
				}

				.brand-tag {
					position: absolute;
					top: 15px;
					left: 15px;
					padding: 4px 12px;
					border-radius: 20px;
					font-size: 12px;
					font-weight: 600;
					background-color: rgba(0, 0, 0, 0.7);
					color: #fff;
					backdrop-filter: blur(2px);
				}

				.like-button {
					position: absolute;
					top: 15px;
					right: 15px;
					background: rgba(243, 241, 241, 0.5);
					border: none;
					border-radius: 50%;
					width: 36px;
					height: 36px;
					display: flex;
					align-items: center;
					justify-content: center;
					cursor: pointer;
					transition: all 0.3s ease;
					z-index: 2;
				}

				.like-button:hover {
					background: rgba(255, 255, 255, 0.2);
					transform: scale(1.1);
				}

				.eye-button {
					position: absolute;
					bottom: 10px;
					left: 15px;
					background: rgba(243, 241, 241, 0.5);
					border: none;
					border-radius: 50%;
					width: 36px;
					height: 36px;
					display: flex;
					align-items: center;
					justify-content: center;
					cursor: pointer;
					transition: all 0.3s ease;
					z-index: 2;
				}

				.eye-button:hover {
					background: rgba(255, 255, 255, 0.2);
					transform: scale(1.1);
				}

				.property-stats {
					position: absolute;
					bottom: 15px;
					right: 15px;
					background-color: rgba(0, 0, 0, 0.7);
					padding: 6px 12px;
					border-radius: 20px;
					font-size: 12px;
					font-weight: 600;
					color: #fff;
					backdrop-filter: blur(2px);
				}

				.property-details {
					padding: 15px 5px;
					text-align: center;
				}

				.property-details h3 {
					margin: 0;
					font-size: 16px;
					font-weight: 600;
					color: #fafafa;
					cursor: pointer;
					transition: color 0.3s ease;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}

				.property-details h3:hover {
					color: goldenrod;
				}

				.price {
					margin: 8px 0 0;
					font-size: 16px;
					font-weight: 600;
					color: goldenrod;
				}

				.show-more-button {
					padding: 12px 30px;
					background-color: transparent;
					color: goldenrod;
					font-size: 14px;
					font-weight: 600;
					border: 2px solid goldenrod;
					border-radius: 4px;
					cursor: pointer;
					transition: all 0.3s ease;
					text-transform: uppercase;
					letter-spacing: 1px;
				}

				.show-more-button:hover {
					background-color: goldenrod;
					color: #000;
					transform: translateY(-2px);
					box-shadow: 0 5px 15px rgba(218, 165, 32, 0.3);
				}

				@media (max-width: 768px) {
					.popular-property-grid {
						grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
					}

					.card-img {
						height: 250px;
					}
				}
			`}</style>
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
