/*///////////////////////////////////////////////////////////////
  - page can be entered via...
          - url: home page generic image (which is also a button)
          - url: footer button
          - url: deep link
          - history(url): carousel advancing to next image
          - props: admin user's setup (as a preview of proposed setup data)

  - carousel does not continuously cycle through a code loop.
      Instead it uses react-router-dom's history method to repeat the component build process
  - on site first load, default is to cycle if the type allows
  - won't cycle if: url parameter includes "stopped" or props are used (admin preview) 
  - exactly which page, type and image are presented is based upon url params or props (admin preview)
  - if cycle...
        - spinner icon fades in
        - setTimer starts
        - at end of full timer chain, history method is invoked to start the process all over
        - only one timer id exists at a time
  - if stopped, pause icon becomes visible
  - thumbnail image buttons link to their imageId, with stopped flag
  - type button menu visibility is controlled by typeButtonsView_state
        - when slid off-screen to left, its icon visibility is controlled by typeButtonsIconHide_state
    
  - functions
        carouselControlOnClick()
        largeImageDisplay()
        touchToggler()
        thumbButtonsBuild()
        timeoutActions(type)
        typeButtonsMouse(action)
        typeButtonsBuild()
        typeButtonsHide()

  - useEffects
        [ ]
        [ pagesObj_sel ]

  - dispatches
      - MTI_TYPES_IMAGE_VIEWED_OBJ (see typesImageViewedObj comment below)
        
  - carousel control icon management process
      - icons are layered in place in upper right of viewer
      - their visibility is controled by classes
      - their classes are set by component state variables


  - page must accommodate...
      - carousel change (if cycling) changes...
          - main image 
          - border around thumbnail image
          - url image number
      - user clicking on any thumbnail image changes...
          - main image
          - border around chosen thumbnail
          - url image number
          - carousel cycle stops
      - user clicking on carousel spinner icon
          - carousel cycle stops
          - pause icon replaces spinner icon
          - shortly thereafter, play icon replaces pause icon
      - user clicking on carousel play icon
          - carousel cycle begins again
          - spinner becomes visible
          - pause icon replaces play icon
      - user refreshing the page
          - same page, type and image should be visible
          - cycle or stopped depends on url

  - each page object is formated to accomplish multiple purposes
          - for page components (Single, MultiType and MultiTypeImg) to display
          - for admin setup (see VIP component for details)

  - typesImageViewedObj 
          - keeps track of the last image viewed for each type
          - when the user launches the page, the image is chosen in this order...
                1) from the url parameter or prop
                2) from the previously viewed image id from the typesImageViewedObj
                3) from the first image in the type's image sort array

    - sorting of types is accomplished with an array of objects
          - these arrays are built by SetupStore.js component
          - format is [{id: type_id, ordr: type_ordr}, ...]
          - a .map method is used on this array to  build types for display
    - sorting of images is accomplished in the same manner as for types

*/

import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import './multiTypeImg.css';

import {
  CgChevronRight,
  CgPlayPauseO,
  CgPlayButtonO,
  CgSpinner,
} from 'react-icons/cg';
import ThumbButton from './ThumbButton';
import TypeButtonMTI from './TypeButtonMTI';
import Viewer from '../../utility/Viewer/Viewer';

const dirFull = process.env.REACT_APP_DIR_FULL;

