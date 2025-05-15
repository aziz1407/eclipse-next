import React, { useCallback, useEffect, useState } from 'react';
import {
	Stack,
	Typography,
	Checkbox,
	Button,
	OutlinedInput,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Tooltip,
	IconButton,
	styled,
	Slider,
	FormGroup,
	FormControlLabel,
	Box,
	SelectChangeEvent,
} from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import {
	WatchBrand,
	WatchCountry,
	WatchCondition,
	WatchMovement,
	WatchGender,
	WatchMaterial,
} from '../../enums/property.enum';
import { PropertiesInquiry } from '../../types/property/property.input';
import { useRouter } from 'next/router';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import { propertySquare } from '../../config';
import RefreshIcon from '@mui/icons-material/Refresh';



const TagButton = styled(Button)({
	borderRadius: '16px',
	border: '1px solid #e0e0e0',
	color: '#333',
	padding: '4px 12px',
	margin: '4px',
	textTransform: 'none',
	fontSize: '0.8rem',
	minWidth: 'auto',
	'&.active': {
		backgroundColor: '#333',
		color: '#fff',
		borderColor: '#333',
	},
});

const PriceContainer = styled(Stack)({
	border: '1px solid #e0e0e0',
	borderRadius: '8px',
	padding: '16px',
	marginBottom: '30px',
});

interface Range {
	start: number;
	end: number;
}

const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: '200px',
		},
	},
};

interface FilterType {
	searchFilter: PropertiesInquiry;
	setSearchFilter: any;
	initialInput: PropertiesInquiry;
}

