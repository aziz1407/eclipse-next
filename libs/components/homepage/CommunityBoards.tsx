import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Stack, Typography } from '@mui/material';
import { Blog } from '../../types/blog/blog';
import { GET_BLOGS } from '../../../apollo/user/query';
import { useQuery } from '@apollo/client';
import { BlogCategory } from '../../enums/blog.enum';
import { T } from '../../types/common';
import { useTranslation } from 'next-i18next';

const JournalSection = () => {
	const { t } = useTranslation('common');
	const device = useDeviceDetect();

	const [searchParams] = useState({
		page: 1,
		sort: 'blogViews',
		direction: 'DESC',
		limit: 1,
	});

	const [generalArticle, setGeneralArticle] = useState<Blog | null>(null);
	const [instructiveArticle, setInstructiveArticle] = useState<Blog | null>(null);
	const [lifestyleArticle, setLifestyleArticle] = useState<Blog | null>(null);

	useQuery(GET_BLOGS, {
		fetchPolicy: 'network-only',
		variables: {
			input: {
				...searchParams,
				search: { blogCategory: BlogCategory.GENERAL },
			},
		},
		onCompleted: (data: T) => {
			if (data?.getBlogs?.list?.length > 0) {
				setGeneralArticle(data.getBlogs.list[0]);
			}
		},
	});

	useQuery(GET_BLOGS, {
		fetchPolicy: 'network-only',
		variables: {
			input: {
				...searchParams,
				search: { blogCategory: BlogCategory.INSTRUCTIVE },
			},
		},
		onCompleted: (data: T) => {
			if (data?.getBlogs?.list?.length > 0) {
				setInstructiveArticle(data.getBlogs.list[0]);
			}
		},
	});

	useQuery(GET_BLOGS, {
		fetchPolicy: 'network-only',
		variables: {
			input: {
				...searchParams,
				search: { blogCategory: BlogCategory.LIFESTYLE },
			},
		},
		onCompleted: (data: T) => {
			if (data?.getBlogs?.list?.length > 0) {
				setLifestyleArticle(data.getBlogs.list[0]);
			}
		},
	});

	const formatDate = (dateString: Date) => {
		const date = new Date(dateString);
		return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
	};

	const truncateText = (text: string, maxLength: number = 120) => {
		if (!text) return '';
		return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
	};

	const getArticleTitle = (article: Blog | null) => {
		if (!article) return '';
		return article.blogTitle || '';
	};

	const renderArticleCard = (article: Blog | null, index: number) => {
		if (!article) return null;

		const blogImage = article.blogImage
			? `${process.env.REACT_APP_API_URL}/${article.blogImage}`
			: '/img/watches/all.jpg';

		return (
			<div className="journal-card" key={`article-${index}`}>
				<div className="journal-image">
					<img style={{ backgroundImage: `url(${blogImage})` }} />
				</div>
				<div className="journal-content">
					<h2 className="journal-title">{getArticleTitle(article)}</h2>
					<div className="journal-date">{formatDate(article.createdAt)}</div>
					<div className="journal-meta">
						<span className="journal-comments">{article.blogComments} {t('comments')}</span>
						<span className="journal-separator"> | </span>
						<span className="journal-author">{article.memberData?.memberNick}</span>
					</div>
					<p className="journal-excerpt">
						{truncateText(article.blogContent, 250)}
						<p style={{ marginTop: '5px' }}>
							<Link
								href={`/community/detail?blogCategory=${article.blogCategory}&id=${article._id}`}
								style={{
									color: '#fafafa',
									whiteSpace: 'nowrap',
									textDecoration: 'none',
								}}
								onMouseEnter={(e) => (e.currentTarget.style.color = 'grey')}
								onMouseLeave={(e) => (e.currentTarget.style.color = '#fafafa')}
							>
								{t('Read more')}...
							</Link>
						</p>
					</p>
				</div>
			</div>
		);
	};

	if (device === 'mobile') {
		return <div>{t('BLOGS')} (MOBILE)</div>;
	}

	return (
		<div className="journal-section">
			<div className="journal-container">
				<h2 className="journal-heading">{t('BLOGS')}</h2>
				<p className="journal-subheading" style={{ color: '#fafafa' }}>
					{t('Discover expert insights, luxury trends, and timeless blogs from the world of Eclipse.')}
				</p>
				<div className="journal-grid">
					{renderArticleCard(instructiveArticle, 0)}
					{renderArticleCard(generalArticle, 1)}
					{renderArticleCard(lifestyleArticle, 2)}
				</div>

				<div className="journal-view-all">
					<Link href="/community">
						<div className="view-all-button">{t('View Blogs')}</div>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default JournalSection;
