import {useSelector} from "react-redux";
import {
    selectCurrentProcedureStep,
    selectProcedureError,
    selectProcedureStatus
} from "../../../redux/reducers/procedureSlice";
import {Card, Col, Container, Row} from "react-bootstrap";
import React from "react";

import './Text.css';
import {selectParticipant} from "../../../redux/reducers/participantSlice";

export default function Pause() {

    const participant = useSelector(selectParticipant)
    const currentProcedureStep = useSelector(selectCurrentProcedureStep)

    const title = currentProcedureStep.title

    let bodyText = <div dangerouslySetInnerHTML={{ __html: currentProcedureStep.body }} />
    if (participant && participant.current_procedure_step_config && participant.current_procedure_step_config.proceed) {
        bodyText = <div dangerouslySetInnerHTML={{ __html: currentProcedureStep.proceed_body }} />
    }

    const body = <Row>
        <Col>
            <Card className="step-description">
                <Card.Body>
                    {bodyText}
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