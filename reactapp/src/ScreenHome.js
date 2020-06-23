import React, {useState} from 'react';
import './App.css';
import {Input,Button} from 'antd';
import {Redirect} from 'react-router-dom';
import {connect} from 'react-redux';

function ScreenHome(props) {

  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [userExists, setUserExists] = useState(false);

  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  const [listErrorsSignUp, setErrorsSignUp] = useState([]);
  const [listErrorsSignIn, setErrorsSignIn] = useState([]);

  var handleSubmitSignUp = async () => {
    const userData = await fetch('/sign-up', {
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body: `nameFromFront=${signUpName}&emailFromFront=${signUpEmail}&passwordFromFront=${signUpPassword}`
    });

    const body = await userData.json();

    if(body.result === true) {
      setUserExists(true)
      props.addToken(body.token)
    } else {
      setErrorsSignUp(body.error)
    }
  }

  var handleSubmitSignIn = async () => {
    const user = await fetch('/sign-in', {
      method:"POST",
      headers : {'Content-Type': 'application/x-www-form-urlencoded'},
      body: `emailFromFront=${signInEmail}&passwordFromFront=${signInPassword}`
    });

    const body = await user.json();

    if(body.result === true){
      setUserExists(true);
      props.addToken(body.token)
    } else {
      setErrorsSignIn(body.error)
    }
  }

  if(userExists){
    return <Redirect to="/screensource"/>
  }

  return (
    <div className="Login-page" >

          {/* SIGN-IN */}

          <div className="Sign">
                  
                  <Input onChange={(e) => setSignInEmail(e.target.value)} value={signInEmail} className="Login-input" placeholder="arthur@lacapsule.com" />

                  <Input.Password onChange={(e) => setSignInPassword(e.target.value)} value={signInPassword} className="Login-input" placeholder="password" />

                   {listErrorsSignIn}
            

            <Button onClick={() => handleSubmitSignIn()} style={{width:'80px'}} type="primary">Sign-in</Button>

          </div>

          {/* SIGN-UP */}

          <div className="Sign">
                  
                  <Input onChange={(e) => setSignUpName(e.target.value)} value={signUpName} className="Login-input" placeholder="Arthur G" />

                  <Input onChange={(e) => setSignUpEmail(e.target.value)} value={signUpEmail} className="Login-input" placeholder="arthur@gmail.com" />

                  <Input.Password onChange={(e) => setSignUpPassword(e.target.value)} value={signUpPassword} className="Login-input" placeholder="password" />

                  {listErrorsSignUp}
            

            <Button onClick={() => handleSubmitSignUp()} style={{width:'80px'}} type="primary">Sign-up</Button>

          </div>

      </div>
  );
}

function mapDispatchToProps(dispatch){
  return{
    addToken: function(token) {
      dispatch({type: 'addToken', token:token})
    }
  }
}


export default connect(null, mapDispatchToProps) (ScreenHome);
