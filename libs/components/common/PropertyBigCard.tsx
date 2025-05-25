import React from 'react';
import { Stack, Box, Divider, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import FavoriteIcon from '@mui/icons-material/Favorite';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { Property } from '../../types/property/property';
import { REACT_APP_API_URL, topPropertyRank } from '../../config';
import { formatterStr } from '../../utils';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { useRouter } from 'next/router';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

interface PropertyBigCardProps {
	property: Property;
	likePropertyHandler?: any;
	myFavorites?: boolean;
}

const PropertyBigCard = (props: PropertyBigCardProps) => {
	const { property, likePropertyHandler } = props;
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const router = useRouter();

	/** HANDLERS **/
	const goPropertyDetailPage = (propertyId: string) => {
		router.push(`/property/detail?id=${propertyId}`);
	};

	if (device === 'mobile') {
		return <div>APARTMENT BIG CARD</div>;
	} else {
		return (
			<Stack className="property-big-card-box">
				<Box
					component={'div'}
					className={'card-img'}
					style={{ backgroundImage: `url(${REACT_APP_API_URL}/${property?.propertyImages?.[0]})` }}
					onClick={() => goPropertyDetailPage(property?._id)}
				>
					<div className={'price'}>${formatterStr(property?.propertyPrice)}</div>
				</Box>
				<Box component={'div'} className={'info'}>
					<Typography 
						className={'title'} 
						onClick={() => goPropertyDetailPage(property?._id)}
					>
						{property?.propertyModel}
					</Typography>
					<Typography className={'desc'}>{property?.propertyBrand}</Typography>
					
					<div className={'bott'}>
  <div className="buttons-box">
    {/* Views */}
    <IconButton className="view-button">
      <RemoveRedEyeIcon />
    </IconButton>
    <Typography className="view-cnt">{property?.propertyViews}</Typography>

    {/* Likes */}
    <IconButton
      className="like-button"
      onClick={(e: any) => {
        e.stopPropagation();
        likePropertyHandler(user, property?._id);
      }}
    >
      {property?.meLiked && property?.meLiked[0]?.myFavorite ? (
        <FavoriteIcon style={{ color: 'red' }} />
      ) : (
        <FavoriteIcon />
      )}
    </IconButton>
    <Typography className="view-cnt">{property?.propertyLikes}</Typography>

    {/* Comments */}
    <IconButton className="comment-button">
      <ChatBubbleOutlineIcon />
    </IconButton>
  <Typography className="view-cnt">
  {property?.propertyComments?.length ?? 0}
</Typography>


  </div>
</div>

				</Box>
			</Stack>
		);
	}
};

export default PropertyBigCard;