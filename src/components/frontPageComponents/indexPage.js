import React from 'react';
import "./style.css";
import{Link} from "react-router-dom";


export class IndexPage extends React.Component {
    render() {
        return ( 
        <div className = "StartPageContainer">


            <div className = "quote">
                <p2>"Programs must be written for people to read, and only incidentally for machines to execute."</p2>
                <p3>Harold Abelson </p3>
            </div>
            <button className = "btn1" > <Link to="">Min side</Link> </button>
                <button className = "btn2"><Link to="">Rediger en oppgave</Link>  </button>
                    <button className = "btn3"><Link to="/createNewLesson">Lag ny oppgave </Link> </button>
          
       </div>
        
        );

    };
    }