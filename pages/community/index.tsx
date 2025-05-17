import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Stack, Tab, Typography, Button, Pagination, Link } from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { Blog } from '../../libs/types/blog/blog';
import { T } from '../../libs/types/common';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { BlogsInquiry } from '../../libs/types/blog/blog.input';
import { BlogCategory } from '../../libs/enums/blog.enum';
import { GET_BLOGS } from '../../apollo/user/query';
import { useMutation, useQuery } from '@apollo/client';
import { LIKE_TARGET_BLOG } from '../../apollo/user/mutation';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import { Messages, REACT_APP_API_URL } from '../../libs/config';

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
});

// BlogPostCard component to replace CommunityCard
const BlogPostCard = ({ blog, likeArticleHandler }) => {
  const router = useRouter();
  
  const handleCardClick = () => {
    router.push(`/community/blog/${blog._id}`);
  };

  const imagePath: string = blog?.blogImage
		? `${REACT_APP_API_URL}/${blog?.blogImage}`
		: '/img/watches/all.jpg';
  
  return (
    <div className="blog-post-card" onClick={handleCardClick}>
      <div className="blog-post-content">
        <div className="blog-image">
          <img 
          style={{ backgroundImage: `url(${imagePath})`, backgroundSize: "cover" }}
          />
        </div>
        <div className="blog-info">
          <div className="date-comment">
            <span className="date">{blog.createdAt}</span>
            <span className="separator">|</span>
            <span className="comments">{blog.blogComments || 0} COMMENT{blog.blogComments !== 1 ? 'S' : ''}</span>
          </div>
          <h2 className="blog-title">{blog.blogTitle}</h2>
          <p className="blog-excerpt">
            {blog.blogContent?.substring(0, 200)}...
          </p>
		  <Link>
          <Button className="read-more-btn">READ MORE</Button>
		  </Link>
        </div>
      </div>
    </div>
  );
};

