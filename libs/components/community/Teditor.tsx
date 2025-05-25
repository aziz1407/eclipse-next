import React, { useMemo, useRef, useState } from 'react';
import { Box, Button, FormControl, MenuItem, Stack, Typography, Select, TextField } from '@mui/material';
import { BlogCategory } from '../../enums/blog.enum';
import { Editor } from '@toast-ui/react-editor';
import { getJwtToken } from '../../auth';
import { REACT_APP_API_URL } from '../../config';
import { useRouter } from 'next/router';
import axios from 'axios';
import { T } from '../../types/common';
import '@toast-ui/editor/dist/toastui-editor.css';
import { useMutation } from '@apollo/client';
import { CREATE_BLOG } from '../../../apollo/user/mutation';
import { Message } from '../../enums/common.enum';
import { sweetErrorHandling, sweetTopSuccessAlert } from '../../sweetAlert';

const TuiEditor = () => {
	const editorRef = useRef<Editor>(null),
		token = getJwtToken(),
		router = useRouter();
	const [blogCategory, setBlogCategory] = useState<BlogCategory>(BlogCategory.GENERAL);

	/** APOLLO REQUESTS **/
	const [createboardArticle] = useMutation(CREATE_BLOG);

	const memoizedValues = useMemo(() => {
		const blogTitle = '',
			blogContent = '',
			blogImage = '';

		return { blogTitle: blogTitle, blogContent: blogContent, blogImage: blogImage };
	}, []);

	/** HANDLERS **/
	const uploadImage = async (image: any) => {
		try {
			const formData = new FormData();
			formData.append(
				'operations',
				JSON.stringify({
					query: `mutation ImageUploader($file: Upload!, $target: String!) {
						imageUploader(file: $file, target: $target) 
				  }`,
					variables: {
						file: null,
						target: 'blogs',
					},
				}),
			);
			formData.append(
				'map',
				JSON.stringify({
					'0': ['variables.file'],
				}),
			);
			formData.append('0', image);

			const response = await axios.post(`${process.env.REACT_APP_API_GRAPHQL_URL}`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					'apollo-require-preflight': true,
					Authorization: `Bearer ${token}`,
				},
			});

			const responseImage = response.data.data.imageUploader;
			console.log('=responseImage: ', responseImage);
			memoizedValues.blogImage = responseImage;

			return `${REACT_APP_API_URL}/${responseImage}`;
		} catch (err) {
			console.log('Error, uploadImage:', err);
		}
	};

	const changeCategoryHandler = (e: any) => {
		setBlogCategory(e.target.value);
	};

	const articleTitleHandler = (e: T) => {
		console.log(e.target.value);
		memoizedValues.blogTitle = e.target.value;
	};

	const handleRegisterButton = async () => {
		try {
			const editor = editorRef.current;
			const blogContent = editor?.getInstance().getHTML() as string;
			memoizedValues.blogContent = blogContent;

			if (memoizedValues.blogContent === '' && memoizedValues.blogTitle === '') {
				throw new Error(Message.INSERT_ALL_INPUTS);
			}

			await createboardArticle({
				variables: {
					input: { ...memoizedValues, blogCategory: blogCategory },
				},
			});

			await sweetTopSuccessAlert('Blog is created successfully', 700);
			await router.push({
				pathname: '/mypage',
				query: {
					category: 'myArticles',
				},
			});
		} catch (err: any) {
			console.log(err);
			sweetErrorHandling(new Error(Message.INSERT_ALL_INPUTS)).then();
		}
	};

	const doDisabledCheck = () => {
		if (memoizedValues.blogContent === '' || memoizedValues.blogTitle === '') {
			return true;
		}
	};

	return (
		<Box sx={{
			background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
			minHeight: '100vh',
			padding: '20px',
			color: '#fff'
		}}>
			<Stack spacing={3} sx={{ maxWidth: '1200px', margin: '0 auto' }}>
				<Stack 
					direction={{ xs: 'column', md: 'row' }} 
					spacing={3}
					sx={{ mb: 2 }}
				>
					<Box sx={{ flex: 1 }}>
						<Typography 
							variant="subtitle1" 
							sx={{ 
								color: '#d4af37', 
								mb: 1,
								fontWeight: 500,
								fontSize: '0.9rem'
							}}
						>
							Category
						</Typography>
						<FormControl fullWidth>
							<Select
								value={blogCategory}
								onChange={changeCategoryHandler}
								displayEmpty
								sx={{
									backgroundColor: 'rgba(255, 255, 255, 0.05)',
									border: '1px solid rgba(212, 175, 55, 0.3)',
									borderRadius: '8px',
									color: '#fff',
									'& .MuiOutlinedInput-notchedOutline': {
										border: 'none',
									},
									'&:hover': {
										backgroundColor: 'rgba(255, 255, 255, 0.08)',
										border: '1px solid rgba(212, 175, 55, 0.5)',
									},
									'&.Mui-focused': {
										backgroundColor: 'rgba(255, 255, 255, 0.08)',
										border: '1px solid #d4af37',
									},
									'& .MuiSelect-icon': {
										color: '#d4af37',
									}
								}}
								MenuProps={{
									PaperProps: {
										sx: {
											backgroundColor: '#2d2d2d',
											border: '1px solid rgba(212, 175, 55, 0.3)',
											'& .MuiMenuItem-root': {
												color: '#fff',
												'&:hover': {
													backgroundColor: 'rgba(212, 175, 55, 0.1)',
												},
												'&.Mui-selected': {
													backgroundColor: 'rgba(212, 175, 55, 0.2)',
												}
											}
										}
									}
								}}
							>
								<MenuItem value={BlogCategory.GENERAL}>General</MenuItem>
								<MenuItem value={BlogCategory.LIFESTYLE}>Lifestyle</MenuItem>
								<MenuItem value={BlogCategory.INSTRUCTIVE}>Instructive</MenuItem>
							</Select>
						</FormControl>
					</Box>

					<Box sx={{ flex: 1 }}>
						<Typography 
							variant="subtitle1" 
							sx={{ 
								color: '#d4af37', 
								mb: 1,
								fontWeight: 500,
								fontSize: '0.9rem'
							}}
						>
							Title
						</Typography>
						<TextField
							onChange={articleTitleHandler}
							placeholder="Type Title"
							fullWidth
							sx={{
								'& .MuiOutlinedInput-root': {
									backgroundColor: 'rgba(255, 255, 255, 0.05)',
									border: '1px solid rgba(212, 175, 55, 0.3)',
									borderRadius: '8px',
									color: '#fff',
									'& fieldset': {
										border: 'none',
									},
									'&:hover': {
										backgroundColor: 'rgba(255, 255, 255, 0.08)',
										border: '1px solid rgba(212, 175, 55, 0.5)',
									},
									'&.Mui-focused': {
										backgroundColor: 'rgba(255, 255, 255, 0.08)',
										border: '1px solid #d4af37',
									}
								},
								'& .MuiInputBase-input::placeholder': {
									color: 'rgba(255, 255, 255, 0.5)',
									opacity: 1,
								}
							}}
						/>
					</Box>
				</Stack>

				{/* Editor Container */}
				<Box sx={{
					backgroundColor: 'rgba(255, 255, 255, 0.05)',
					border: '1px solid rgba(212, 175, 55, 0.3)',
					borderRadius: '12px',
					padding: '16px',
					backdropFilter: 'blur(10px)',
					'& .toastui-editor-defaultUI': {
						border: 'none',
						backgroundColor: 'transparent',
					},
					'& .toastui-editor-defaultUI-toolbar': {
						border: 'none',
						borderBottom: '1px solid rgba(212, 175, 55, 0.2)',
						borderRadius: '8px 8px 0 0',
					},
					'& .toastui-editor-toolbar-group': {
						border: 'none',
					},
					'& .toastui-editor-toolbar-icons': {
						color: '#fff !important',
					},
					'& .toastui-editor-toolbar-icons button': {
						color: '#fff !important',
					},
					'& .toastui-editor': {
						backgroundColor: 'rgba(255, 255, 255, 0.02)',
						color: '#fff',
					},
					'& .toastui-editor-md-container .toastui-editor > .toastui-editor-defaultUI .ProseMirror': {
						backgroundColor: 'transparent',
						color: '#fff',
					}
				}}>
					<Editor
						initialValue={'Type here'}
						placeholder={'Type here'}
						previewStyle={'vertical'}
						height={'400px'}
						// @ts-ignore
						initialEditType={'WYSIWYG'}
						toolbarItems={[
							['heading', 'bold', 'italic', 'strike'],
							['image', 'table', 'link'],
							['ul', 'ol', 'task'],
						]}
						ref={editorRef}
						hooks={{
							addImageBlobHook: async (image: any, callback: any) => {
								const uploadedImageURL = await uploadImage(image);
								callback(uploadedImageURL);
								return false;
							},
						}}
						events={{
							load: function (param: any) {},
						}}
					/>
				</Box>

				{/* Register Button */}
				<Stack direction="row" justifyContent="center" sx={{ mt: 3 }}>
					<Button
						variant="contained"
						onClick={handleRegisterButton}
						sx={{
							background: '#fff',
							color: '#1a1a1a',
							fontWeight: 600,
							fontSize: '1rem',
							padding: '12px 48px',
							borderRadius: '25px',
							textTransform: 'none',
							boxShadow: '0 4px 20px rgba(212, 175, 55, 0.3)',
							transition: 'all 0.3s ease',
							'&:hover': {
								background: 'goldenrod',
								boxShadow: '0 6px 25px rgba(212, 175, 55, 0.4)',
								transform: 'translateY(-2px)',
							},
							'&:active': {
								transform: 'translateY(0)',
							}
						}}
					>
						Register
					</Button>
				</Stack>
			</Stack>
		</Box>
	);
};

export default TuiEditor;