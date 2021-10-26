import {useSelector} from "react-redux";
import {
    selectCurrentProcedureStep,
    selectProcedureError,
    selectProcedureStatus
} from "../../../redux/reducers/procedureSlice";
import {Card, Col, Container, Row} from "react-bootstrap";
import React from "react";

import './Text.css';

export default function Text() {

    const currentProcedureStep = useSelector(selectCurrentProcedureStep)

    const title = currentProcedureStep.title
    const body = <Row>
        <Col>
            <Card className="step-description">
                <Card.Body>
                    <div dangerouslySetInnerHTML={{ __html: currentProcedureStep.body }} />
                </Card.Body>
            </Card>
        </Col>
    </Row>

    return <Container className="step-container">
            <Row>
                <Col lg={{ span: 8, offset: 2 }} md={{ span: 10, offset: 1 }} xs={12}>
                    <h2>{title}</h2>
                    {body}
                </Col>
            </Row>
        </Container>
}