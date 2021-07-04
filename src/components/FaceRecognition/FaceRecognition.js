import React from "react"
import "./FaceRecognition.css"

const FaceRecognition = ({ imageUrl, box }) => {
  return (
    <div className="center ma">
      <div className="absolute mt2">
        <img
          id="inputimage"
          alt=""
          src={imageUrl}
          height="auto"
          width="500px"
        />
        {/* styling the coordinates that detect the face with some css */}
        <div
          className="bounding-box"
          style={{
            top: box.topRow,
            right: box.rightCol,
            bottom: box.bottomRow,
            left: box.leftCol
          }}
        ></div>
      </div>
    </div>
  )
}

export default FaceRecognition
