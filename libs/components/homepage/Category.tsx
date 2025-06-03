import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';

const WatchCollection = () => {
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const { t } = useTranslation('common');

  const categories = [
    {
      id: 1,
      title: t('Crafted Precision'),
      subtitle: t("Explore Men's Signature Watch"),
      buttonText: t('SHOP COLLECTION'),
      detailLink: '/property/detail?id=6826114365bfa1a9fc1aecb9',
      image: '/img/watches/1.jpeg',
      products: [
        {
          id: '6826114365bfa1a9fc1aecb9',
          name: 'Sea-Dweller',
          price: 9425.00,
          image: '/img/watches/new23.webp'
        }
      ]
    },
    {
      id: 2,
      title: t('Luxury Hers Alone'),
      subtitle: t('Elegant Timepieces for Women'),
      buttonText: t('SHOP NOW'),
      detailLink: '/property/detail?id=68249cc665bfa1a9fc1ae9ba',
      image: '/img/watches/omega.avif',
      products: [
        {
          id: '68249cc665bfa1a9fc1ae9ba',
          name: 'Omega De Prestige',
          price: 5100.00,
          image: '/img/watches/new19.webp'
        }
      ]
    },
    {
      id: 3,
      title: t('Elegance For Every Wrist'),
      subtitle: t('Timeless Unisex Designs'),
      buttonText: t('SHOP NOW'),
      detailLink: '/property/detail?id=68209c76cafa27a47cb34f0c',
      image: '/img/watches/jaegar.jpg',
      products: [
        {
          id: '68209c76cafa27a47cb34f0c',
          name: 'Jaeger-LeCoultre',
          price: 13500.00,
          image: '/img/watches/new13.webp'
        }
      ]
    }
  ];

  const handleShopClick = () => {
    window.location.href = '/property';
  };

  const handleDetailClick = (link: string) => {
    window.location.href = link;
  };

  const toggleCard = (id: number) => {
    setActiveCard(activeCard === id ? null : id);
  };

  return (
    <div className="watch-collection">
      {categories.map((category) => (
        <div key={category.id} className="watch-card">
          <div 
            className="watch-image-container"
            style={{ backgroundImage: `url(${category.image})` }}
          >
            <div 
              className="plus-button" 
              onClick={() => toggleCard(category.id)}
            >
              {activeCard === category.id ? '×' : '+'}
            </div>
          </div>
          <div className="watch-content">
            <h2>{category.title}</h2>
            <p>{category.subtitle}</p>
            <button className="shop-button" onClick={handleShopClick}>
              {category.buttonText}
            </button>
          </div>

          {activeCard === category.id && (
            <div className="product-detail-card">
              <div className="product-image-container">
                <img src={category.products[0].image} alt={category.products[0].name} />
              </div>
              <div className="product-info">
                <h3>{category.products[0].name}</h3>
                <p className="price">${category.products[0].price.toLocaleString()}</p>
                <button 
                  className="view-detail-button"
                  onClick={() => handleDetailClick(category.detailLink)}
                >
                  {t('VIEW DETAILS')}
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default WatchCollection;