import styles from './App.module.css';
import { findImage } from '../services/api';
import { Component } from 'react';
import { Searchbar } from './Searchbar/Searchbar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Modal } from './Modal/Modal';
import { Loader } from './Loader/Loader';
import { Button } from './Button/Button';
import { Notification } from './Notification/Notification';
export class App extends Component {
  state = {
    page: 1,
    totalPages: 1,
    query: '',
    images: [],
    error: '',
    loader: false,
    showModal: false,
    url: '',
    tag: '',
    isImagesFound: false,
  };

  componentDidUpdate(prevProps, prevState) {
    const { query } = this.state;
    if (query !== prevState.query) {
      this.fetchImages()
        .catch(error => this.setState({ error }))
        .finally(() => this.setState({ loader: false }));
    }
  }

  componentDidCatch(error) {
    this.setState({ error });
  }

  fetchImages = () => {
    const { query, page } = this.state;
    this.setState({ loader: true });
    return findImage(query, page).then(data => {
      this.setState(prevState => ({
        images: [...prevState.images, ...data.hits],
        page: prevState.page + 1,
        error: '',
        isImagesFound: data.hits.length > 0,
      }));
      this.setTotalPages(data.totalHits);
    });
  };

  setTotalPages = totalHits => {
    this.setState({
      totalPages: Math.ceil(totalHits / 12),
    });
  };

  handleOnButtonClick = () => {
    this.fetchImages()
      .then(() =>
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: 'smooth',
        })
      )
      .catch(error => this.setState({ error }))
      .finally(() => this.setState({ loader: false }));
  };

  handleFormData = ({ query }) => {
    this.setState({
      page: 1,
      query,
      images: [],
      error: '',
    });
  };

  handleImageClick = ({ target }) => {
    if (target.nodeName !== 'IMG') {
      return;
    }
    const { url } = target.dataset;
    const tag = target.alt;
    this.setState({
      url,
      tag,
      loader: true,
    });
    this.toggleModal();
  };

  toggleModal = () => {
    this.setState(prevState => ({ showModal: !prevState.showModal }));
    document.documentElement.style.overflow = this.state.showModal
      ? 'auto'
      : 'hidden';
  };

  hideLoaderInModal = () => this.setState({ loader: false });

  render() {
    const { images, error, loader, showModal, url, tag } = this.state;
    return (
      <div className={styles.App}>
        {showModal && (
          <Modal onClose={this.toggleModal} onClick={this.handleImageClick}>
            {loader && <Loader />}
            <img src={url} alt={tag} onLoad={this.hideLoaderInModal} />
          </Modal>
        )}
        <Searchbar onSubmit={this.handleFormData} />
        {error && <Notification message="Something wrong :(" />}
        {Boolean(images.length) && (
          <ImageGallery images={images} onClick={this.handleImageClick} />
        )}
        {!Boolean(images.length) && this.state.totalPages === 0 && (
          <Notification message="No images found" />
        )}
        {loader && !showModal && <Loader />}
        {!loader &&
          Boolean(images.length) &&
          this.state.page <= this.state.totalPages && (
            <Button onClick={this.handleOnButtonClick} />
          )}
      </div>
    );
  }
}
