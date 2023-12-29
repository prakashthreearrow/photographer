import React, { memo } from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { ToastContainer, Slide } from "react-toastify";
import PropTypes from "prop-types";
import store from "./redux/store";
import Routes from "./routes";
import "./libcss";
import './i18n';
import $ from "jquery";

const CloseButton = ({ closeToast }) => (
  <i
    className="fa fa-times-circle align-self-center f-18"
    onClick={closeToast}
  />
);
CloseButton.propTypes = {
  closeToast: PropTypes.func,
};

const MainApp = memo(() => {

  return (
    <Provider store={store}>
      <Routes />
      <ToastContainer
        autoClose={5000}
        draggable={false}
        transition={Slide}
        closeButton={CloseButton}
        hideProgressBar={false}
        position="top-center"
        toastClassName="toast-notification"
      />
    </Provider>
    
  );
});

const rootElement = document.getElementById("root");

render(<MainApp />, rootElement);