import React from 'react';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import TelegramIcon from '@mui/icons-material/Telegram';
import YoutubeIcon from '@mui/icons-material/Youtube';
import { Stack, Box, Divider } from '@mui/material';
import useDeviceDetect from '../hooks/useDeviceDetect';
import moment from 'moment';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'next-i18next';

const Footer: React.FC = () => {
	const { t } = useTranslation('common');
	const device = useDeviceDetect();
	const router = useRouter();

	const handleLinkClick = () => {
		router.push('/cs');
	};

	if (device === 'mobile') {
		return (
			<Stack className={'footer-container'}>
				<Stack className={'main'}>
					<Stack className={'left'}>
						<Box component={'div'} className={'footer-box'}>
							<h3 className={'brand-name'}>{t('Éclipse')}</h3>
						</Box>
						<Box component={'div'} className={'footer-box social-icons'}>
							<TwitterIcon />
							<FacebookOutlinedIcon />
							<YoutubeIcon />
							<TelegramIcon />
						</Box>
					</Stack>
					<Stack className={'right'}>
						<Box component={'div'} className={'bottom'}>
							<div className="info-column">
								<strong>{t('INFO')}</strong>
								<span onClick={handleLinkClick}>{t('Shipping & Delivery')}</span>
								<span onClick={handleLinkClick}>{t('Returns & Exchanges')}</span>
								<span onClick={handleLinkClick}>{t('Order Tracking')}</span>
								<span onClick={handleLinkClick}>{t('Payment Methods')}</span>
								<span onClick={handleLinkClick}>{t('Size Guide')}</span>
								<span onClick={handleLinkClick}>{t('Product Care')}</span>
							</div>

							<div className="services-column">
								<strong>{t('SERVICES')}</strong>
								<span onClick={handleLinkClick}>{t('Customer Support')}</span>
								<span onClick={handleLinkClick}>{t('Live Chat')}</span>
								<span onClick={handleLinkClick}>{t('Account Help')}</span>
								<span onClick={handleLinkClick}>{t('Warranty Info')}</span>
								<span onClick={handleLinkClick}>{t('How to Order')}</span>
								<span onClick={handleLinkClick}>{t('FAQs')}</span>
							</div>
						</Box>
					</Stack>
				</Stack>
				<Stack className={'second'}>
					<span>{t('© Copyright 2024 | Éclipse By Aiden. Powered by Shopify.')}</span>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<div id="footer">
				<Stack className={'footer-container'}>
					<Stack className={'main'}>
						<Stack className={'left'}>
							<Box component={'div'} className={'footer-box'}>
								<h3 className={'brand-name'}>{t('Éclipse')}</h3>
							</Box>
							<Box component={'div'} className={'footer-box social-icons'}>
								<a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
									<TwitterIcon />
								</a>
								<a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
									<FacebookOutlinedIcon />
								</a>
								<a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
									<YoutubeIcon />
								</a>
								<a href="https://t.me/yourTelegramUsername" target="_blank" rel="noopener noreferrer">
									<TelegramIcon />
								</a>
							</Box>
						</Stack>
						<Stack className={'middle'}>
							<div className="info-column">
								<strong>{t('DETAILS')}</strong>
								<span onClick={handleLinkClick}>{t('Shipping & Delivery')}</span>
								<span onClick={handleLinkClick}>{t('Returns & Exchanges')}</span>
								<span onClick={handleLinkClick}>{t('Order Tracking')}</span>
								<span onClick={handleLinkClick}>{t('Payment Methods')}</span>
								<span onClick={handleLinkClick}>{t('Size Guide')}</span>
								<span onClick={handleLinkClick}>{t('Product Care')}</span>
							</div>

							<div className="services-column">
								<strong>{t('SERVICES')}</strong>
								<span onClick={handleLinkClick}>{t('Customer Support')}</span>
								<span onClick={handleLinkClick}>{t('Live Chat')}</span>
								<span onClick={handleLinkClick}>{t('Account Help')}</span>
								<span onClick={handleLinkClick}>{t('Warranty Info')}</span>
								<span onClick={handleLinkClick}>{t('How to Order')}</span>
								<span onClick={handleLinkClick}>{t('FAQs')}</span>
							</div>
						</Stack>
						<Stack className={'right'}>
							<Box component={'div'} className={'instagram-container'}>
								<h3>{t('INSTAGRAM')}</h3>
								<div className="instagram-grid">
									<div className="instagram-image">
										<a
											href="https://www.instagram.com/abdulaziz__ibrokhimov/"
											target="_blank"
											rel="noopener noreferrer"
										>
											<img src="/img/watches/all.jpg" alt={t('Luxury watch')} />
										</a>
									</div>
									<div className="instagram-image">
										<a
											href="https://www.instagram.com/abdulaziz__ibrokhimov/"
											target="_blank"
											rel="noopener noreferrer"
										>
											<img src="/img/watches/watch2.jpg" alt={t('Luxury watch')} />
										</a>
									</div>
									<div className="instagram-image">
										<a
											href="https://www.instagram.com/abdulaziz__ibrokhimov/"
											target="_blank"
											rel="noopener noreferrer"
										>
											<img src="/img/watches/watch3.jpg" alt={t('Luxury watch')} />
										</a>
									</div>
									<div className="instagram-image">
										<a
											href="https://www.instagram.com/abdulaziz__ibrokhimov/"
											target="_blank"
											rel="noopener noreferrer"
										>
											<img src="/img/watches/watch1.jpg" alt={t('Luxury watch')} />
										</a>
									</div>
									<div className="instagram-image">
										<a
											href="https://www.instagram.com/abdulaziz__ibrokhimov/"
											target="_blank"
											rel="noopener noreferrer"
										>
											<img src="/img/watches/watch5.jpg" alt={t('Luxury watch')} />
										</a>
									</div>
									<div className="instagram-image">
										<a
											href="https://www.instagram.com/abdulaziz__ibrokhimov/"
											target="_blank"
											rel="noopener noreferrer"
										>
											<img src="/img/watches/watch6.jpg" alt={t('Luxury watch')} />
										</a>
									</div>
								</div>
							</Box>
						</Stack>
					</Stack>
					<Stack className={'second'}>
						<span>{t('© Copyright 2025 | Éclipse By Aiden. Powered by Devex.')}</span>
						<div className={'payment-methods'}>
							<img src="/img/payment/visa.jpg" alt="Visa" />
							<img src="/img/payment/mastercard.jpg" alt="Mastercard" />
							<img src="/img/payment/paypal.png" alt="PayPal" />
							<img src="/img/payment/amex.png" alt="American Express" />
						</div>
						<a href="https://t.me/Ibrokhimov_1407" target="_blank" rel="noopener noreferrer">
							<span>{t('Contact Developer')}</span>
						</a>
					</Stack>
				</Stack>
			</div>
		);
	}
};

export default Footer;