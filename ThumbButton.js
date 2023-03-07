import { Link } from 'react-router-dom';

import './multiTypeImg.css';
import Viewer from '../../utility/Viewer/Viewer';

const dirThumb = process.env.REACT_APP_DIR_THUMB;

function ThumbButton(props) {
  // console.log('ThumbButton function started');
  const {
    chosenImageId,
    chosenTypeId,
    display,
    imageId,
    imageName,
    imagePath,
    pageId,
  } = props;
  const buttId = 'thumButt' + imageId;
  const imagePathAdj = dirThumb + imagePath;
  const thisUrl = `/multiple_types_n_images/${pageId}/${chosenTypeId}/${imageId}/stopped`;
  let thisButtonClass;

  if (display === 'column') {
    thisButtonClass = 'column-button';
    if (imageId === +chosenImageId) {
      thisButtonClass += ' column-button-chosen';
    }
  } else {
    thisButtonClass = 'grid-button';
    if (imageId === +chosenImageId) {
      thisButtonClass += ' grid-button-chosen';
    }
  }

  return (
    <>
      <div
        className={thisButtonClass}
        id={buttId}
        onMouseOver={() => {
          const element = document.querySelector('.footer-wrapper');
          const themeColor = getComputedStyle(element).backgroundColor;
          let thisButt = document.getElementById(buttId);
          if (imageId === +chosenImageId) {
            thisButt.style.borderColor = themeColor;
          } else {
            thisButt.style.borderColor = 'white';
          }
        }}
        onMouseMove={() => {
          // kludge to get the border color to change just after a click
          const element = document.querySelector('.footer-wrapper');
          const themeColor = getComputedStyle(element).backgroundColor;
          if (imageId === +chosenImageId) {
            let thisButt = document.getElementById(buttId);
            thisButt.style.borderColor = themeColor;
          }
        }}
        onMouseOut={() => {
          let thisButt = document.getElementById(buttId);
          thisButt.style.borderColor = '';
        }}
      >
        <div>
          <Link to={thisUrl} style={{ textDecoration: 'none' }}>
            <div>
              {display === 'column' ? <div>{imageName}</div> : ''}
              <Viewer imagePath={imagePathAdj} imageName={imageName} />
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}

export default ThumbButton;
