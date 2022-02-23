import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";

class Page2 extends React.Component{
    
    //function

    //render heml
    render(){
        return(
            <div>
                <div>This is Page2!</div>
                <div>
                    <Link to="/" className="btn btn-secondary mr-2">
                        Home
                    </Link>
                    <Link to="/ScoreLibrary" className="btn btn-secondary mr-2">
                        Score Library
                    </Link>
                    <Link to="/Page2" className="btn btn-secondary mr-2">
                        Page 2
                    </Link>
                </div>
            </div>
        );
    }
}

export default Page2;