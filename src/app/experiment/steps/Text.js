import {useDispatch, useSelector} from "react-redux";
import {
    procedureSlice,
    selectCurrentProcedureStep, selectIsNextActive,
    selectProcedureError,
    selectProcedureStatus
} from "../../../redux/reducers/procedureSlice";
import {Card, Col, Container, Ratio, Row} from "react-bootstrap";
import React from "react";

import './Text.css';
import YouTube from "react-youtube";
import {participantSlice} from "../../../redux/reducers/participantSlice";
import Button from "react-bootstrap/Button";

export default function Text() {

    const currentProcedureStep = useSelector(selectCurrentProcedureStep)

    const dispatch = useDispatch()

    const onVideoReady = event => {
        console.log(event)
    }
    // watching the video is mandatory so we need to active "Next" button after video has ended.
    const onVideoEnd = event => {
        dispatch(procedureSlice.actions.enableNext())
    }
    const youtubeVideo = currentProcedureStep.video
    const opts = {
        playerVars: {
            // https://developers.google.com/youtube/player_parameters
            autoplay: 0,
        },
    };
    const video = <div className="embed-responsive embed-responsive-16by9"><YouTube videoId={youtubeVideo} opts={opts} onReady={onVideoReady}  onEnd={onVideoEnd}/></div>
    const videoControls = <Row>
        <Col>
            <Button variant="outline-primary">Fullscreen</Button>
        </Col>
    </Row>

    const title = currentProcedureStep.title
    const body = <Row>
        <Col>
            <Card className="step-description">
                <Card.Body>
                    <div dangerouslySetInnerHTML={{ __html: currentProcedureStep.body }} />
                    {youtubeVideo && video}
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