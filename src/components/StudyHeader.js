import {Badge, Col, Row} from "react-bootstrap";
import {getDate} from "../utils/date";
import React from "react";

import './StudyHeader.css';

export default function StudyHeader(props) {

    const studyName = props.studyName
    const startDate = props.startDate
    const endDate = props.endDate
    const studyActive = props.studyActive

    const runningBadge = studyActive ? <Badge pill className={"running-badge"}>Running</Badge> : null;

    return <Row className="study-details">
        <Col>
            <h2 className="study-title">{studyName}</h2>
            <Row>
                <Col sm={2}>{runningBadge}</Col>
                <Col sm={5}><b>Starts:</b> {getDate(startDate)} </Col>
                <Col sm={5}><b>Ends:</b> {getDate(endDate)}</Col>
            </Row>
        </Col>
    </Row>
}