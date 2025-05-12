
import { Stack } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const Category = () => {
  const router = useRouter();

  const navigate = () => router.push('/property');

  return (
    <Stack className={"category-frame"}>
    <section className="product-category">
      <div className="left" onClick={navigate}>
        <Image
          src="/img/watches/male.jpg"
          alt="watch"
          fill
          className="image"
        />
        <div className="content">
          <h2>Check Out The<br />Latest Collection<br />Of Watches</h2>
          <button>SHOP COLLECTION</button>
        </div>
      </div>

      <div className="right">
        <div className="top" onClick={navigate}>
          <Image
            src="/img/watches/lady.jpg"
            alt="watch"
            fill
            className="image"
          />
          <div className="content">
            <h3>Shop Stylish<br />Watches</h3>
            <button>SHOP NOW</button>
          </div>
        </div>

        <div className="bottom" onClick={navigate}>
          <Image
            src="/img/watches/unisex.jpg"
            alt="watch"
            fill
            className="image"
          />
          <div className="content">
            <h3>Top Branded<br />Watches</h3>
            <button>SHOP NOW</button>
          </div>
        </div>
      </div>
    </section>
    </Stack>
  );
};

export default Category;
