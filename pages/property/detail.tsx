import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { Box, Button, CircularProgress, Stack, Tab, Tabs, Typography } from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutFull from '../../libs/components/layout/LayoutFull';
import { NextPage } from 'next';
import Review from '../../libs/components/property/Review';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Autoplay, Navigation, Pagination } from 'swiper';
import PropertyBigCard from '../../libs/components/common/PropertyBigCard';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { useRouter } from 'next/router';
import { Property } from '../../libs/types/property/property';
import moment from 'moment';
import { formatterStr } from '../../libs/utils';
import { REACT_APP_API_URL } from '../../libs/config';
import { userVar } from '../../apollo/store';
import { CommentInput, CommentsInquiry } from '../../libs/types/comment/comment.input';
import { Comment } from '../../libs/types/comment/comment';
import { CommentGroup } from '../../libs/enums/comment.enum';
import { Pagination as MuiPagination } from '@mui/material';
import Link from 'next/link';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import 'swiper/css';
import 'swiper/css/pagination';
import { GET_COMMENTS, GET_PROPERTIES, GET_PROPERTY } from '../../apollo/user/query';
import { T } from '../../libs/types/common';
import { Direction, Message } from '../../libs/enums/common.enum';
import { CREATE_COMMENT, LIKE_TARGET_PROPERTY } from '../../apollo/user/mutation';
import { sweetErrorHandling, sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import { create } from 'domain';
import { VerifiedIcon, Truck, ShieldIcon,  } from 'lucide-react';

SwiperCore.use([Autoplay, Navigation, Pagination]);

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const PropertyDetail: NextPage = ({ initialComment, ...props }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const [propertyId, setPropertyId] = useState<string | null>(null);
	const [property, setProperty] = useState<Property | null>(null);
	const [slideImage, setSlideImage] = useState<string>('');
	const [destinationProperties, setDestinationProperties] = useState<Property[]>([]);
	const [commentInquiry, setCommentInquiry] = useState<CommentsInquiry>(initialComment);
	const [propertyComments, setPropertyComments] = useState<Comment[]>([]);
	const [commentTotal, setCommentTotal] = useState<number>(0);
	const [insertCommentData, setInsertCommentData] = useState<CommentInput>({
		commentGroup: CommentGroup.WATCH,
		commentContent: '',
		commentRefId: '',
	});
	
	
	/** APOLLO REQUESTS **/
	const [likeTargetProperty] = useMutation(LIKE_TARGET_PROPERTY);
	const [createComment] = useMutation(CREATE_COMMENT);

	const {
		loading: getPropertyLoading,
		data: getPropertyData,
		error: getPropertyError,
		refetch: getPropertyRefetch,
	} = useQuery(GET_PROPERTY, {
		fetchPolicy: 'network-only',
		variables: { input: propertyId },
		skip: !propertyId,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			if (data?.getProperty) setProperty(data?.getProperty);
			if (data?.getProperty) setSlideImage(data?.getProperty?.propertyImages[0]);
		},
	});

	const {
		loading: getPropertiesLoading,
		data: getPropertiesData,
		error: getPropertiesError,
		refetch: getPropertiesRefetch,
	} = useQuery(GET_PROPERTIES, {
		fetchPolicy: 'cache-and-network',
		variables: {
			input: {
				page: 1,
				limit: 4,
				sort: 'createdAt',
				direction: Direction.DESC,
				search: {
					locationList: property?.propertyCountry ? [property?.propertyCountry] : [],
				},
			},
		},
		skip: !propertyId && !property,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			if (data?.getProperties?.list) setDestinationProperties(data?.getProperties?.list);
		},
	});

	const {
		loading: getCommentsLoading,
		data: getCommentsData,
		error: getCommentsError,
		refetch: getCommentsRefetch,
	} = useQuery(GET_COMMENTS, {
		fetchPolicy: 'cache-and-network',
		variables: {
			input: initialComment,
		},
		skip: !commentInquiry.search.commentRefId,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			if (data?.getComments?.list) setPropertyComments(data?.getComments?.list);
			setCommentTotal(data?.getComments?.metaCounter[0]?.total ?? 0);
		},
	});

	const [activeTab, setActiveTab] = useState('description');
	const magnifyGlassRef = useRef<HTMLDivElement>(null);
	const mainImageRef = useRef<HTMLImageElement>(null);

	/** LIFECYCLES **/
	useEffect(() => {
		if (router.query.id) {
			setPropertyId(router.query.id as string);
			setCommentInquiry({
				...commentInquiry,
				search: {
					commentRefId: router.query.id as string,
				},
			});
			setInsertCommentData({
				...insertCommentData,
				commentRefId: router.query.id as string,
			});
		}
	}, [router]);

	useEffect(() => {
		if (commentInquiry.search.commentRefId) {
			getCommentsRefetch({ input: commentInquiry });
		}
	}, [commentInquiry]);

	/** HANDLERS **/
	const changeImageHandler = (image: string) => {
		setSlideImage(image);
	};

	// Modified zoom functionality with proper TypeScript typing

