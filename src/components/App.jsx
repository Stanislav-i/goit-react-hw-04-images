import React, { Component } from 'react';
import { fetchPictures } from 'services/api';
import { Vortex } from 'react-loader-spinner';
import { toast } from 'react-toastify';
//PROPTYPES

import { Searchbar } from './Searchbar/Searchbar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Modal } from './Modal/Modal';
import { ButtonLoadMore } from './Button/Button';

const toastConfig = {
  position: 'top-center',
  autoClose: 1000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: 'light',
};

export class App extends Component {
  state = {
    userRequest: '',
    picturesArray: [],
    isLoading: false,
    error: null,
    page: 1,
    modal: {
      isOpen: false,
      fullSizeuUrl: '',
    },
    showButton: false,
  };

  onModalOpen = data => {
    this.setState({
      modal: {
        isOpen: true,
        fullSizeuUrl: data,
      },
    });
  };

  onModalClose = () => {
    this.setState({
      modal: {
        isOpen: false,
        fullSizeuUrl: '',
      },
    });
  };

  onSearchClick = e => {
    e.preventDefault();
    const form = e.currentTarget;
    const searchQuery = form.elements.searchQueryInput.value;

    if (searchQuery.trim() === '') {
      return toast.warning(`Type something :)`, toastConfig);
    } else if (searchQuery.trim() === this.state.userRequest) {
      form.reset();
      return toast.warning(`Ahahahaha! Type something NEW ;)`, toastConfig);
    } else window.scrollTo(0, 0);
    this.addUserRequest(searchQuery);
    form.reset();
  };

  onLoadButtonClick = () => {
    this.setState(prevState => {
      return { page: prevState.page + 1 };
    });
  };

  addUserRequest(string) {
    this.setState({ userRequest: string, page: 1, showButton: false });
  }

  async componentDidUpdate(prevProps, prevState) {
    const searchQuery = this.state.userRequest;
    const page = this.state.page;

    if (
      prevState.userRequest !== this.state.userRequest ||
      prevState.page !== this.state.page
    )
      try {
        this.setState({ isLoading: true });
        await fetchPictures(searchQuery, page).then(responce => {
          const newPicturesArray = responce.data.hits;
          const picturesNumber = responce.data.totalHits;

          if (
            prevState.userRequest !== this.state.userRequest &&
            newPicturesArray.length === 0
          ) {
            this.setState({
              picturesArray: [],
            });
            toast.warning(
              `We haven't found anything... Let's try something else?`,
              toastConfig
            );
          } else if (
            prevState.userRequest !== this.state.userRequest &&
            newPicturesArray.length === 12
          ) {
            this.setState({
              picturesArray: newPicturesArray,
              showButton: true,
            });
            toast.success(
              `Great! We've found ${picturesNumber} images!`,
              toastConfig
            );
          } else if (
            prevState.userRequest !== this.state.userRequest &&
            newPicturesArray.length < 12
          ) {
            this.setState({ picturesArray: newPicturesArray });
            toast.success(
              `Great! We've found ${picturesNumber} images!`,
              toastConfig
            );
          } else if (
            prevState.userRequest === this.state.userRequest &&
            prevState.page !== this.state.page &&
            newPicturesArray.length === 12
          ) {
            this.setState(prevState => {
              return {
                picturesArray: [
                  ...prevState.picturesArray,
                  ...newPicturesArray,
                ],
              };
            });
          } else if (
            prevState.userRequest === this.state.userRequest &&
            prevState.page !== this.state.page &&
            newPicturesArray.length < 12
          ) {
            this.setState(prevState => {
              return {
                picturesArray: [
                  ...prevState.picturesArray,
                  ...newPicturesArray,
                ],
                showButton: false,
              };
            });
          } else if (
            prevState.userRequest === this.state.userRequest &&
            prevState.page !== this.state.page &&
            newPicturesArray.length === 0
          ) {
            this.setState({
              showButton: false,
            });
            toast(
              "We're sorry, but you've reached the end of search results.",
              toastConfig
            );
          }
        });
      } catch (error) {
        this.setState({ error: error.message });
        toast.error(error.message, toastConfig);
      } finally {
        this.setState({ isLoading: false });
      }
  }

  render() {
    return (
      <div>
        <Searchbar onSubmit={this.onSearchClick} />

        {this.state.isLoading && (
          <Vortex
            visible={true}
            height="300"
            width="300"
            ariaLabel="vortex-loading"
            wrapperStyle={{}}
            wrapperClass="vortex-wrapper"
            colors={['red', 'green', 'blue', 'yellow', 'orange', 'purple']}
          />
        )}

        {this.state.picturesArray.length > 0 && (
          <ImageGallery
            data={this.state.picturesArray}
            openModal={this.onModalOpen}
          />
        )}

        {this.state.modal.isOpen && (
          <Modal
            fullSizeuUrl={this.state.modal.fullSizeuUrl}
            closeModal={this.onModalClose}
          />
        )}

        {this.state.showButton && (
          <ButtonLoadMore onClick={this.onLoadButtonClick} />
        )}
      </div>
    );
  }
}
