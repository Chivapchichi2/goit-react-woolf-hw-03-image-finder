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
    query: '',
    images: [],
    error: '',
    loader: false,
    showModal: false,
    url: '',
    tag: '',
    showNoMassage: false,
    showBtn: false,
  };

  componentDidUpdate(prevProps, prevState) {
    const { query, page } = this.state;
    if (query !== prevState.query || page !== prevState.page) {
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
    this.setState({ loader: true, showNoMassage: false });
    return findImage(query, page)
      .then(({ hits, totalHits }) => {
        if (hits.length === 0) {
          this.setState({ showNoMassage: true, showBtn: false });
        } else {
          this.setState(prevState => ({
            images: [...prevState.images, ...hits],
            error: '',
            showBtn: this.state.page < Math.ceil(totalHits / 12),
            showNoMassage: false,
          }));
        }
      })
      .catch(error => this.setState({ error }))
      .finally(() => this.setState({ loader: false }));
  };

  handleOnButtonClick = () => {
    this.setState(prevState => ({
      page: prevState.page + 1,
    }));
  };

  handleFormData = ({ query }) => {
    this.setState({
      page: 1,
      query,
      images: [],
      error: '',
    });
  };

  handleImageClick = (url = '', tag = '') => {
    this.setState({
      url,
      tag,
      loader: true,
    });
    this.toggleModal();
  };

  toggleModal = () => {
    this.setState(prevState => ({ showModal: !prevState.showModal }));
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
        {this.state.showNoMassage && <Notification message="No images found" />}
        {loader && !showModal && <Loader />}
        {!loader && this.state.showBtn && (
          <Button onClick={this.handleOnButtonClick} />
        )}
      </div>
    );
  }
}