const Community: NextPage = ({ initialInput, ...props }: T) => {
  const device = useDeviceDetect();
  const router = useRouter();
  const { query } = router;
  const blogCategory = query?.blogCategory as string;
  const [searchCommunity, setSearchCommunity] = useState<BlogsInquiry>(initialInput);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  if (blogCategory) initialInput.search.blogCategory = blogCategory;

 const imagePath: string = blogs?.blogImages
		? `${REACT_APP_API_URL}/${blogs?.blogImages}`
		: '/img/watches/all.jpg';

  /** APOLLO REQUESTS **/

  const [likeTargetBoardArticle] = useMutation(LIKE_TARGET_BLOG);

  const {
    loading: boardArticlesLoading,
    data: boardArticlesData,
    error: boardArticlesError,
    refetch: getBlogsRefetch,
  } = useQuery(GET_BLOGS, {
    fetchPolicy: 'cache-and-network',
    variables: { input: searchCommunity },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      setBlogs(data?.getBlogs?.list);
      setTotalCount(data?.getBlogs?.metaCounter[0]?.total);
    },
  });

  /** LIFECYCLES **/
  useEffect(() => {
    if (!query?.blogCategory)
      router.push(
        {
          pathname: router.pathname,
          query: { blogCategory: 'GENERAL' },
        },
        router.pathname,
        { shallow: true },
      );
  }, []);

  /** HANDLERS **/
  const tabChangeHandler = async (e: T, value: string) => {
    console.log(value);

    setSearchCommunity({ ...searchCommunity, page: 1, search: { blogCategory: value as BlogCategory } });
    await router.push(
      {
        pathname: '/community',
        query: { blogCategory: value },
      },
      router.pathname,
      { shallow: true },
    );
  };

  const paginationHandler = (e: T, value: number) => {
    setSearchCommunity({ ...searchCommunity, page: value });
  };

  const likeArticleHandler = async (e: any, user: any, id: string) => {
    try {
      e.stopPropagation();
      if (!id) return;
      if (!user._id) throw new Error(Messages.error2);

      await likeTargetBoardArticle({
        variables: {
          input: id,
        },
      });

      await getBlogsRefetch({ input: searchCommunity });
      await sweetTopSmallSuccessAlert('success', 800);
    } catch (err: any) {
      console.log('Error, likePropertyHandler', err.message);
      sweetMixinErrorAlert(err.message).then();
    }
  };

  if (device === 'mobile') {
    return <h1>COMMUNITY PAGE MOBILE</h1>;
  } else {
    return (
      <div id="community-list-page">
        <div className="container">
          <TabContext value={searchCommunity.search.blogCategory}>
            <Stack className="main-box">
              <Stack className="left-config">
                <Stack className="title-section">
                  <Typography variant="h4" className="categories-title">CATEGORIES</Typography>
                </Stack>

                <TabList
                  orientation="vertical"
                  aria-label="blog categories tabs"
                  TabIndicatorProps={{
                    style: { display: 'none' },
                  }}
                  onChange={tabChangeHandler}
                >
                  <Tab
                    value={'GENERAL'}
                    label={'General'}
                    className={`tab-button ${searchCommunity.search.blogCategory == 'GENERAL' ? 'active' : ''}`}
                  />
                  <Tab
                    value={'LIFESTYLE'}
                    label={'Lifestyle'}
                    className={`tab-button ${searchCommunity.search.blogCategory == 'LIFESTYLE' ? 'active' : ''}`}
                  />
                  <Tab
                    value={'INSTRUCTIVE'}
                    label={'Instructive'}
                    className={`tab-button ${searchCommunity.search.blogCategory == 'INSTRUCTIVE' ? 'active' : ''}`}
                  />
                </TabList>

                <Stack className="recent-posts">
                  <Typography variant="h4" className="recent-posts-title">RECENT POSTS</Typography>
                  <div className="recent-post-list">
                    {blogs.slice(0, 4).map((blog, index) => (
                      <div key={index} className="recent-post-item">
                        <div className="post-thumbnail">
                          <img style={{ backgroundImage: `url(${imagePath})`, backgroundSize: "cover" }} />
                        </div>
                        <div className="post-details">
                          <Typography className="post-date">{blog.createdAt}</Typography>
                          <Typography className="post-title">{blog.blogTitle}</Typography>
                        </div>
                      </div>
                    ))}
                  </div>
                </Stack>
              </Stack>

              <Stack className="right-config">
                <Stack className="panel-config">
                  <Stack className="title-box">
                    <Stack className="left">
                      <Typography className="title">WATCH BLOG</Typography>
                      <Typography className="sub-title">
                        Discover the latest in horology and timepiece elegance
                      </Typography>
                    </Stack>
                    <Button
                      onClick={() =>
                        router.push({
                          pathname: '/mypage',
                          query: {
                            category: 'writeArticle',
                          },
                        })
                      }
                      className="right"
                    >
                      Write
                    </Button>
                  </Stack>

                  <TabPanel value="GENERAL">
                    <Stack className="blog-list">
                      {totalCount ? (
                        blogs?.map((blog: Blog) => (
                          <BlogPostCard 
                            blog={blog}
                            key={blog?._id}
                            likeArticleHandler={likeArticleHandler}
                          />
                        ))
                      ) : (
                        <Stack className={'no-data'}>
                          <img src="/img/icons/icoAlert.svg" alt="" />
                          <p>No Article found!</p>
                        </Stack>
                      )}
                    </Stack>
                  </TabPanel>
                  <TabPanel value="LIFESTYLE">
                    <Stack className="blog-list">
                      {totalCount ? (
                        blogs?.map((blog: Blog) => (
                          <BlogPostCard 
                            blog={blog}
                            key={blog?._id}
                            likeArticleHandler={likeArticleHandler}
                          />
                        ))
                      ) : (
                        <Stack className={'no-data'}>
                          <img src="/img/icons/icoAlert.svg" alt="" />
                          <p>No Article found!</p>
                        </Stack>
                      )}
                    </Stack>
                  </TabPanel>
                  <TabPanel value="INSTRUCTIVE">
                    <Stack className="blog-list">
                      {totalCount ? (
                        blogs?.map((blog: Blog) => (
                          <BlogPostCard 
                            blog={blog}
                            key={blog?._id}
                            likeArticleHandler={likeArticleHandler}
                          />
                        ))
                      ) : (
                        <Stack className={'no-data'}>
                          <img src="/img/icons/icoAlert.svg" alt="" />
                          <p>No Article found!</p>
                        </Stack>
                      )}
                    </Stack>
                  </TabPanel>
                  {/* Add remaining tab panels for all categories */}
                  <TabPanel value="LIMITED">
                    <Stack className="blog-list">
                      {totalCount ? (
                        blogs?.map((blog: Blog) => (
                          <BlogPostCard 
                            blog={blog}
                            key={blog?._id}
                            likeArticleHandler={likeArticleHandler}
                          />
                        ))
                      ) : (
                        <Stack className={'no-data'}>
                          <img src="/img/icons/icoAlert.svg" alt="" />
                          <p>No Article found!</p>
                        </Stack>
                      )}
                    </Stack>
                  </TabPanel>
                  {/* Additional tab panels would follow the same pattern */}
                </Stack>
              </Stack>
            </Stack>
          </TabContext>

          {totalCount > 0 && (
            <Stack className="pagination-config">
              <Stack className="pagination-box">
                <Pagination
                  count={Math.ceil(totalCount / searchCommunity.limit)}
                  page={searchCommunity.page}
                  shape="circular"
                  color="primary"
                  onChange={paginationHandler}
                />
              </Stack>
              <Stack className="total-result">
                <Typography>
                  Total {totalCount} article{totalCount > 1 ? 's' : ''} available
                </Typography>
              </Stack>
            </Stack>
          )}
        </div>
      </div>
    );
  }
};

Community.defaultProps = {
  initialInput: {
    page: 1,
    limit: 6,
    sort: 'createdAt',
    direction: 'ASC',
    search: {
      blogCategory: 'GENERAL',
    },
  },
};

export default withLayoutBasic(Community);