useEffect(() => {
  const mainImage = mainImageRef.current;
  
  if (!mainImage) return;
  
  // Create a magnify lens effect directly applied to the image
  const handleMouseMove = (e: MouseEvent) => {
    const { left, top, width, height } = mainImage.getBoundingClientRect();
    
    // Calculate mouse position relative to the image
    const mouseX = e.clientX - left;
    const mouseY = e.clientY - top;
    
    // Calculate mouse position as percentage (clamped between 0 and 1)
    const percentX = Math.max(0, Math.min(0.5, mouseX / width));
    const percentY = Math.max(0, Math.min(0.5, mouseY / height));
    
    // Apply the zoomed image effect directly
    const zoomFactor = 1.5;
    
    // Update the main image to show the zoomed portion
    mainImage.style.transformOrigin = `${percentX * 100}% ${percentY * 100}%`;
    mainImage.style.transform = `scale(${zoomFactor})`;
  };
  
  const handleMouseLeave = () => {
    // Reset the image to normal when mouse leaves
    mainImage.style.transform = 'scale(1)';
  };
  
  // TypeScript-safe event listener attachment
  mainImage.addEventListener('mousemove', handleMouseMove as unknown as EventListener);
  mainImage.addEventListener('mouseleave', handleMouseLeave);
  
  return () => {
    mainImage.removeEventListener('mousemove', handleMouseMove as unknown as EventListener);
    mainImage.removeEventListener('mouseleave', handleMouseLeave);
  };
}, [slideImage]);

	const likePropertyHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);
			//execute likePropertyHandler Mutation
			await likeTargetProperty({ variables: { input: id } });

			//execute getPropertiesRefetch
			await getPropertyRefetch({ input: id });
			await getPropertiesRefetch({
				input: {
					page: 1,
					limit: 4,
					sort: 'createdAt',
					direction: Direction.DESC,
					search: {
						locationList: [property?.propertyCountry],
					},
				},
			});

			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			console.log('ERROR, likePropertyHandler', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const commentPaginationChangeHandler = async (event: ChangeEvent<unknown>, value: number) => {
		commentInquiry.page = value;
		setCommentInquiry({ ...commentInquiry });
	};

	const createCommentHandler = async () => {
		try {
			if (!user._id) throw Error(Message.NOT_AUTHENTICATED);
			await createComment({ variables: { input: insertCommentData } });

			setInsertCommentData({ ...insertCommentData, commentContent: '' });

			await getCommentsRefetch({ input: commentInquiry });
		} catch (err) {
			await sweetErrorHandling(err);
		}
	};

	if (getPropertiesLoading) {
		return (
			<Stack
				sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '1800px' }}
			>
				<CircularProgress size={"4rem"}/>
			</Stack>
		);
	}

	if (device === 'mobile') {
		return <div>PROPERTY DETAIL PAGE</div>;
	} else {
	return (
  <div id={'property-detail-page'}>
    <div className={'container'}>
      <Stack className={'property-detail-config'}>
        <Stack className={'property-info-config'}>
          <Stack className={'info'}>
            <Stack className={'left-box'}>
              <Typography className={'title-main'}>{property?.propertyModel}</Typography>
              <Stack className={'top-box'}>
                <Typography className={'brand'}>{property?.propertyBrand}</Typography>
                <Stack className={'divider'}></Stack>
                <Typography className={'ref-number'}>Ref. {property?._id?.substring(0, 8)}</Typography>
                <Stack className={'divider'}></Stack>
                <Typography className={'date'}>{moment().diff(property?.createdAt, 'days')} days ago</Typography>
              </Stack>
            </Stack>
            <Stack className={'right-box'}>
              <Typography className="price">${formatterStr(property?.propertyPrice)}</Typography>
            </Stack>
          </Stack>
          <Stack className={'images-showcase'}>
            <Stack className={'main-image-container'}>
              <div className="magnify-glass" ref={magnifyGlassRef}></div>
              <img
                ref={mainImageRef}
                src={slideImage ? `${REACT_APP_API_URL}/${slideImage}` : '/img/property/bigImage.png'}
                alt={'main-image'}
                className="main-watch-image"
              />
            </Stack>
            <Stack className={'sub-images'}>
              {property?.propertyImages.map((subImg: string) => {
                const imagePath: string = `${REACT_APP_API_URL}/${subImg}`;
                return (
                  <Stack 
                    className={`sub-img-box ${slideImage === subImg ? 'active' : ''}`} 
                    onClick={() => changeImageHandler(subImg)} 
                    key={subImg}
                  >
                    <img src={imagePath} alt={'sub-image'} />
                  </Stack>
                );
              })}
            </Stack>
          </Stack>
        </Stack>
        <Stack className={'property-desc-config'}>
          <Stack className={'left-config'}>
            <Stack className={'watch-details-config'}>
              <Typography className={'title'}>Watch Specifications</Typography>
              <Stack className={'specs-container'}>
                <Stack className={'spec-group'}>
                  <Box component={'div'} className={'spec-item'}>
                    <Typography className={'spec-title'}>Brand</Typography>
                    <Typography className={'spec-value'}>{property?.propertyBrand}</Typography>
                  </Box>
                  <Box component={'div'} className={'spec-item'}>
                    <Typography className={'spec-title'}>Model</Typography>
                    <Typography className={'spec-value'}>{property?.propertyModel}</Typography>
                  </Box>
                  <Box component={'div'} className={'spec-item'}>
                    <Typography className={'spec-title'}>Address</Typography>
                    <Typography className={'spec-value'}>{property?.propertyAddress}</Typography>
                  </Box>
                  <Box component={'div'} className={'spec-item'}>
                    <Typography className={'spec-title'}>Category</Typography>
                    <Typography className={'spec-value'}>{property?.propertyCategory}</Typography>
                  </Box>
                </Stack>
                <Stack className={'spec-group'}>
                  <Box component={'div'} className={'spec-item'}>
                    <Typography className={'spec-title'}>Material</Typography>
                    <Typography className={'spec-value'}>{property?.propertyMaterial}</Typography>
                  </Box>
                  <Box component={'div'} className={'spec-item'}>
                    <Typography className={'spec-title'}>Condition</Typography>
                    <Typography className={'spec-value'}>{property?.propertyCondition}</Typography>
                  </Box>
                  <Box component={'div'} className={'spec-item'}>
                    <Typography className={'spec-title'}>Movement</Typography>
                    <Typography className={'spec-value'}>{property?.propertyMovement}</Typography>
                  </Box>
                  <Box component={'div'} className={'spec-item'}>
                    <Typography className={'spec-title'}>Year</Typography>
                    <Typography className={'spec-value'}>{property?.propertyYear || moment(property?.createdAt).format('YYYY')}</Typography>
                  </Box>
                </Stack>
              </Stack>
            </Stack>

			  <Stack className={'prop-tabs-container'}>
              <Tabs 
                value={activeTab} 
                onChange={(e: any, newValue: any) => setActiveTab(newValue)} 
                className="property-tabs"
              >
                <Tab label="Description" value="description" />
                <Tab label="Purchase Info" value="purchase" />
				<Tab label="Comments" value="comments" />
              </Tabs>

              {activeTab === 'description' && (
                <Stack className={'tab-content description-tab'}>
                  <Typography className={'title'}>Watch Description</Typography>
                  <Typography className={'desc'}>{property?.propertyDesc ?? 'No Description!'}</Typography>
                </Stack>
              )}

              {activeTab === 'purchase' && (
                <Stack className={'tab-content purchase-tab'}>
                  <Typography className={'title'}>Purchase Information</Typography>
                  <Typography className={'desc'}>
                    To purchase this luxury timepiece, please contact our authorized dealers directly. We ensure secure packaging and insured shipping worldwide. Delivery typically takes 3-5 business days depending on location. All watches come with authentication certificates and a 2-year international warranty.
                  </Typography>
                </Stack>
              )}
            </Stack>

            {commentTotal !== 0 && (
              <Stack className={'reviews-config'}>
                <Stack className={'filter-box'}>
                  <Stack className={'review-cnt'}>
                    <Typography className={'reviews'}>{commentTotal} reviews</Typography>
                  </Stack>
                </Stack>
                <Stack className={'review-list'}>
                  {propertyComments?.map((comment: Comment) => {
                    return <Review comment={comment} key={comment?._id} />;
                  })}
                  <Box component={'div'} className={'pagination-box'}>
                    <MuiPagination
                      page={commentInquiry.page}
                      count={Math.ceil(commentTotal / commentInquiry.limit)}
                      onChange={commentPaginationChangeHandler}
                      shape="circular"
                      color="primary"
                    />
                  </Box>
                </Stack>
              </Stack>
            )}
            <Stack className={'leave-review-config'}>
              <Typography className={'main-title'}>Drop a comment</Typography>
              <textarea
                onChange={({ target: { value } }: any) => {
                  setInsertCommentData({ ...insertCommentData, commentContent: value });
                }}
                value={insertCommentData.commentContent}
                placeholder="Share your experience with this timepiece..."
              ></textarea>
              <Box className={'submit-btn'} component={'div'}>
                <Button
                  className={'submit-review'}
                  disabled={insertCommentData.commentContent === '' || user?._id === ''}
                  onClick={createCommentHandler}
                >
                  <Typography className={'title'}>Submit Review</Typography>
                </Button>
              </Box>
            </Stack>
          </Stack>
          <Stack className={'right-config'}>
            <Stack className={'dealer-info-box'}>
              <Typography className={'main-title'}>Contact Dealer</Typography>
              <Stack className={'dealer-details'}>
                <img
                  className={'dealer-image'}
                  src={
                    property?.memberData?.memberImage
                      ? `${REACT_APP_API_URL}/${property?.memberData?.memberImage}`
                      : '/img/profile/defaultUser.svg'
                  }
                />
                <Stack className={'dealer-info'}>
                  <Link href={`/member?memberId=${property?.memberData?._id}`}>
                    <Typography className={'name'}>{property?.memberData?.memberNick}</Typography>
                  </Link>
                  <Stack className={'phone-number'}>
                    <Typography className={'number'}>{property?.memberData?.memberPhone}</Typography>
                  </Stack>
                  <Link href={`/member?memberId=${property?.memberData?._id}`} className="inventory-link">
                    <Typography className={'listings'}>View Inventory</Typography>
                  </Link>
                </Stack>
              </Stack>
            </Stack>
            <Stack className={'contact-form'}>
              <Stack className={'form-field'}>
                <Typography className={'field-label'}>Name</Typography>
                <input type={'text'} placeholder={'Enter your name'} style={{color: "grey"}}/>
              </Stack>
              <Stack className={'form-field'}>
                <Typography className={'field-label'}>Phone</Typography>
                <input type={'text'} placeholder={'Enter your phone'} />
              </Stack>
              <Stack className={'form-field'}>
                <Typography className={'field-label'}>Email</Typography>
                <input type={'email'} placeholder={'Enter your email'} />
              </Stack>
              <Stack className={'form-field'}>
                <Typography className={'field-label'}>Message</Typography>
                <textarea placeholder={'Hello, I am interested in this timepiece and would like more information...'}></textarea>
              </Stack>
              <Stack className={'form-field'}>
                <Button className={'send-message'}>
                  <Typography className={'title'}>Contact Dealer</Typography>
                </Button>
              </Stack>
            </Stack>
            
          </Stack>
        </Stack>
        {destinationProperties.length !== 0 && (
          <Stack className={'similar-properties-config'}>
            <Stack className={'title-pagination-box'}>
              <Stack className={'title-box'}>
                <Typography className={'main-title'}>Similar Timepieces</Typography>
                <Typography className={'sub-title'}>You may also be interested in</Typography>
              </Stack>
              <Stack className={'pagination-box'}>
                <WestIcon className={'swiper-similar-prev'} />
                <div className={'swiper-similar-pagination'}></div>
                <EastIcon className={'swiper-similar-next'} />
              </Stack>
            </Stack>
            <Stack className={'cards-box'}>
              <Swiper
                className={'similar-watches-swiper'}
                slidesPerView={'auto'}
                spaceBetween={35}
                modules={[Autoplay, Navigation, Pagination]}
                navigation={{
                  nextEl: '.swiper-similar-next',
                  prevEl: '.swiper-similar-prev',
                }}
                pagination={{
                  el: '.swiper-similar-pagination',
                }}
              >
                {destinationProperties.map((property: Property) => {
                  return (
                    <SwiperSlide className={'similar-watches-slide'} key={property.propertyModel}>
                      <PropertyBigCard
                        property={property}
                        likePropertyHandler={likePropertyHandler}
                        key={property?._id}
                      />
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </Stack>
          </Stack>
        )}
      </Stack>
    </div>
  </div>
);
	}
};

PropertyDetail.defaultProps = {
	initialComment: {
		page: 1,
		limit: 5,
		sort: 'createdAt',
		direction: 'DESC',
		search: {
			commentRefId: '',
		},
	},
};

export default withLayoutFull(PropertyDetail);
