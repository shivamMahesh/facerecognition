import React, { Component } from 'react';
import './App.css';
import Navigation from './Components/Navigation/Navigation';
import Logo from './Components/Logo/Logo';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm';
import Rank from './Components/Rank/Rank';
import Particles from 'react-particles-js';
import FaceRecognition from './Components/FaceRecognition/FaceRecognition';
import Signin from './Components/Signin/Signin';
import Register from './Components/Register/Register';
const particles={
                  number:{
                    value:100,
                    density:{
                      enable: true,
                      value_area:800
                    }
                  }
                }



const initialstate={
   input:'',
      imageUrl:'',
      box:{},
      route:'signin',
      isSignedIn:false,
      user:
      {
        id:'',
        name:'',
        password:'',
        email:'',
        enteries:'',
        joined:''
      }
    }
class App extends Component {
  constructor()
  {
    super();
    this.state=initialstate
}



  loadUser=(data)=>
  {
    this.setState(
     { user:
      {
        id:data.id,
        name:data.name,
        password:data.password,
        email:data.email,
        enteries:data.enteries,
        joined:data.joined
      }})
  }
  calculateFaceLocation=(data)=>
  {
    const face=data.outputs[0].data.regions[0].region_info.bounding_box;
    const image=document.getElementById('inputimage');
    const width=Number(image.width);
    const height=Number(image.height);
    return{
      leftcol : face.left_col*width ,
      toprow : face.top_row*height ,
      rightcol : width - face.right_col*width ,
      bottomrow :  height-face.bottom_row*height
    }
  }
  onRouteChange=(route)=>
  {
    if(route==='home'){
      this.setState({isSignedIn:true})
    }
    else if(route==='signout'){
      this.setState(initialstate)
    }
    this.setState({route: route})
  }
  displayFaceBox=(box)=>
  {
    this.setState({box: box});
  }
  onInputChange=(event)=>
  {
    this.setState({input:event.target.value});
  }
  onButtonSubmit = ()=>
  {
    this.setState({imageUrl:this.state.input});
   fetch('https://fathomless-basin-41692.herokuapp.com/imageurl',
        {
          method:'post',
           headers:{'Content-Type':'application/json'},
  body:JSON.stringify({
    input:this.state.input
  })}).then(response=>response.json())
    .then(response=>{
      if(response)
      {
        fetch('https://fathomless-basin-41692.herokuapp.com/image',
        {
          method:'put',
           headers:{'Content-Type':'application/json'},
  body:JSON.stringify({
    id:this.state.user.id
  })}).then(response=>response.json())
    .then(count=>{this.setState(Object.assign(this.state.user,{enteries:count}))
      })
      }
      this.displayFaceBox(this.calculateFaceLocation(response))
    })
    .catch(err=>console.log(err))
  }
  render() {
    const {isSignedIn,imageUrl,route,box}=this.state;
    return (
      <div className="App">
            <Particles className='particles'
              params={{particles} }/>
      <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
      {
      (route==='home')?
      <div>
      <Logo />
      <Rank name={this.state.user.name}  enteries={this.state.user.enteries}/>
      <ImageLinkForm 
      onInputChange={this.onInputChange} 
      onButtonSubmit={this.onButtonSubmit}/>
      <FaceRecognition box={box} imageUrl={imageUrl}/>
      </div>
      :(route==='signin'?
            <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
            :
                <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
        ) }
      </div>
    );
  }
}

export default App;
