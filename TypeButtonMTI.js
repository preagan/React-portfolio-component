import { Link } from 'react-router-dom';

import './multiTypeImg.css';

function TypeButtonMTI(props) {
  const { chosenStyle, pageId, typeName, typeId } = props;
  const thisStyle = `type-button-mti ${chosenStyle}`;

  return (
    <Link
      to={`/multiple_types_n_images/${pageId}/${typeId}/_/stopped`}
      style={{ textDecoration: 'none' }}
    >
      <div className={thisStyle}>{typeName}</div>
    </Link>
  );
}

export default TypeButtonMTI;
