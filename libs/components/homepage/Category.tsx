import { Stack } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const Category = () => {
  const router = useRouter();

  const handleNavigate = (category: string) => {
    const input = {
      page: 1,
      limit: 9,
      sort: 'createdAt',
      direction: 'DESC',
      search: {
        pricesRange: { start: 0, end: 20000 },
        propertyCategory: [category],
      },
    };

    const encodedInput = encodeURIComponent(JSON.stringify(input));
    router.push(`/property?input=${encodedInput}`);
  };

  return (
    <Stack className={"category-frame"}>
      <section className="product-category">
        <div className="left" onClick={() => handleNavigate('MALE')}>
          <Image
            src="/img/watches/bentley.jpg"
            alt="watch"
            fill
            className="image"
          />
          <div className="content">
          <h2>Check Out The<br />Latest Men's<br />Watch Collection</h2>
            <button onClick={(e) => {
              e.stopPropagation();
              handleNavigate('MALE');
            }}>SHOP COLLECTION</button>
          </div>
        </div>

        <div className="right">
          <div className="top" onClick={() => handleNavigate('FEMALE')}>
            <Image
              src="/img/watches/lady.jpg"
              alt="watch"
              fill
              className="image"
            />
            <div className="content">
            <h3>Shop Stylish<br />Women's Watches</h3>
              <button onClick={(e) => {
                e.stopPropagation();
                handleNavigate('FEMALE');
              }}>SHOP NOW</button>
            </div>
          </div>

          <div className="bottom" onClick={() => handleNavigate('UNISEX')}>
            <Image
              src="/img/watches/unisex.jpg"
              alt="watch"
              fill
              className="image"
            />
            <div className="content">
            <h3>Discover Stylish<br />Watches for Everyone</h3>
              <button onClick={(e) => {
                e.stopPropagation();
                handleNavigate('UNISEX');
              }}>SHOP NOW</button>
            </div>
          </div>
        </div>
      </section>
    </Stack>
  );
};

export default Category;
