import {useDispatch, useSelector} from "react-redux";
import {me, participate, selectParticipant} from "../../redux/reducers/participantSlice";
import {selectStudy, selectStudyError, selectStudyStatus} from "../../redux/reducers/studySlice";
import {Redirect, useParams} from "react-router-dom";
import React from "react";
import styles from "../../features/counter/Counter.module.css";
import {useAuth} from "../../components/Auth";
import {
    getProcedure,
    selectCurrentProcedureStep, selectProcedureApi,
    selectProcedureError,
    selectProcedureStatus,
    startProcedure
} from "../../redux/reducers/procedureSlice";
import {unwrapResult} from "@reduxjs/toolkit";
import {Card, Col, Container, Row, Spinner} from "react-bootstrap";
import StudyHeader from "../../components/StudyHeader";
import Topbar from "../../components/Topbar";
import Button from "react-bootstrap/Button";
import {LOADING} from "../../redux/apiStates";
import {isStudyActive} from "../../utils/date";
import {useQuery} from "../study/StudyAlign";


export default function Participation(props) {
    const dispatch = useDispatch()
    const auth = useAuth()

    let { id } = useParams();

    const study = useSelector(selectStudy)
    const studyStatus = useSelector(selectStudyStatus)
    const studyError = useSelector(selectStudyError)
    const participant = useSelector(selectParticipant)
    const participantStatus = useSelector(selectStudyStatus)
    const participantError =  useSelector(selectStudyError)
    const currentProcedureStep = useSelector(selectCurrentProcedureStep)
    const procedureApi = useSelector(selectProcedureApi)
    const procedureStatus = useSelector(selectProcedureStatus)
    const procedureError = useSelector(selectProcedureError)

    let query = useQuery();
    const PROLIFICPID = query.get("PROLIFICPID")
    const SESSIONID = query.get("SESSIONID")
    const STUDYID = query.get("STUDYID")

    // api calls
    const startStudy = async () => {
        try {
            const procedureStep = await dispatch(startProcedure());
            unwrapResult(procedureStep)
        } catch (err) {
            console.log(err)
        }
    }

    let queryString = ""
    if (PROLIFICPID) {
        queryString = "?PROLIFICPID=" + PROLIFICPID
    }
    if (STUDYID) {
        queryString = queryString + "&STUDYID=" + STUDYID
    }
    if (SESSIONID) {
        queryString = queryString + "&SESSIONID=" + SESSIONID
    }
    // redirect if already participating
    if (auth.participant) {
        let redirectTo;
        if (auth.participant.current_procedure_step) {
            redirectTo = "/" + id + "/run" + queryString
            return <Redirect to={redirectTo} />
        }
    }
    if (currentProcedureStep) {
        const redirectTo = "/" + id + "/run" + queryString
        return <Redirect to={redirectTo} />
    }

    // define view
    const studyHeader = <StudyHeader studyName={study.name} startDate={study.startDate} endDate={study.endDate} studyActive={isStudyActive(study)} />

    const participantDetails = <p>
        Your token: "{participant.token}"
    </p>

    const participationInfo = <>
        <p>Press the button below to start the study.</p>
        <p><b>Please, be sure to have enough time to finish the study.</b></p>
        <p><b>An active study cannot be paused!</b></p>
    </>

    let startButton =  <Button className="start-button" variant="primary" size="lg" onClick={() => startStudy()}>Start Study</Button>
    if (procedureApi === LOADING) {
        startButton = <Spinner animation="grow" />
    }

    const view = <Container>
        <Row>
            <Col lg={{ span: 8, offset: 2 }} md={{ span: 10, offset: 1 }} xs={12}>
                {studyHeader}
                <Row>
                    <Col>
                        <Card className="study-description">
                            <Card.Body>
                                {/*{participantDetails}*/}
                                {participationInfo}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                {startButton}
            </Col>
        </Row>
    </Container>

    return <div id="wrapper">
        <Topbar />
        {view}
    </div>

}