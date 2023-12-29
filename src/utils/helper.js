import PropTypes from "prop-types";
export const getLocalStorageItem = (key) => localStorage.getItem(key);
export const setLocalStorageItem = (key, value) =>
  localStorage.setItem(key, value);
export const removeLocalStorageItem = (key) => localStorage.removeItem(key);
export const url =
  process.env.REACT_APP_API_ENDPOINT || "http://192.168.1.172:3001/";

export const makeRandomNumber = (length) => {
  let result = ''
  const characters = '0123456789'
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
};

export const priceFormat = (price) => {
  var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    // These options are needed to round to whole numbers if that's what you want.
    //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
  });
  return formatter.format(price);
}

export const ErrorToast = ({ msg }) => (
  <div>
    <svg
      width="1.0625em"
      height="1em"
      viewBox="0 0 17 16"
      className="bi bi-exclamation-triangle mb-1 mr-1"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        d="M7.938 2.016a.146.146 0 0 0-.054.057L1.027 13.74a.176.176 0 0 0-.002.183c.016.03.037.05.054.06.015.01.034.017.066.017h13.713a.12.12 0 0 0 .066-.017.163.163 0 0 0 .055-.06.176.176 0 0 0-.003-.183L8.12 2.073a.146.146 0 0 0-.054-.057A.13.13 0 0 0 8.002 2a.13.13 0 0 0-.064.016zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z"
      />
      <path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995z" />
    </svg>
    &nbsp;&nbsp;
    {msg}
  </div>
);
ErrorToast.propTypes = {
  msg: PropTypes.string,
};

export const SuccessToast = ({ msg }) => (
  <div>
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 16 16"
      className="bi bi-check-circle mb-1 mr-1"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"
      />
      <path
        fillRule="evenodd"
        d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.236.236 0 0 1 .02-.022z"
      />
    </svg>
    &nbsp;&nbsp;
    {msg}
  </div>
);
SuccessToast.propTypes = {
  msg: PropTypes.string,
};

export const WarningToast = ({ msg }) => (
  <div>
    <svg
      width="1.0625em"
      height="1em"
      viewBox="0 0 17 16"
      className="bi bi-exclamation-triangle mb-1 mr-1"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        d="M7.938 2.016a.146.146 0 0 0-.054.057L1.027 13.74a.176.176 0 0 0-.002.183c.016.03.037.05.054.06.015.01.034.017.066.017h13.713a.12.12 0 0 0 .066-.017.163.163 0 0 0 .055-.06.176.176 0 0 0-.003-.183L8.12 2.073a.146.146 0 0 0-.054-.057A.13.13 0 0 0 8.002 2a.13.13 0 0 0-.064.016zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z"
      />
      <path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995z" />
    </svg>
    &nbsp;&nbsp;
    {msg}
  </div>
);
WarningToast.propTypes = {
  msg: PropTypes.string,
};

/**
 *Picture path to canvas
 *@ param {image URL} URL
 */
export async function imgToCanvas(url) {
  //Create img element
  const img = document.createElement("img");
  img.src = url;
  img.setAttribute("crossorigin", "anonymous"); // prevent failed to execute 'todataurl' on 'htmlcanvas element' caused by cross domain: tainted canvas may not be exported
  await new Promise((resolve) => (img.onload = resolve));
  //Create the canvas DOM element and set its width and height to be the same as the picture
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  //The coordinates (0,0) indicate that the drawing starts from here and is equivalent to an offset.
  canvas.getContext("2d").drawImage(img, 0, 0);
  return canvas;
}

/**
 *Add watermark to canvas
 *@ param {canvas object} canvas
 *@ param {watermark text} text
 */
export function addWatermark(canvas, text) {
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "grey";
  ctx.textBaseline = "middle";
  ctx.font = "80px Arial";
  ctx.textAlign = "center";
  ctx.fillText(text, 300, 450);
  
  return canvas;
}

/**
 *Convert canvas to img
 *@ param {canvas object} canvas
 */
export function convasToImg(canvas) {
  //Create a new image object, which can be understood as dom
  var image = new Image();
  // canvas.toDataURL  It returns a string of Base64 encoded URLs
  //Specified format png
  image.src = canvas.toDataURL("image/png");

  var file = dataURLtoFile(image.src, 'hello.png');
  return file;
}

function dataURLtoFile(dataurl, filename) {

  var arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
}
