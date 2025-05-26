import React from 'react';
import { Stack, Box, Divider, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Property } from '../../types/property/property';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { REACT_APP_API_URL } from '../../config';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';

interface SpecialOfferCardProps {
	property: Property;
	likePropertyHandler: any;
}

const SpecialOfferCard = (props: SpecialOfferCardProps) => {
	const { property, likePropertyHandler } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);

	// Calculate 10% discount
	const originalPrice = property.propertyPrice;
	const discountedPrice = Math.round(originalPrice * 0.9);

	/** HANDLERS **/
	const pushDetailHandler = async (propertyId: string) => {
		console.log('ID', propertyId);
		await router.push({ pathname: '/property/detail', query: { id: propertyId } });
	};

	return (
		<Box className="deal-card">
			<Box className="deal-card-image" onClick={() => pushDetailHandler(property._id)}>
				<div className="discount-badge">-10%</div>
				<img
					src={`${process.env.REACT_APP_API_URL}/${property?.propertyImages[0]}`}
					alt={property.propertyModel}
					className="product-image"
				/>
				{property?.propertyImages[1] && (
					<img
						src={`${process.env.REACT_APP_API_URL}/${property?.propertyImages[1]}`}
						alt="Hover"
						className="hover-image"
					/>
				)}
			</Box>

			<Box className="deal-card-content">
				<Box className="top-line">
					<Box className="title-brand">
						<h3 className="product-title">{property.propertyModel}</h3>
						<p className="product-brand">{property.propertyBrand}</p>
					</Box>
					<Box className="price-stack">
						<span className="current-price">${discountedPrice}</span>
						<span className="original-price">${originalPrice}</span>
					</Box>
				</Box>
			</Box>

			<Box className="card-actions">
				<IconButton
					className="like-button"
					onClick={(e: any) => {
						e.stopPropagation();
						likePropertyHandler(user, property._id);
					}}
				>
					{property?.meLiked && property?.meLiked[0]?.myFavorite ? (
						<BookmarkIcon className="liked-icon" />
					) : (
						<BookmarkBorderIcon className="like-icon" />
					)}
				</IconButton>
			</Box>
		</Box>
	);
};

export default SpecialOfferCard;
