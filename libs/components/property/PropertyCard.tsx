import React, { useState } from 'react';
import { Stack, Typography, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Property } from '../../types/property/property';
import Link from 'next/link';
import { formatterStr } from '../../utils';
import { REACT_APP_API_URL } from '../../config';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import IconButton from '@mui/material/IconButton';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import MessageIcon from '@mui/icons-material/Message';

interface PropertyCardType {
  property: Property;
  likePropertyHandler?: any;
  myFavorites?: boolean;
  recentlyVisited?: boolean;
}

const PropertyCard = (props: PropertyCardType) => {
  const { property, likePropertyHandler, myFavorites = false, recentlyVisited = false } = props;
  const device = useDeviceDetect();
  const user = useReactiveVar(userVar);
  const [isHovered, setIsHovered] = useState(false);

  const disableActions = myFavorites || recentlyVisited;

  const primaryImagePath: string = property?.propertyImages[0]
    ? `${REACT_APP_API_URL}/${property?.propertyImages[0]}`
    : '/img/banner/header1.svg';

  const secondaryImagePath: string = property?.propertyImages[1]
    ? `${REACT_APP_API_URL}/${property?.propertyImages[1]}`
    : primaryImagePath;

  if (device === 'mobile') {
    return <div>PROPERTY CARD</div>;
  }

  return (
    <Stack
      className="watch-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Box className="watch-card-container">
        <Link
          href={{
            pathname: '/property/detail',
            query: { id: property?._id },
          }}
        >
          <Box className="watch-image-container">
            <img
              src={isHovered && property?.propertyImages[1] ? secondaryImagePath : primaryImagePath} style={{transition: "0.3s ease-in-out"}} 
              alt={property.propertyModel || 'Watch'}
              className="watch-image"
            />
          </Box>
        </Link>

        {!disableActions && isHovered && (
          <Stack className="action-buttons">
            <IconButton
              className={`action-button ${
                property?.meLiked && property?.meLiked[0]?.myFavorite ? 'liked' : ''
              }`}
              onClick={() => likePropertyHandler?.(user, property?._id)}
            >
              {property?.meLiked && property?.meLiked[0]?.myFavorite ? (
                <FavoriteIcon style={{ color: '#eb6753' }} />
              ) : (
                <FavoriteBorderIcon />
              )}
              {property?.propertyLikes > 0 && (
                <span className="like-count">{property.propertyLikes}</span>
              )}
            </IconButton>

            <Link
              href={{
                pathname: '/property/detail',
                query: { id: property?._id },
              }}
              passHref
            >
              <IconButton className="action-button view-button" component="a">
                <RemoveRedEyeIcon />
                {property?.propertyViews > 0 && (
                  <span className="view-count">{property.propertyViews}</span>
                )}
              </IconButton>
              <IconButton className="action-button" style={{marginTop: "10px"}}>
              <MessageIcon />
            </IconButton>
            </Link>
          </Stack>
        )}
      </Box>

      <Stack className="watch-details">
        <Link
          href={{
            pathname: '/property/detail',
            query: { id: property?._id },
          }}
        >
          <Typography className="watch-model">{property.propertyModel}</Typography>
        </Link>

        <Box className="price-container">
          <Typography className="current-price">
            ${formatterStr(property?.propertyPrice)}
          </Typography>
        </Box>
      </Stack>
    </Stack>
  );
};

export default PropertyCard;
