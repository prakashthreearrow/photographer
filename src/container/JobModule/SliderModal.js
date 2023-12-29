import React from "react";
import { Modal } from "reactstrap";
import { UncontrolledCarousel, ModalHeader } from "reactstrap";

const SliderModal = ({ isOpenModal, onHandleClose, sliderData, imageUrl }) => {
  const filterImageUrl = sliderData
    ?.filter((url) => /\.(jpe?g|png|webp)$/.test(url))
    .map((item) => {
      return {
        src: `${imageUrl}${item}`,
      };
    });
  return (
    <Modal
      isOpen={isOpenModal}
      toggle={onHandleClose}
      centered={true}
      fade={true}
      className="image-viewer"
      size="xl"
    >
      <ModalHeader toggle={onHandleClose}></ModalHeader>
      <UncontrolledCarousel
        className="carousel-fade"
        pause={true}
        items={filterImageUrl}
      />
    </Modal>
  );
};

export default SliderModal;