const Filter = (props: FilterType) => {
	const { searchFilter, setSearchFilter, initialInput } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const [watchCountries, setWatchCountries] = useState<WatchCountry[]>(Object.values(WatchCountry));
	const [watchBrands, setWatchBrands] = useState<WatchBrand[]>(Object.values(WatchBrand));
	const [searchText, setSearchText] = useState<string>('');
	const [showMore, setShowMore] = useState<boolean>(false);

	/** LIFECYCLES **/
	useEffect(() => {
		const queryParams = JSON.stringify({
			...searchFilter,
			search: {
				...searchFilter.search,
			},
		});

		if (searchFilter?.search?.locationList?.length == 0) {
			delete searchFilter.search.locationList;
			setShowMore(false);

			// Reset to initial input for locationList if it becomes empty
			const updatedFilter = {
				...searchFilter,
				search: {
					...searchFilter.search,
					locationList: initialInput.search?.locationList || undefined,
				},
			};

			setSearchFilter(updatedFilter);

			router
				.push(`/property?input=${JSON.stringify(updatedFilter)}`, `/property?input=${JSON.stringify(updatedFilter)}`, {
					scroll: false,
				})
				.then();
		}

		if (searchFilter?.search?.typeList?.length == 0) {
			delete searchFilter.search.typeList;
			router
				.push(
					`/property?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					`/property?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					{ scroll: false },
				)
				.then();
		}

		if (searchFilter?.search?.propertyCategory?.length == 0) {
			delete searchFilter.search.propertyCategory;
			router
				.push(
					`/property?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					`/property?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					{ scroll: false },
				)
				.then();
		}

		if (searchFilter?.search?.options?.length == 0) {
			delete searchFilter.search.options;
			router
				.push(
					`/property?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					`/property?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					{ scroll: false },
				)
				.then();
		}

		if (searchFilter?.search?.propertyMaterial?.length == 0) {
			delete searchFilter.search.propertyMaterial;
			router
				.push(
					`/property?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					`/property?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					{ scroll: false },
				)
				.then();
		}

		if (searchFilter?.search?.locationList) setShowMore(true);
	}, [searchFilter]);

	/** HANDLERS **/
	const watchCountrySelectHandler = useCallback(
		async (e: any) => {
			try {
				const isChecked = e.target.checked;
				const value = e.target.value;

				if (isChecked) {
					await router.push(
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, locationList: [...(searchFilter?.search?.locationList || []), value] },
						})}`,
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, locationList: [...(searchFilter?.search?.locationList || []), value] },
						})}`,
						{ scroll: false },
					);
				} else if (searchFilter?.search?.locationList?.includes(value)) {
					// Check if this is the last selected item in locationList
					if (searchFilter?.search?.locationList?.length === 1) {
						// Reset to initial input state for the locationList
						setSearchFilter({
							...searchFilter,
							search: {
								...searchFilter.search,
								locationList: initialInput.search?.locationList || [],
							},
						});

						await router.push(
							`/property?input=${JSON.stringify({
								...searchFilter,
								search: {
									...searchFilter.search,
									locationList: initialInput.search?.locationList || [],
								},
							})}`,
							`/property?input=${JSON.stringify({
								...searchFilter,
								search: {
									...searchFilter.search,
									locationList: initialInput.search?.locationList || [],
								},
							})}`,
							{ scroll: false },
						);
					} else {
						// Just remove the one item as before
						await router.push(
							`/property?input=${JSON.stringify({
								...searchFilter,
								search: {
									...searchFilter.search,
									locationList: searchFilter?.search?.locationList?.filter((item: string) => item !== value),
								},
							})}`,
							`/property?input=${JSON.stringify({
								...searchFilter,
								search: {
									...searchFilter.search,
									locationList: searchFilter?.search?.locationList?.filter((item: string) => item !== value),
								},
							})}`,
							{ scroll: false },
						);
					}
				}

				if (searchFilter?.search?.typeList?.length == 0) {
					console.log('No watch brand selected');
				}

				console.log('watchCountrySelectHandler:', e.target.value);
			} catch (err: any) {
				console.log('ERROR, watchCountrySelectHandler:', err);
			}
		},
		[searchFilter, initialInput, setSearchFilter],
	);
	const watchBrandSelectHandler = useCallback(
		async (e: any) => {
			try {
				const isChecked = e.target.checked;
				const value = e.target.value;
				const previousSearchFilter = { ...searchFilter };
				let updatedFilter = { ...searchFilter };

				if (isChecked) {
					updatedFilter = {
						...searchFilter,
						search: {
							...searchFilter.search,
							typeList: [...(searchFilter?.search?.typeList || []), value],
						},
					};
				} else {
					updatedFilter = {
						...searchFilter,
						search: {
							...searchFilter.search,
							typeList: searchFilter?.search?.typeList?.filter((item: string) => item !== value),
						},
					};

					if (updatedFilter.search?.typeList?.length === 0) {
						delete updatedFilter.search.typeList;
					}
				}

				if (updatedFilter?.search?.locationList?.length === 0) {
					delete updatedFilter.search.locationList;
				}

				await router.push(
					`/property?input=${JSON.stringify(updatedFilter)}`,
					`/property?input=${JSON.stringify(updatedFilter)}`,
					{ scroll: false },
				);

				if (updatedFilter?.search?.locationList?.length === 0) {
					updatedFilter = { ...previousSearchFilter };
					await router.push(
						`/property?input=${JSON.stringify(updatedFilter)}`,
						`/property?input=${JSON.stringify(updatedFilter)}`,
						{ scroll: false },
					);
				}

				console.log('watchBrandSelectHandler:', e.target.value);
			} catch (err: any) {
				console.log('ERROR, watchBrandSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const watchGenderSelectHandler = useCallback(
		async (gender: WatchGender) => {
			try {
				let updatedPropertyCategory: WatchGender[] = [];

				if (searchFilter?.search?.propertyCategory?.includes(gender)) {
					updatedPropertyCategory =
						searchFilter?.search?.propertyCategory?.filter((item: WatchGender) => item !== gender) || [];
				} else {
					updatedPropertyCategory = [...(searchFilter?.search?.propertyCategory || []), gender];
				}

				const updatedSearchFilter = {
					...searchFilter,
					search: {
						...searchFilter.search,
						propertyCategory: updatedPropertyCategory,
					},
				};

				await router.push(
					`/property?input=${JSON.stringify(updatedSearchFilter)}`,
					`/property?input=${JSON.stringify(updatedSearchFilter)}`,
					{ scroll: false },
				);

				console.log('watchGenderSelectHandler:', gender);
			} catch (err: any) {
				console.log('ERROR, watchGenderSelectHandler:', err);
			}
		},
		[searchFilter, router],
	);

	const watchConditionSelectHandler = useCallback(
		async (condition: WatchCondition) => {
			try {
				if (searchFilter?.search?.propertyCondition?.includes(condition)) {
					await router.push(
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								propertyCondition: searchFilter?.search?.propertyCondition?.filter(
									(item: WatchCondition) => item !== condition,
								),
							},
						})}`,
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								propertyCondition: searchFilter?.search?.propertyCondition?.filter(
									(item: WatchCondition) => item !== condition,
								),
							},
						})}`,
						{ scroll: false },
					);
				} else {
					await router.push(
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								propertyCondition: [...(searchFilter?.search?.propertyCondition || []), condition],
							},
						})}`,
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								propertyCondition: [...(searchFilter?.search?.propertyCondition || []), condition],
							},
						})}`,
						{ scroll: false },
					);
				}

				console.log('watchConditionSelectHandler:', condition);
			} catch (err: any) {
				console.log('ERROR, watchConditionSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const watchMaterialHandler = useCallback(
		async (e: SelectChangeEvent<string>) => {
			try {
				const value = e.target.value;

				const updatedSearch = {
					...searchFilter.search,
					propertyMaterial: value === 'clear' ? undefined : value,
				};

				// Clean up undefined key if cleared
				if (value === 'Select Material') {
					delete updatedSearch.propertyMaterial;
				}

				const updatedFilter = {
					...searchFilter,
					search: updatedSearch,
				};

				await router.push(
					`/property?input=${JSON.stringify(updatedFilter)}`,
					`/property?input=${JSON.stringify(updatedFilter)}`,
					{ scroll: false },
				);
			} catch (err: any) {
				console.log('ERROR, watchMovementHandler:', err);
			}
		},
		[searchFilter],
	);

	const watchConditionHandler = useCallback(
		async (e: any) => {
			try {
				const value = e.target.value;
				await router.push(
					`/property?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							propertyCondition: value,
						},
					})}`,
					`/property?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							propertyCondition: value,
						},
					})}`,
					{ scroll: false },
				);
			} catch (err: any) {
				console.log('ERROR, watchConditionHandler:', err);
			}
		},
		[searchFilter],
	);

	const watchMovementHandler = useCallback(
		async (e: SelectChangeEvent<string>) => {
			try {
				const value = e.target.value;

				const updatedSearch = {
					...searchFilter.search,
					propertyMovement: value === 'clear' ? undefined : value,
				};

				// Clean up undefined key if cleared
				if (value === 'Select Movement') {
					delete updatedSearch.propertyMovement;
				}

				const updatedFilter = {
					...searchFilter,
					search: updatedSearch,
				};

				await router.push(
					`/property?input=${JSON.stringify(updatedFilter)}`,
					`/property?input=${JSON.stringify(updatedFilter)}`,
					{ scroll: false },
				);
			} catch (err: any) {
				console.log('ERROR, watchMovementHandler:', err);
			}
		},
		[searchFilter],
	);

	const watchPriceHandler = useCallback(
		async (value: number, type: string) => {
			if (type == 'start') {
				await router.push(
					`/property?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							pricesRange: { ...searchFilter.search.pricesRange, start: value * 1 },
						},
					})}`,
					`/property?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							pricesRange: { ...searchFilter.search.pricesRange, start: value * 1 },
						},
					})}`,
					{ scroll: false },
				);
			} else {
				await router.push(
					`/property?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							pricesRange: { ...searchFilter.search.pricesRange, end: value * 1 },
						},
					})}`,
					`/property?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							pricesRange: { ...searchFilter.search.pricesRange, end: value * 1 },
						},
					})}`,
					{ scroll: false },
				);
			}
		},
		[searchFilter],
	);

	const refreshHandler = async () => {
		try {
			setSearchText('');
			await router.push(
				`/property?input=${JSON.stringify(initialInput)}`,
				`/property?input=${JSON.stringify(initialInput)}`,
				{ scroll: false },
			);
		} catch (err: any) {
			console.log('ERROR, refreshHandler:', err);
		}
	};

	if (device === 'mobile') {
		return <div>WATCHES FILTER</div>;
	} else {
		return (
			<Stack className={'filter-main'}>
<Stack className="find-your-home" mb="32px">
  <Typography
    className="title-main"
    sx={{
      mb: 1.5,
      position: 'relative',
      '&:after': {
        content: '""',
        position: 'absolute',
        bottom: -8,
        left: 0,
        width: '40px',
        height: '2px',
        backgroundColor: '#ceae3b',
      },
    }}
  >
    Find Your Watch
  </Typography>

  <Stack
    direction="row"
    alignItems="center"
    spacing={0.5}
    sx={{
      backgroundColor: 'rgba(0,0,0,0.08)',
      borderRadius: '12px',
      px: 2.5,
      py: 0.5,
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      border: '1px solid #e8e8e8',
      transition: 'all 0.3s ease',
      height: '48px',
      '&:hover': {
        boxShadow: '0 6px 24px rgba(0,0,0,0.12)',
        borderColor: '#d4af37',
      },
      '&:focus-within': {
        borderColor: '#d4af37',
        boxShadow: '0 6px 24px rgba(212, 175, 55, 0.2)',
      },
    }}
  >
    <img
      src="/img/icons/search_icon.png"
      alt="Search"
      style={{
        width: '16px',
        height: '16px',
        opacity: 0.7,
        transition: 'all 0.3s ease',
      }}
      className="search-icon"
    />

    <OutlinedInput
      value={searchText}
      type="text"
      placeholder="Search luxury watches..."
      onChange={(e: any) => setSearchText(e.target.value)}
      onKeyDown={(event: any) => {
        if (event.key === 'Enter') {
          setSearchFilter({
            ...searchFilter,
            search: { ...searchFilter.search, text: searchText },
          });
        }
      }}
      sx={{
        flex: 1,
        fontSize: '14px',
        background: 'transparent',
        border: 'none',
        '& fieldset': { border: 'none' },
        '& input': {
          padding: '8px 12px',
          fontWeight: 500,
          color: '#1a1a1a',
          '&::placeholder': {
            color: '#999',
          },
        },
        '&.Mui-focused': {
          '& + .search-icon': {
            opacity: 1,
            transform: 'scale(1.1)',
          },
        },
      }}
      endAdornment={
        <Stack direction="row" alignItems="center" spacing={0.5}>
          {searchText && (
            <Tooltip title="Clear">
              <IconButton
                onClick={() => {
                  setSearchText('');
                  setSearchFilter({
                    ...searchFilter,
                    search: { ...searchFilter.search, text: '' },
                  });
                }}
                sx={{
                  p: 0.5,
                  color: '#888',
                  transition: 'all 0.3s',
                  '&:hover': {
                    color: '#d4af37',
                    transform: 'scale(1.1)',
                  },
                }}
              >
                <CancelRoundedIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
          )}

          <Tooltip title="Reset filters">
            <IconButton
              onClick={refreshHandler}
              sx={{
                p: 0.5,
                color: '#888',
                transition: 'all 0.3s',
                '&:hover': {
                  color: '#d4af37',
                  transform: 'rotate(90deg)',
                },
              }}
            >
              <RefreshIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
        </Stack>
      }
    />
  </Stack>

  {searchText && (
    <Typography
      variant="caption"
      sx={{
        mt: 1,
        color: '#d4af37',
        fontSize: '12px',
        display: 'flex',
        alignItems: 'center',
        '&:before': {
          content: '"↳"',
          mr: 0.5,
        },
      }}
    >
      Searching for: {searchText}
    </Typography>
  )}
</Stack>

				<Typography
					sx={{
						fontWeight: 700,
						fontSize: '15px',
						color: '#FAFAFA',
						mb: 2.5,
						fontFamily: 'sans-serif',
						letterSpacing: '1px',
						position: 'relative',
						'&:after': {
							content: '""',
							position: 'absolute',
							bottom: -8,
							left: 0,
							width: '40px',
							height: '2px',
							backgroundColor: '#ceae3b',
						},
					}}
				>
					Origin
				</Typography>

				<Stack
					onMouseEnter={() => {
						setTimeout(() => setShowMore(true), 500); // slow hover trigger
					}}
					onMouseLeave={() => {
						if (!searchFilter?.search?.locationList) {
							setShowMore(false);
						}
					}}
					sx={{
						backgroundColor: 'rgba(255, 255, 255, 0.03);',
						borderRadius: '12px',
						px: 2,
						py: 1.5,
						boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
						border: '1px solid #e8e8e8',
						transition: 'all 0.3s ease',
						mb: '24px',
						'&:hover': {
							boxShadow: '0 6px 24px rgba(0,0,0,0.12)',
							borderColor: '#d4af37',
						},
					}}
				>
					<FormGroup>
						{(showMore ? watchCountries : watchCountries.slice(0, 4)).map((country: any) => (
							<FormControlLabel
								key={country}
								control={
									<Checkbox
										checked={searchFilter?.search?.locationList?.includes(country) || false}
										onChange={(e) => {
											const checked = e.target.checked;
											const currentList = searchFilter?.search?.locationList || [];

											const updatedList = checked
												? [...currentList, country]
												: currentList.filter((item) => item !== country);

											setSearchFilter({
												...searchFilter,
												search: {
													...searchFilter.search,
													locationList: updatedList.length > 0 ? updatedList : null,
												},
											});
										}}
										icon={
											<Box
												sx={{
													width: 16,
													height: 16,
													borderRadius: '3px',
													border: '1.5px solid #999',
													transition: 'all 0.2s',
													ml: 1,
												}}
											/>
										}
										checkedIcon={
											<Box
												sx={{
													width: 16,
													height: 16,
													borderRadius: '3px',
													backgroundColor: '#1a1a1a',
													border: '1.5px solid #1a1a1a',
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'center',
													ml: 1,
													'&::after': {
														content: '""',
														width: 10,
														height: 10,
														borderRadius: '1px',
														backgroundColor: '#fff',
													},
												}}
											/>
										}
										sx={{
											p: 0.5,
											mr: 1,
											'&:hover': {
												backgroundColor: 'transparent',
											},
										}}
									/>
								}
								label={
									<Typography
										sx={{
											fontSize: '14px',
											color: '#f8f9fa',
											fontWeight: 500,
											fontFamily: 'inherit',
											'&:hover': {
												color: '#d4af37',
											},
										}}
									>
										{country}
									</Typography>
								}
								sx={{
									mb: 0.5,
									alignItems: 'center',
								}}
							/>
						))}
					</FormGroup>
				</Stack>

				<Stack className="find-your-home" mb="30px">
					<Typography
						sx={{
							fontWeight: 700,
							fontSize: '15px',
							color: '#FAFAFA',
							mb: 2.5,
							fontFamily: 'sans-serif',
							letterSpacing: '1px',
							position: 'relative',
							'&:after': {
								content: '""',
								position: 'absolute',
								bottom: -8,
								left: 0,
								width: '40px',
								height: '2px',
								backgroundColor: '#ceae3b',
							},
						}}
					>
						Brand
					</Typography>

					<Stack
						sx={{
							backgroundColor: 'rgba(255, 255, 255, 0.03);',
							borderRadius: '12px',
							px: 2,
							py: 1.5,
							boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
							border: '1px solid #e8e8e8',
							transition: 'all 0.3s ease',
							'&:hover': {
								boxShadow: '0 6px 24px rgba(0,0,0,0.12)',
								borderColor: '#d4af37',
							},
						}}
					>
						{watchBrands.map((brand: string) => (
							<Stack className="input-box" key={brand} sx={{ mb: 1 }}>
								<Checkbox
									id={brand}
									className="property-checkbox"
									color="default"
									size="small"
									value={brand}
									onChange={watchBrandSelectHandler}
									checked={(searchFilter?.search?.typeList || []).includes(brand as WatchBrand)}
									icon={
										<Box
											sx={{
												width: 16,
												height: 16,
												borderRadius: '3px',
												border: '1.5px solid #999',
												transition: 'all 0.2s',
											}}
										/>
									}
									checkedIcon={
										<Box
											sx={{
												width: 16,
												height: 16,
												borderRadius: '3px',
												backgroundColor: '#1a1a1a',
												border: '1.5px solid #1a1a1a',
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center',
												'&::after': {
													content: '""',
													width: 8,
													height: 8,
													borderRadius: '1px',
													backgroundColor: '#fff',
												},
											}}
										/>
									}
									sx={{
										p: 0.5,
										mr: 1,
										'&:hover': {
											backgroundColor: 'transparent',
										},
									}}
								/>

								<label style={{ cursor: 'pointer' }}>
									<Typography
										className="property_type"
										sx={{
											fontSize: '14px',
											color: '#f8f9fa',
											fontWeight: 500,
											fontFamily: 'inherit',
											'&:hover': {
												color: '#d4af37',
											},
										}}
									>
										{brand}
									</Typography>
								</label>
							</Stack>
						))}
					</Stack>
				</Stack>

				<Stack className={'find-your-home'} mb={'30px'}>
					<Typography className={'title'}>Gender</Typography>
					<Stack className="button-group">
						<Button
							sx={{
								borderRadius: '12px 0 0 12px',
								border: '1px solid #3a3a3a',
								color: '#fff',
								...(searchFilter?.search?.propertyCategory?.includes(WatchGender.MALE) && {
									border: '1.5px solid #d4af37',
									boxShadow: '0 0 4px rgba(212, 175, 55, 0.3)',
									color: '#d4af37',
								}),
							}}
							onClick={() => watchGenderSelectHandler(WatchGender.MALE)}
						>
							Men
						</Button>

						<Button
							sx={{
								borderRadius: 0,
								border: '1px solid #3a3a3a',
								borderLeft: 'none',
								color: '#fff',
								...(searchFilter?.search?.propertyCategory?.includes(WatchGender.FEMALE) && {
									border: '1.5px solid #d4af37',
									boxShadow: '0 0 4px rgba(212, 175, 55, 0.3)',
									color: '#d4af37',
								}),
							}}
							onClick={() => watchGenderSelectHandler(WatchGender.FEMALE)}
						>
							Women
						</Button>

						<Button
							sx={{
								borderRadius: '0 12px 12px 0',
								border: '1px solid #3a3a3a',
								borderLeft: 'none',
								color: '#fff',
								...(searchFilter?.search?.propertyCategory?.includes(WatchGender.UNISEX) && {
									border: '1.5px solid #d4af37',
									boxShadow: '0 0 4px rgba(212, 175, 55, 0.3)',
									color: '#d4af37',
								}),
							}}
							onClick={() => watchGenderSelectHandler(WatchGender.UNISEX)}
						>
							Unisex
						</Button>
					</Stack>
				</Stack>
				<Stack className={'find-your-home'} mb={'30px'}>
					<Typography className={'title'}>Condition</Typography>
					<Stack className="button-group">
						<Button
							sx={{
								borderRadius: '12px 0 0 12px',
								border: '1px solid #3a3a3a',
								color: '#fff',
								...(searchFilter?.search?.propertyCondition?.includes(WatchCondition.NEW) && {
									border: '1.5px solid #d4af37',
									boxShadow: '0 0 4px rgba(212, 175, 55, 0.3)',
									color: '#d4af37',
								}),
							}}
							onClick={() => watchConditionSelectHandler(WatchCondition.NEW)}
						>
							New
						</Button>

						<Button
							sx={{
								borderRadius: 0,
								border: '1px solid #3a3a3a',
								borderLeft: 'none',
								color: '#fff',
								...(searchFilter?.search?.propertyCondition?.includes(WatchCondition.SECONDHAND) && {
									border: '1.5px solid #d4af37',
									boxShadow: '0 0 4px rgba(212, 175, 55, 0.3)',
									color: '#d4af37',
								}),
							}}
							onClick={() => watchConditionSelectHandler(WatchCondition.SECONDHAND)}
						>
							Used
						</Button>

						<Button
							sx={{
								borderRadius: '0 12px 12px 0',
								border: '1px solid #3a3a3a',
								borderLeft: 'none',
								color: '#fff',
								...(searchFilter?.search?.propertyCondition?.includes(WatchCondition.REFURBISHED) && {
									border: '1.5px solid #d4af37',
									boxShadow: '0 0 4px rgba(212, 175, 55, 0.3)',
									color: '#d4af37',
								}),
							}}
							onClick={() => watchConditionSelectHandler(WatchCondition.REFURBISHED)}
						>
							Renewed
						</Button>
					</Stack>
				</Stack>

				<Stack className={'find-your-home'} mb={'30px'}>
					<Typography
						sx={{
							fontWeight: 700,
							fontSize: '14px',
							color: '#FAFAFA',
							fontFamily: 'sans-serif',
							letterSpacing: '1px',
							mb: 2.5,
							position: 'relative',
							'&::after': {
								content: '""',
								position: 'absolute',
								bottom: -8,
								left: 0,
								width: '40px',
								height: '2px',
								backgroundColor: '#ceae3b',
							},
						}}
					>
						Functionality
					</Typography>

					<Select
						displayEmpty
						value={searchFilter?.search?.propertyMovement || ''}
						onChange={watchMovementHandler}
						renderValue={(selected) =>
							selected ? selected : <span style={{ color: '#9e9e9e' }}>Select Movement</span>
						}
						sx={{
							borderRadius: '12px',
							backgroundColor: 'rgba(255, 255, 255, 0.03)',
							fontWeight: 550,
							fontSize: '14px',
							color: '#FAFAFA',
							fontFamily: 'sans-serif',
							py: 1.5,
							'& .MuiSelect-icon': {
								color: '#d4af37',
							},
							'& fieldset': {
								borderColor: '#b9b9b9',
							},
							'&:hover fieldset': {
								borderColor: '#d4af37',
							},
							'&.Mui-focused fieldset': {
								borderColor: '#d4af37',
							},
						}}
					>
						<MenuItem value="clear" sx={{ color: '#999' }}>
							Clear Selection
						</MenuItem>

						{Object.values(WatchMovement).map((movement: string) => (
							<MenuItem key={movement} value={movement}>
								{movement}
							</MenuItem>
						))}
					</Select>
				</Stack>

				<Stack className={'find-your-home'} mb={'30px'}>
					<Typography
						sx={{
							fontWeight: 700,
							fontSize: '14px',
							color: '#FAFAFA',
							fontFamily: 'sans-serif',
							letterSpacing: '1px',
							mb: 2.5,
							position: 'relative',
							'&::after': {
								content: '""',
								position: 'absolute',
								bottom: -6,
								left: 0,
								width: '40px',
								height: '2px',
								backgroundColor: '#ceae3b',
							},
						}}
					>
						Material
					</Typography>

					<Select
						displayEmpty
						value={
							Array.isArray(searchFilter?.search?.propertyMaterial) ? '' : searchFilter?.search?.propertyMaterial || ''
						}
						onChange={watchMaterialHandler}
						renderValue={(selected) =>
							selected ? selected : <span style={{ color: '#9e9e9e' }}>Select Material</span>
						}
						sx={{
							borderRadius: '12px',
							backgroundColor: 'rgba(255, 255, 255, 0.03)',
							fontWeight: 550,
							fontSize: '14px',
							color: '#FAFAFA',
							fontFamily: 'sans-serif',
							py: 1.5,
							'& .MuiSelect-icon': {
								color: '#d4af37',
							},
							'& fieldset': {
								borderColor: '#b9b9b9',
							},
							'&:hover fieldset': {
								borderColor: '#d4af37',
							},
							'&.Mui-focused fieldset': {
								borderColor: '#d4af37',
							},
						}}
					>
						<MenuItem value="clear" sx={{ color: '#999' }}>
							Clear Selection
						</MenuItem>

						{Object.values(WatchMaterial).map((material: string) => (
							<MenuItem key={material} value={material}>
								{material}
							</MenuItem>
						))}
					</Select>
				</Stack>

				<PriceContainer
					className="find-your-home"
					sx={{
						backgroundColor: 'rgba(255, 255, 255, 0.03)',
						borderRadius: '12px',
						border: '1.5px solid #b9b9b9',
						p: 2,
						mt: 1.5,
						'&:hover': {
							borderColor: '#d4af37',
						},
					}}
				>
					<Typography className="title" sx={{ fontWeight: 'bold', mb: 2 }}>
						Price Range
					</Typography>

					<Stack direction="row" justifyContent="space-between" sx={{ px: 1, mb: 1 }}>
						<Typography variant="body2" sx={{ fontWeight: 600, color: '#FAFAFA' }}>
							${searchFilter?.search?.pricesRange?.start ?? 0}
						</Typography>
						<Typography variant="body2" sx={{ fontWeight: 600, color: '#FAFAFA' }}>
							${searchFilter?.search?.pricesRange?.end ?? 10000}
						</Typography>
					</Stack>

					<Slider
						value={[searchFilter?.search?.pricesRange?.start ?? 0, searchFilter?.search?.pricesRange?.end ?? 10000]}
						onChange={(e: Event, newValue: number | number[]) => {
							if (Array.isArray(newValue)) {
								watchPriceHandler(newValue[0], 'start');
								watchPriceHandler(newValue[1], 'end');
							}
						}}
						min={0}
						max={10000}
						valueLabelDisplay="auto"
						valueLabelFormat={(value: any) => `$${value}`}
						sx={{
							color: '#000',
							height: 6,
							'& .MuiSlider-thumb': {
								width: 18,
								height: 18,
								backgroundColor: '#000',
								border: '2px solid rgba(255, 255, 255, 0.5)',
								boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
								'&:hover': {
									boxShadow: '0 0 0 10px rgba(0,0,0,0.1)',
								},
								'&:focus, &:focus-visible, &:active': {
									outline: 'none',
									boxShadow: 'none',
								},
							},
							'& .MuiSlider-track': {
								backgroundColor: '#e0e0e0',
								border: 'none',
							},
							'& .MuiSlider-rail': {
								backgroundColor: '#bbb',
								opacity: 1,
							},
							'& .MuiSlider-valueLabel': {
								backgroundColor: '#000',
								color: '#fff',
								fontSize: '12px',
								borderRadius: '4px',
								px: 1,
								py: '2px',
								fontWeight: 500,
								'&:before': {
									display: 'none',
								},
							},
						}}
					/>
				</PriceContainer>
			</Stack>
		);
	}
};

export default Filter;
