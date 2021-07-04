import React, { Component } from "react"
import Navigation from "./components/Navigation/Navigation"
import FaceRecognition from "./components/FaceRecognition/FaceRecognition"
import Logo from "./components/Logo/Logo"
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm"
import Rank from "./components/Rank/Rank"
import SignIn from "./components/SignIn/SignIn"
import Register from "./components/Register/Register"
import Particles from "react-particles-js"
import "./App.css"

//  particles js animation setup
//  for details about how to config it
//  visit particles js github repo!
//  git@github.com:migben/face-recognition-app.git


const particlesOptions = {
  particles: {
    number: {
      value: 220,
      density: {
        enable: false
      }
    },
    size: {
      value: 10,
      random: true
    },
    move: {
      direction: "bottom",
      out_mode: "out"
    },
    line_linked: {
      enable: false
    }
  },
  interactivity: {
    events: {
      onclick: {
        enable: true,
        mode: "remove"
      }
    },
    modes: {
      remove: {
        particles_nb: 10
      }
    }
  }
};

// initial state of the user before signin at our app
const initialState = {
  input: "",
  imageUrl: "",
  box: {},
  route: "signin", // signin state
  isSignedIn: false,
  user: {
    id: "",
    name: "",
    email: "",
    entries: 0,
    joined: ""
  }
}

class App extends Component {
  constructor() {
    super()
    this.state = initialState
  }

  loadUser = data => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
      }
    })
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box
    const image = document.getElementById('inputimage')
    const width = Number(image.width)
    const height = Number(image.height)
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = box => {
    this.setState({ box: box })
  }

  onInputChange = event => {
    // displaying our input img
    this.setState({
      input: event.target.value
    })
  }

  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input })

    fetch("https://serene-eyrie-34226.herokuapp.com/imageurl", {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        input: this.state.input
      })
    })
    .then(response => response.json())
    .then(response => {
      if (response) {
        fetch('https://serene-eyrie-34226.herokuapp.com/image', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            id: this.state.user.id
          })
        })
        .then(response => response.json())
        .then(count => {
          this.setState(Object.assign(this.state.user, { entries: count}))
        })
        .catch(console.log)
      }
      this.displayFaceBox(this.calculateFaceLocation(response))
    })
    .catch(err => console.log(err));
  }

  onRouteChange = route => {
    if (route === "signout") {
      this.setState( initialState)
    } else if (route === "home") {
      this.setState({ isSignedIn: true })
    }
    this.setState({ route: route })
  }

  render() {
    // de-structuring our states
    const { isSignedIn, imageUrl, route, box } = this.state

    return (
      <div className="App">
        <Particles className="particles" params={particlesOptions} />
        <Navigation
          isSignedIn={isSignedIn}
          onRouteChange={this.onRouteChange}
        />
        {/* if user sign in lets direct them to the home page */}
        {route === "home" ? 
          <div>
            <Logo />
            <Rank
              name={this.state.user.name}
              entries={this.state.user.entries}
            />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit}
            />
            <FaceRecognition box={box} imageUrl={imageUrl} />
          </div>
        : route === 'signin' ? (
          <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
        ) : (
          <Register
            loadUser={this.loadUser}
            onRouteChange={this.onRouteChange}
          />
        )}
      </div>
    )
  }
}

export default App
