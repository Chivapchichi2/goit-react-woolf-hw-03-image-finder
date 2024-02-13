import styles from './Notification.module.css';

export const Notification = ({ message }) => (
  <p className={styles.Notification}>{message}</p>
);
