import React from 'react';
import Tilt from 'react-tilt';
import eye from './eye-open.png';
import './Logo.css';

const Logo = () => {
    return (
      <div className="ma4 mt0">
        <Tilt
          classNam="Tilt br2 shadow-2"
          options={{ max: 55 }}
          style={{ height: 150, width: 150 }}
        >
          <div className="Tilt-inner pa3">
            <img style={{ padding: "5px" }} alt="eye" src={eye} />
          </div>
        </Tilt>
      </div>
    );
}

export default Logo;