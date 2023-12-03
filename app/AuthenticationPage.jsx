import React from 'react';
import {SignIn} from './components/Authentication/SignIn';
import {SignUp} from './components/Authentication/SignUp';


const AuthenticationPage = () => {
  return (
    <div className="authentication-page">
    <SignIn />
    <SignUp />
    </div>
  );
};

export default AuthenticationPage;
