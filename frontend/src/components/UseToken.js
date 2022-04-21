import { useState } from 'react';
import axios from "axios";
import Cookies from 'universal-cookie'

export default function useToken() {
  const cookies = new Cookies();
  const retreiveToken = () => {
    const tokenString = cookies.get('token');
    return tokenString
    //const tokenString = sessionStorage.getItem('token');
    //const userToken = JSON.parse(tokenString);
    //return userToken?.token
  };

  const [token, setToken] = useState(retreiveToken());

  const saveToken = userToken => {
    cookies.set('token', userToken, {path:'/'});
    //sessionStorage.setItem('token', JSON.stringify(userToken));
    setToken(userToken);
  };

  const resetToken = (userToken,id,pw) => {
    cookies.remove('token',{path:'/'});
    //setToken(retreiveToken());
    window.location.reload();
    
    /*
    axios
      .post(`/api/Logout/`,
      {
          //here is body(data)
          'username': `${id}`,
          'password': `${pw}`,
          'token': `${retreiveToken()}`
      },
      {
        headers:{
            //here is headers for token and cookies
            'token': `${retreiveToken()}`
        }
      })
      .then((res) => {
          if(res.data)
          {
              if(res.data["logout"]==="success")
              {
                  cookies.remove('token',{path:'/'});
                  window.location.reload();
              }
              if(res.data["error"])
              {
                  alert(res.data["error"])
              }
          }
      })
      .catch((err) => console.log(err));
      */
  }

  return {
    getToken: retreiveToken,
    setToken: saveToken,
    removeToken: resetToken,
    token
  }
}