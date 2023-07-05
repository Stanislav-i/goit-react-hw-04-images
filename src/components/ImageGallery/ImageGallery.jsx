import PropTypes from 'prop-types';
import css from './imageGallery.module.css';
import { ImageGalleryItem } from 'components/ImageGalleryItem/ImageGalleryItem';

export const ImageGallery = ({ data, openModal }) => {
  return (
    <>
      <ul className={css.imageGallery}>
        {data.map(({ id, webformatURL, largeImageURL }) => (
          <ImageGalleryItem
            key={id}
            pictureUrl={webformatURL}
            openModal={openModal}
            modalPictureUrl={largeImageURL}
          />
        ))}
      </ul>
    </>
  );
};

ImageGallery.propTypes = {
  data: PropTypes.array,
  openModal: PropTypes.func,
};