function MultiTypeImg(props) {
  // console.log('MultiTypeImg.js started.');
  const dispatch = useDispatch();
  const history = useHistory();

  ////////////////////////////////////////////////////////////////
  // establish variables

  // select data from store
  const typesImageViewedObj_sel = useSelector(
    (state) => state.typesImageViewedObj.payload
  );
  const pagesObj_sel = useSelector((state) => state.pagesObj.payload);

  // state for component
  const [imagePath_state, setImagePath] = useState('');
  const [pauseVisible_state, setPauseVisible] = useState('');
  const [playVisible_state, setPlayVisible] = useState('');
  const [spinnerVisible_state, setSpinnerVisible] = useState('');
  const [viewerVisible_state, setViewerVisible] = useState('opacity1');
  const [thumbButtons_state, setThumbButtons] = useState([]);
  const [typeButtonsView_state, setTypeButtonsView] = useState('');
  const [typeButtonsIconHide_state, setTypeButtonsIconHide] = useState('');

  // reference local state
  const caroFlag_ref = useRef();
  const chosenImageId_ref = useRef();
  const chosenTypeId_ref = useRef();
  const currentImageSortIndex_ref = useRef(0);
  const gridColumnDisplay_ref = useRef('');
  const imageName_ref = useRef('');
  const imageObj_ref = useRef();
  const imageSortArray_ref = useRef();
  const imageSortArrayLength_ref = useRef();
  const intervalCycleCount_ref = useRef(0);
  const pageId_ref = useRef('');
  const thisPage_ref = useRef();
  const thisStyle_ref = useRef('');
  const thisTypeObj_ref = useRef();
  const timoutId_ref = useRef();
  const touchToggledOn_ref = useRef('');
  const typeButtons_ref = useRef([]);
  const typeImgObjects_ref = useRef();
  const typeObjectsLength_ref = useRef();
  const typeSortArray_ref = useRef([]);

  // local variables
  let chosenTypeStyle = 'type-choosen-indicator';

  ////////////////////////////////////////////////////////////////
  // functions

  function carouselControlOnClick() {
    // console.log('carouselControlOnClick function started');
    if (caroFlag_ref.current !== 'stopped') {
      // carousel is running, stop it
      clearTimeout(timoutId_ref.current);
      setSpinnerVisible('');
      setPauseVisible('opacity1');
      timoutId_ref.current = setTimeout(timeoutActions, 500, 'finishPause');
      // in case user catches carousel in mid-change
      setViewerVisible('opacity1');
      // change displayed url to make copy-able for deep link
      let newPath = `/multiple_types_n_images/${pageId_ref.current}/${
        chosenTypeId_ref.current
      }/${typesImageViewedObj_sel[chosenTypeId_ref.current]}`;
      window.history.replaceState(null, null, `${newPath}/stopped`);
      caroFlag_ref.current = 'stopped';
    } else if (caroFlag_ref.current === 'stopped') {
      // otherwise: start the carousel
      let newPath = `/multiple_types_n_images/${pageId_ref.current}/${
        chosenTypeId_ref.current
      }/${typesImageViewedObj_sel[chosenTypeId_ref.current].id}`;
      window.history.replaceState(null, null, newPath);
      // confirm control icon visiblity
      setSpinnerVisible('opacity1');
      setPauseVisible('');
      setPlayVisible('');
      caroFlag_ref.current = '';
      timoutId_ref.current = setTimeout(timeoutActions, 500, 'advance');
    }
  }

  function largeImageDisplay() {
    // console.log('largeImageDisplay function started');
    if (typeImgObjects_ref.current !== undefined) {
      imageName_ref.current = imageObj_ref.current.image_name;
      setImagePath(dirFull + imageObj_ref.current.image_path);
    }
  }

  function touchToggler() {
    if (touchToggledOn_ref.current === '') {
      // console.log('touch: make visible');
      setTypeButtonsView('type-buttons-view');
      setTypeButtonsIconHide('type-buttons-icon-no-view');
      touchToggledOn_ref.current = 'on';
    } else {
      // console.log('touch: hide');
      setTypeButtonsView('');
      setTypeButtonsIconHide('');
      touchToggledOn_ref.current = '';
    }
  }

  function thumbButtonsBuild() {
    // build thumb buttons with selected thumb image highlighted
    setThumbButtons(
      imageSortArray_ref.current.map((sort, i) => {
        let tempImageObj = thisTypeObj_ref.current.images[sort.id];
        return (
          <ThumbButton
            key={`${i}-thumbButt`}
            chosenImageId={chosenImageId_ref.current}
            chosenTypeId={chosenTypeId_ref.current}
            display={gridColumnDisplay_ref.current}
            imageId={sort.id}
            imageName={tempImageObj.image_name}
            imagePath={tempImageObj.image_path}
            pageId={pageId_ref.current}
          />
        );
      })
    );
  }

  function timeoutActions(type) {
    // the first call to this fuction is from useEffect[ pageObj_sell ]
    //     then this function keeps performing setTimeouts to complete the cycle
    switch (true) {
      case type === 'advance':
        if (
          currentImageSortIndex_ref.current + 1 ===
          imageSortArrayLength_ref.current
        ) {
          // reset index to first image
          currentImageSortIndex_ref.current = 0;
        } else {
          // advance index to next sorted image
          currentImageSortIndex_ref.current += 1;
        }
        setSpinnerVisible('opacity1');
        const thisUrl = `/multiple_types_n_images/${pageId_ref.current}/${
          chosenTypeId_ref.current
        }/${imageSortArray_ref.current[currentImageSortIndex_ref.current].id}`;
        history.push(thisUrl);
        break;
      case type === 'displayCycleControl':
        setSpinnerVisible('opacity1');
        timoutId_ref.current = setTimeout(
          timeoutActions,
          4000,
          'hideCycleControl'
        );
        break;
      case type === 'finishPause':
        setPauseVisible('');
        setPlayVisible('opacity1');
        timoutId_ref.current = '';
        break;
      case type === 'hideCycleControl':
        setSpinnerVisible('');
        timoutId_ref.current = setTimeout(timeoutActions, 1000, 'advance');
        break;
      case type === 'hideTypeButtons':
        typeButtonsHide();
        if (caroFlag_ref.current !== 'stopped') {
          timoutId_ref.current = setTimeout(
            timeoutActions,
            2000,
            'displayCycleControl'
          );
        } else {
          setSpinnerVisible('');
          setPlayVisible('opacity1');
        }
        break;
      default:
      // no default needed here
    }
  }

  function typeButtonsMouse(action) {
    if (action === 'leave') {
      setTypeButtonsView('');
      setTypeButtonsIconHide('');
    } else if (action === 'over') {
      setTypeButtonsView('type-buttons-view');
      setTypeButtonsIconHide('type-buttons-icon-no-view');
    }
  }

  function typeButtonsBuild() {
    intervalCycleCount_ref.current = 0;
    setPauseVisible('');
    imageSortArrayLength_ref.current =
      thisTypeObj_ref.current.imageSortArray.length;
    typeButtons_ref.current = thisPage_ref.current.typeSortArray.map(
      (typeSorted, i) => {
        let pageTypes = thisPage_ref.current.types;
        let thisTypeId = typeSorted.id;
        if (thisTypeId === +chosenTypeId_ref.current) {
          // this is the chosen type, change its style so it's noticeable to user
          thisStyle_ref.current = chosenTypeStyle;
        } else {
          thisStyle_ref.current = '';
        }
        return (
          <TypeButtonMTI
            key={`${i}-typeButt`}
            chosenStyle={thisStyle_ref.current}
            pageId={pageId_ref.current}
            typeName={pageTypes[thisTypeId].type_name}
            typeId={typeSorted.id}
          />
        );
      }
    );
  }

  function typeButtonsHide() {
    setTypeButtonsView('');
    setTypeButtonsIconHide('');
  }

  ///////////////////////////////////////////////////////////////
  //   useEffects

  useEffect(() => {
    // [ ] when component opens, after full paint, and again at component close
    // console.log('useEffect[ ] started');
    // to have the type wrapper move out of sight on page load
    setTypeButtonsView('type-buttons-view');
    setTypeButtonsIconHide('type-buttons-icon-no-view');
    // when component unmounts: clear carousel Timeout
    return () => {
      clearTimeout(timoutId_ref.current);
      timoutId_ref.current = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // [ pagesObj_sel ]
    // when pagesObj_sel is available
    //    build preview page and type variables from props,
    //    otherwise from stored pages object
    // console.log('useEffect [ pagesObj_sel ] started');
    if (pagesObj_sel) {
      if (props.previewPage) {
        // preview: props get passed by superuser's setup pages
        caroFlag_ref.current = props.caroFlag;
        chosenImageId_ref.current = +props.imageId;
        chosenTypeId_ref.current = +props.typeId;
        pageId_ref.current = +props.pageId;
        thisPage_ref.current = props.pageObj;
      } else {
        // normal viewing: values from url parameters
        caroFlag_ref.current = props.match.params.caroFlag;
        chosenImageId_ref.current = props.match.params.imageId;
        chosenTypeId_ref.current = props.match.params.typeId;
        pageId_ref.current = +props.match.params.pageId;
        thisPage_ref.current = pagesObj_sel[pageId_ref.current];
        if (chosenTypeId_ref.current === undefined) {
          // no type id specified in url, set to sorted first
          chosenTypeId_ref.current = thisPage_ref.current.typeSortArray[0].id;
        } else {
          chosenTypeId_ref.current = +chosenTypeId_ref.current;
        }
      }
      // from either props or params, set common values
      imageSortArray_ref.current =
        thisPage_ref.current.types[chosenTypeId_ref.current].imageSortArray;
      thisTypeObj_ref.current =
        thisPage_ref.current.types[chosenTypeId_ref.current];
      gridColumnDisplay_ref.current = thisTypeObj_ref.current.type_display;
      typeImgObjects_ref.current = thisTypeObj_ref.current.images;
      typeSortArray_ref.current = thisPage_ref.current.typeSortArray;

      let tempViewedObj = {};
      if (!typesImageViewedObj_sel) {
        // first render that's complete with pagesObj_sel
        typeObjectsLength_ref.current =
          thisPage_ref.current.typeSortArray.length;
        thisPage_ref.current.typeSortArray.map((type, i) => {
          tempViewedObj[type.id] =
            thisPage_ref.current.types[type.id].imageSortArray[0].id;
          return '';
        });
      } else {
        tempViewedObj = JSON.parse(JSON.stringify(typesImageViewedObj_sel));
      }
      if (
        chosenImageId_ref.current === undefined ||
        chosenImageId_ref.current === '_'
      ) {
        // no type id specified in url, set to last viewed
        chosenImageId_ref.current = tempViewedObj[chosenTypeId_ref.current];
        // update browser's url field
        let newPath = `/multiple_types_n_images/${pageId_ref.current}/${chosenTypeId_ref.current}/${chosenImageId_ref.current}`;
        window.history.replaceState(
          null,
          null,
          `${newPath}/${caroFlag_ref.current}`
        );
      }
      imageObj_ref.current =
        typeImgObjects_ref.current[chosenImageId_ref.current];

      // remember that this image was viewed
      tempViewedObj[chosenTypeId_ref.current] = chosenImageId_ref.current;
      // remember viewed object in store so will be available if/when user returns
      dispatch({
        type: 'MTI_TYPES_IMAGE_VIEWED_OBJ',
        payload: {
          payload: tempViewedObj,
        },
      });
      // determine where this image fit into the sort order (so carousel can continue)
      currentImageSortIndex_ref.current = imageSortArray_ref.current.findIndex(
        (i) => i.id === +chosenImageId_ref.current
      );
      if (pagesObj_sel) {
        typeButtonsBuild();
        thumbButtonsBuild();
        largeImageDisplay();
        // start the long chain of setTimeout actions
        timoutId_ref.current = setTimeout(
          timeoutActions,
          3000,
          'hideTypeButtons'
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagesObj_sel]);

  ////////////////////////////////////////////////////////////////
  // return the page

  return (
    <>
      {!imagePath_state ? (
        <h3>imagePath_state undefined</h3>
      ) : (
        <>
          <div
            className={`type-button-wrapper-mti ${typeButtonsView_state}`}
            onMouseOver={() => typeButtonsMouse('over')}
            onMouseOut={() => typeButtonsMouse('leave')}
            onTouchStart={() => touchToggler()}
          >
            <div>{typeButtons_ref.current}</div>
            <div>
              <CgChevronRight
                className={`type-buttons-icon ${typeButtonsIconHide_state}`}
              />
            </div>
          </div>
          <div className="wrapper-outer-mti">
            <div className="title-mti">{thisTypeObj_ref.current.type_name}</div>

            <div className="wrapper-inner-mti">
              <div className="surround-mti">
                {gridColumnDisplay_ref.current === 'column' ? (
                  <div className="column-wrapper">{thumbButtons_state}</div>
                ) : (
                  <div className="grid-wrapper">{thumbButtons_state}</div>
                )}

                <div className="image-display-mti">
                  {pagesObj_sel ? (
                    <div className={`viewer-wrapper ${viewerVisible_state}`}>
                      <Viewer
                        imagePath={imagePath_state}
                        imageName={imageName_ref.current}
                      />
                    </div>
                  ) : (
                    ''
                  )}
                </div>
              </div>
              <div
                className="carousel-status-icon-wrapper"
                onClick={() => carouselControlOnClick()}
              >
                <CgSpinner
                  className={`carousel-icons ${spinnerVisible_state}`}
                  id="carousel-icon-spinner"
                />
                <CgPlayPauseO
                  className={`carousel-icons ${pauseVisible_state}`}
                  id="carousel-icon-pause"
                />
                <CgPlayButtonO
                  className={`carousel-icons ${playVisible_state}`}
                  id="carousel-icon-play"
                />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default MultiTypeImg;
