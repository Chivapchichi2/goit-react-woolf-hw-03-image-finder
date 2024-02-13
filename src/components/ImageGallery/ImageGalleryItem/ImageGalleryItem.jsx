import styles from './ImageGalleryItem.module.css';

export const ImageGalleryItem = ({ webformatURL, tags, largeImageURL }) => (
  <li className={styles.ImageGalleryItem}>
    <img
      src={webformatURL}
      alt={tags}
      data-url={largeImageURL}
      className={styles['ImageGalleryItem-image']}
    />
  </li>
);
