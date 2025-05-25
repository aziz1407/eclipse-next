import React, { useState } from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import {
	Pagination,
	Stack,
	Typography,
	IconButton,
	Chip,
	Button,
	Box,
	Card,
	CardMedia,
	CardContent,
	Grid,
	Fade,
	Backdrop,
} from '@mui/material';
import { Property } from '../../types/property/property';
import { T } from '../../types/common';
import { useMutation, useQuery } from '@apollo/client';
import { LIKE_TARGET_PROPERTY } from '../../../apollo/user/mutation';
import { GET_FAVORITES } from '../../../apollo/user/query';
import { Messages } from '../../config';
import { sweetMixinErrorAlert } from '../../sweetAlert';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DiamondIcon from '@mui/icons-material/Diamond';

interface FavoriteItemProps {
	property: Property;
	onRemove: (id: string) => void;
	onView: (id: string) => void;
}

const FavoriteItem: React.FC<FavoriteItemProps> = ({ property, onRemove, onView }) => {
	const [isRemoving, setIsRemoving] = useState(false);
	const [isHovered, setIsHovered] = useState(false);

	const handleRemove = async () => {
		setIsRemoving(true);
		try {
			await onRemove(property._id);
		} finally {
			setIsRemoving(false);
		}
	};

	const formatPrice = (price: number) => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			minimumFractionDigits: 0,
		}).format(price);
	};

	return (
		<Fade in={true} timeout={800}>
			<Card
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
				sx={{
					height: '320px',
					position: 'relative',
					borderRadius: '24px',
					overflow: 'hidden',
					background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
					boxShadow: isHovered
						? '0 25px 50px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,215,0,0.2)'
						: '0 8px 32px rgba(0,0,0,0.08)',
					transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
					transform: isHovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
					border: '1px solid rgba(255,255,255,0.8)',
					backdropFilter: 'blur(10px)',
					'&::before': {
						content: '""',
						position: 'absolute',
						top: 0,
						left: 0,
						right: 0,
						height: '4px',
						background: 'linear-gradient(90deg, #FFD700, #FFA500, #FF6B6B, #4ECDC4)',
						opacity: isHovered ? 1 : 0,
						transition: 'opacity 0.3s ease',
					},
				}}
			>
				{/* Heart Icon */}
				<IconButton
					onClick={handleRemove}
					disabled={isRemoving}
					sx={{
						position: 'absolute',
						top: 16,
						left: 16,
						zIndex: 2,
						backgroundColor: 'rgba(255,255,255,0.9)',
						backdropFilter: 'blur(10px)',
						width: 48,
						height: 48,
						transition: 'all 0.3s ease',
						'&:hover': {
							backgroundColor: 'rgba(255,255,255,1)',
							transform: 'scale(1.1)',
						},
					}}
				>
					{isRemoving ? (
						<FavoriteBorderIcon sx={{ color: '#666' }} />
					) : (
						<FavoriteIcon sx={{ color: '#ff4757', fontSize: 24 }} />
					)}
				</IconButton>

				{/* Image Section */}
				<Box
					sx={{
						position: 'relative',
						height: 320,
						overflow: 'hidden',
						cursor: 'pointer',
					}}
					onClick={() => (window.location.href = `/property/detail?id=${property._id}`)}
				>
					<CardMedia
						component="img"
						sx={{
							width: '100%',
							height: '100%',
							objectFit: 'cover',
							transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
							transform: isHovered ? 'scale(1.1)' : 'scale(1)',
						}}
						image={
							property?.propertyImages?.[0]
								? `${process.env.REACT_APP_API_URL}/${property.propertyImages[0]}`
								: '/default-property.jpg'
						}
						alt={(property as any).model || (property as any).propertyModel || 'Property'}
					/>

					{/* Enhanced Gradient Overlay with Property Model */}
					<Box
						sx={{
							position: 'absolute',
							bottom: 0,
							left: 0,
							right: 0,
							height: '100%',
							background: isHovered
								? 'linear-gradient(transparent 30%, rgba(0,0,0,0.4) 70%, rgba(0,0,0,0.8) 100%)'
								: 'transparent',
							opacity: 1,
							transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'flex-end',
							p: 2,
						}}
					>
						{/* Property Model Display on Hover */}
						<Box
							sx={{
								transform: isHovered ? 'translateY(0)' : 'translateY(100%)',
								opacity: isHovered ? 1 : 0,
								transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
								mb: 1.5,
							}}
						>
							<Typography
								variant="h5"
								sx={{
									color: 'white',
									fontWeight: 600,
									textAlign: 'center',
									textShadow: '0 2px 8px rgba(0,0,0,0.6)',
									mb: 0.5,
									fontSize: { xs: '1.1rem', md: '1.3rem' },
									letterSpacing: '0.3px',
								}}
							>
								{(property as any).model || (property as any).propertyModel || 'Premium Property'}
							</Typography>

							{/* Decorative underline */}
							<Box
								sx={{
									width: 50,
									height: 2,
									background: 'linear-gradient(90deg, #FFD700, #FFA500)',
									mx: 'auto',
									borderRadius: '1px',
									opacity: isHovered ? 1 : 0,
									transform: isHovered ? 'scaleX(1)' : 'scaleX(0)',
									transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
									transitionDelay: isHovered ? '0.2s' : '0s',
								}}
							/>
						</Box>

						{/* Enhanced Action Button on Hover */}
						<Box
							sx={{
								transform: isHovered ? 'translateY(0)' : 'translateY(100%)',
								opacity: isHovered ? 1 : 0,
								transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
								transitionDelay: isHovered ? '0.1s' : '0s',
							}}
						>
							<Button
								variant="contained"
								onClick={(e: any) => {
									e.stopPropagation();
									window.location.href = `/property/detail?id=${property._id}`;
								}}
								size="small"
								sx={{
									py: 0.8,
									px: 2.5,
									borderRadius: '8px',
									background: 'rgba(31, 34, 37, 0.9)',
									color: 'white',
									fontSize: '0.85rem',
									fontWeight: 500,
									textTransform: 'none',
									backdropFilter: 'blur(10px)',
									border: '1px solid rgba(255,255,255,0.1)',
									transition: 'all 0.3s ease',
									minWidth: 'auto',
									mx: 'auto',
									display: 'block',
									'&:hover': {
										background: 'goldenrod',
										transform: 'translateY(-1px)',
										boxShadow: '0 4px 15px rgba(44, 62, 80, 0.4)',
									},
								}}
							>
								View Details
							</Button>
						</Box>
					</Box>
				</Box>
			</Card>
		</Fade>
	);
};

