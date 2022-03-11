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
                    <Link to="/ScoreLibrary" className="btn btn-secondary mr-2">
                        Score Library
                    </Link>
                    <Link to="/VariableLibrary" className="btn btn-secondary mr-2">
                        Variable Library
                    </Link>
                    <Link to="/RuleSetLibrary" className="btn btn-secondary mr-2">
                        Rule Set Library
                    </Link>
                    <Link to="/DecisionTreeLibrary" className="btn btn-secondary mr-2">
                        Decision Tree Library
                    </Link>
                </div>
            </div>
            
        );
    }
}

export default Home;