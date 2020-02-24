import React from 'react';
import "./style.css";



export class IndexPage extends React.Component {
    render() {
        return ( <div className = "StartPageContainer">


            <div className = "quote">
                <p2>"Programs must be written for people to read, and only incidentally for machines to execute."</p2>
                <p3>Harold Abelson </p3>
            </div>
            <button className = "btn1" > Min side </button>
                <button className = "btn2"> Rediger en oppgave </button>
                    <button className = "btn3"> Lag ny oppgave </button>




        </div>);

    };
    }