const EmptyState = () => (
	<Box
		sx={{
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			justifyContent: 'center',
			minHeight: 500,
			textAlign: 'center',
			py: 8,
			background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
			borderRadius: '32px',
			border: '2px dashed rgba(116, 185, 255, 0.3)',
		}}
	></Box>
);

const MyFavorites: NextPage = () => {
	const device = useDeviceDetect();
	const [myFavorites, setMyFavorites] = useState<Property[]>([]);
	const [total, setTotal] = useState(0);
	const [searchFavorites, setSearchFavorites] = useState({ page: 1, limit: 6 });

	/** APOLLO REQUESTS **/
	const [likeTargetProperty] = useMutation(LIKE_TARGET_PROPERTY);

	const {
		loading: getFavoritesLoading,
		data: getFavoritesData,
		error: getFavoritesError,
		refetch: getFavoritesRefetch,
	} = useQuery(GET_FAVORITES, {
		fetchPolicy: 'network-only',
		variables: {
			input: searchFavorites,
		},
		notifyOnNetworkStatusChange: true,
		onCompleted(data) {
			setMyFavorites(data?.getFavorites?.list || []);
			setTotal(data?.getFavorites?.metaCounter?.[0]?.total || 0);
		},
	});

	/** HANDLERS **/
	const paginationHandler = (e: T, value: number) => {
		setSearchFavorites({ ...searchFavorites, page: value });
	};

	const removeFavoriteHandler = async (propertyId: string) => {
		try {
			await likeTargetProperty({
				variables: {
					input: propertyId,
				},
			});

			// Optimistically update the UI
			setMyFavorites((prev) => prev.filter((prop) => prop._id !== propertyId));
			setTotal((prev) => Math.max(0, prev - 1));

			// Refetch to ensure consistency
			await getFavoritesRefetch({ input: searchFavorites });
		} catch (err: any) {
			console.log('ERROR, removeFavoriteHandler:', err.message);
			await sweetMixinErrorAlert(err.message);
		}
	};

	const viewPropertyHandler = (propertyId: string) => {
		window.open(`/property/${propertyId}`, '_blank');
	};

	if (device === 'mobile') {
		return <div>ECLIPSE MY FAVORITES MOBILE</div>;
	}

	return (
		<Box
			sx={{
				minHeight: 'auto',
				py: 0,
			}}
		>
			<Box sx={{ maxWidth: 1400, mx: 'auto', px: 4 }}>
				{/* Header Section */}
				<Box sx={{ textAlign: 'center', mb: 6 }}>
					<Typography
						variant="h2"
						component="h1"
						sx={{
							fontWeight: 800,
							fontSize: { xs: '1.5rem', md: '1.5rem' },
							mb: 2,
							background: 'linear-gradient(#fafafa)',
							WebkitBackgroundClip: 'text',
							WebkitTextFillColor: 'transparent',
							backgroundClip: 'text',
						}}
					>
						My Favorite Collection
					</Typography>

					<Typography
						variant="h5"
						sx={{
							color: '#636e72',
							fontWeight: 400,
							maxWidth: 600,
							mx: 'auto',
						}}
					>
						{total > 0
							? `${total} exquisite watch${total > 1 ? 'es' : ''} in your current collection`
							: 'Begin your journey to discover exceptional properties'}
					</Typography>
				</Box>

				{/* Content Section */}
				{getFavoritesLoading ? (
					<Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
						<Box sx={{ textAlign: 'center' }}>
							<Typography variant="h5" sx={{ mb: 2, color: '#636e72' }}>
								Loading your luxury collection...
							</Typography>
							<Box
								sx={{
									width: 60,
									height: 60,
									mx: 'auto',
									borderRadius: '50%',
									background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
									animation: 'pulse 2s infinite',
									'@keyframes pulse': {
										'0%': { transform: 'scale(1)', opacity: 1 },
										'50%': { transform: 'scale(1.1)', opacity: 0.7 },
										'100%': { transform: 'scale(1)', opacity: 1 },
									},
								}}
							/>
						</Box>
					</Box>
				) : myFavorites.length > 0 ? (
					<>
						<Grid container spacing={4} sx={{ mb: 6 }}>
							{myFavorites.map((property: Property) => (
								<Grid item xs={12} sm={6} lg={4} key={property._id}>
									<FavoriteItem property={property} onRemove={removeFavoriteHandler} onView={viewPropertyHandler} />
								</Grid>
							))}
						</Grid>

						{/* Pagination */}
						<Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
							<Box
								sx={{
									// background: 'rgba(255,255,255,0.9)',
									backdropFilter: 'blur(10px)',
									borderRadius: '24px',
									p: 2,
									boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
								}}
							>
								<Pagination
									page={searchFavorites.page}
									count={Math.ceil(total / searchFavorites.limit)}
									onChange={paginationHandler}
									size="large"
									showFirstButton
									showLastButton
									sx={{
										'& .MuiPaginationItem-root': {
											fontWeight: 600,
											color: '#fff',
										},
									}}
								/>
							</Box>
						</Box>
					</>
				) : (
					<EmptyState />
				)}
			</Box>
		</Box>
	);
};

export default MyFavorites;
