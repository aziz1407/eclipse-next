import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import {
	Typography,
	Button,
	Box,
	Card,
	CardMedia,
	CircularProgress,
	Stack,
	Grid,
	Fade,
	IconButton,
	Pagination,
} from '@mui/material';
import { Property } from '../../types/property/property';
import { useQuery } from '@apollo/client';
import { GET_VISITED } from '../../../apollo/user/query';
import { T } from '../../types/common';
import { sweetMixinErrorAlert } from '../../sweetAlert';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DiamondIcon from '@mui/icons-material/Diamond';

interface VisitedItemProps {
	property: Property;
}

const VisitedItem: React.FC<VisitedItemProps> = ({ property }) => {
	const [isHovered, setIsHovered] = useState(false);

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
	>
		<AccessTimeIcon sx={{ fontSize: 80, color: '#74b9ff', mb: 2, opacity: 0.7 }} />
		<Typography variant="h5" sx={{ color: '#636e72', fontWeight: 600, mb: 1 }}>
			No Recently Visited Properties
		</Typography>
		<Typography variant="body1" sx={{ color: '#636e72', maxWidth: 400, mb: 3, lineHeight: 1.6 }}>
			Start exploring properties to see your recently visited items here. Your browsing history will help you keep track of interesting properties.
		</Typography>
		<Button 
			variant="contained" 
			size="large"
			sx={{
				borderRadius: '16px',
				background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
				fontSize: '1.1rem',
				fontWeight: 600,
				textTransform: 'none',
				py: 1.5,
				px: 4,
				boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
				transition: 'all 0.3s ease',
				'&:hover': {
					background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
					transform: 'translateY(-2px)',
					boxShadow: '0 12px 40px rgba(102, 126, 234, 0.4)',
				},
			}}
			onClick={() => window.location.href = '/property/list'}
		>
			Browse Properties
		</Button>
	</Box>
);

const RecentlyVisited: NextPage = () => {
	const device = useDeviceDetect();
	const [recentlyVisited, setRecentlyVisited] = useState<Property[]>([]);
	const [total, setTotal] = useState(0);
	const [searchVisited, setSearchVisited] = useState({ page: 1, limit: 6 });

	/** APOLLO REQUESTS **/
	const {
		loading: getVisitedLoading,
		data: getVisitedData,
		error: getVisitedError,
		refetch: getVisitedRefetch,
	} = useQuery(GET_VISITED, {
		fetchPolicy: 'network-only',
		variables: {
			input: searchVisited,
		},
		notifyOnNetworkStatusChange: true,
		onCompleted(data) {
			setRecentlyVisited(data?.getVisited?.list || []);
			setTotal(data?.getVisited?.metaCounter?.[0]?.total || 0);
		},
	});

	/** HANDLERS **/
	const paginationHandler = (e: T, value: number) => {
		setSearchVisited({ ...searchVisited, page: value });
	};

	if (device === 'mobile') {
		return <div>ECLIPSE RECENTLY VISITED MOBILE</div>;
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
						Recently Visited Collection
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
							? `${total} recently viewed watch${total > 1 ? 'es' : ''} in your browsing history`
							: 'Your recently viewed watches will appear here'}
					</Typography>
				</Box>

				{/* Content Section */}
				{getVisitedLoading ? (
					<Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
						<Box sx={{ textAlign: 'center' }}>
							<Typography variant="h5" sx={{ mb: 2, color: '#636e72' }}>
								Loading your recently viewed watches...
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
				) : recentlyVisited.length > 0 ? (
					<>
						<Grid container spacing={4} sx={{ mb: 6 }}>
							{recentlyVisited.map((property: Property) => (
								<Grid item xs={12} sm={6} lg={4} key={property._id}>
									<VisitedItem property={property} />
								</Grid>
							))}
						</Grid>

						{/* Pagination */}
						<Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
							<Box
								sx={{
									backdropFilter: 'blur(10px)',
									borderRadius: '24px',
									p: 2,
									boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
								}}
							>
								<Pagination 
									page={searchVisited.page}
									count={Math.ceil(total / searchVisited.limit)}
									onChange={paginationHandler}
									size="large"
									showFirstButton
									showLastButton
									sx={{
										'& .MuiPaginationItem-root': {
											fontWeight: 600,
											color: "#fff"
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

export default RecentlyVisited;