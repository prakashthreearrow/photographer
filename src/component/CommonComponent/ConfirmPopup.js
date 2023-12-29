import React from "react";
import PropTypes from "prop-types";

import WarningImg from "../../assets/images/warning.png";
import { Button } from "./index";

const ConfirmPopup = ({
  isConfirmPopup,
  setConfirmPopup,
  handleWithEmailSubmit,
  handleWithoutEmailSubmit,
  question,
}) => {
  return (
    <>
      <div
        className={`modal fade ${
          isConfirmPopup ? "show d-block bg-blur" : "d-none"
        }`}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header text-white bg-red border-bottom-0">
              <h5 className="modal-title">Confirm</h5>
              <i
                className="fa fa-close cursor-pointer"
                onClick={() => setConfirmPopup(false)}
              />
            </div>
            <div className="d-flex px-2 py-3">
              <div className="flex-shrink-0">
                <img className="" src={WarningImg} alt="WarningImg" />
              </div>
              <div className="flex-grow-1 ms-3">
                {question}
                <br />
                You can&apos;t undo this action.
              </div>
            </div>
            <div className="modal-footer pt-4 pb-3">
              <Button
                className="col-12 col-md-8 mx-auto mb-2"
                text="Publish without sending emails"
                onClick={handleWithoutEmailSubmit}
              />
              <Button
                className="col-12 col-md-8 mx-auto mb-2"
                text="Publish and send emails"
                onClick={handleWithEmailSubmit}
              />
              <button
                type="button"
                className="btn col-5 mx-auto"
                onClick={() => setConfirmPopup(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

ConfirmPopup.propTypes = {
  isConfirmPopup: PropTypes.bool,
  setConfirmPopup: PropTypes.func,
  handleWithEmailSubmit: PropTypes.func,
  handleWithoutEmailSubmit: PropTypes.func,
  question: PropTypes.string,
};

export default ConfirmPopup;
