import React from "react";
import { Link } from "react-router-dom";

class Home extends React.Component{
    
    //function


    //render html
    render(){
        return(
            <div>
                <div>This is Home!</div>
                <div>
                    <Link to="/" className="btn btn-secondary mr-2">
                        Home
                    </Link>
                    <Link to="/Page1" className="btn btn-secondary mr-2">
                        Page 1
                    </Link>
                    <Link to="/Page2" className="btn btn-secondary mr-2">
                        Page 2
                    </Link>
                </div>
            </div>
            
        );
    }
}

export default Home;