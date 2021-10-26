import {Spinner} from "react-bootstrap";
import React from "react";
import './Loader.css';

export default function Loader(props) {
    return <div className="loader">
        <Spinner animation="grow" />
    </div>
}