import PropTypes from 'prop-types';
import css from './modal.module.css';
import React, { Component } from 'react';

export class Modal extends Component {
  handleKeyDown = e => {
    if (e.code === 'Escape') {
      this.props.closeModal();
    }
  };

  handleOverlayClick = e => {
    if (e.currentTarget === e.target) {
      this.props.closeModal();
    }
  };

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  render() {
    return (
      <div onClick={this.handleOverlayClick} className={css.Overlay}>
        <div className={css.Modal}>
          <img src={this.props.fullSizeuUrl} alt="" />
        </div>
      </div>
    );
  }
}

Modal.propTypes = {
  fullSizeuUrl: PropTypes.string,
  closeModal: PropTypes.func,
};