import styles from './ImageGalleryItem.module.css';

export const ImageGalleryItem = ({
  webformatURL,
  tags,
  largeImageURL,
  onClick,
}) => (
  <li
    className={styles.ImageGalleryItem}
    onClick={() => onClick(largeImageURL, tags)}
  >
    <img
      src={webformatURL}
      alt={tags}
      className={styles['ImageGalleryItem-image']}
    />
  </li>
);
