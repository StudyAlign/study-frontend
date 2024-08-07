import {Col, Container, Row} from "react-bootstrap";
import React, {useEffect} from "react";
import {useDispatch} from "react-redux";
import {updateNavigator} from "../../redux/reducers/navigatorSlice";
import {useParams} from "react-router-dom";
import {studySlice} from "../../redux/reducers/studySlice";

export default function Updater() {
    const dispatch = useDispatch()
    let { id, token } = useParams()

    useEffect(async () => {
        dispatch(studySlice.actions.initApi(id))
        const response = await dispatch(updateNavigator({
            "participantToken": token,
            "source": "questionnaire",
            "state": "done",
            "extId": null
        }))
        console.log("UPDATE NAVIGATOR FROM OUTSIDE", response)
    }, [])

    return (
        <Container>
            <Row>
                <Col lg={{ span: 8, offset: 2 }} md={{ span: 10, offset: 1 }} xs={12}>
                    <h2>The button in the bottom bar on the right will update in a few Seconds.</h2>
                    <p>Click on the "Next" button as soon as it turns green to proceed.</p>
                </Col>
            </Row>
        </Container>
    );
}