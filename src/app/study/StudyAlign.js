import {
    getParticipant, logProlificParams,
    me,
    participantSlice, participate, refreshToken, selectAvailableParticipant,
    selectParticipant,
    selectParticipantApi,
    selectParticipantTokens
} from "../../redux/reducers/participantSlice";
import {
    getStudy,
    selectStudy,
    selectStudyApi,
    selectStudyError,
    selectStudyStatus, studySlice
} from "../../redux/reducers/studySlice";
import {
    Redirect,
    useParams
} from "react-router-dom";
import {useDispatch, useSelector, useStore} from "react-redux";
import React, {useEffect, useState} from "react";
import styles from "../../features/counter/Counter.module.css";
import {unwrapResult} from "@reduxjs/toolkit";
import {IDLE, LOADING} from "../../redux/apiStates";
import {Col, Container, Row, Spinner, Form, Card, Navbar} from "react-bootstrap";
import {NOT_FOUND, UNPROCESSABLE_ENTITY} from "../../api/apiCodes";
import {useAuth} from "../../components/Auth";
import Button from "react-bootstrap/Button";
import {getDate, isStudyActive} from "../../utils/date";
import {HourglassBottom, HourglassTop} from "react-bootstrap-icons";
import Topbar from "../../components/Topbar";
import StudyHeader from "../../components/StudyHeader";
import ErrorMessage from "../../components/ErrorMessage";
import Loader from "../../components/Loader";
import {IN_PROGRESS} from "../../redux/participantStates";
import {useLocation} from "react-router-dom/cjs/react-router-dom";
import {getStudyApi} from "../../api/studyAlignApi";

export function useQuery() {
    const { search } = useLocation();
    return React.useMemo(() => new URLSearchParams(search), [search]);
}

export default function StudyAlign(props) {
    const [isInitialized, setInitialized] = useState(false)
    const [isConsentGiven, setIsConsentGiven] = useState(false)
    const auth = useAuth()

    let query = useQuery();
    const PROLIFICPID = query.get("PROLIFICPID")
    const SESSIONID = query.get("SESSIONID")
    const STUDYID = query.get("STUDYID")

    let { id, token } = useParams()

    const store = useStore()
    // Select values from store
    const tokens = useSelector(selectParticipantTokens)
    const participant = useSelector(selectParticipant)
    const availableParticipant = useSelector(selectAvailableParticipant)
    const participantStatus = useSelector(selectStudyStatus)
    const participantError =  useSelector(selectStudyError)
    const participantApi =  useSelector(selectParticipantApi)
    const study = useSelector(selectStudy)
    const studyStatus = useSelector(selectStudyStatus)
    const studyError =  useSelector(selectStudyError)
    const studyApi = useSelector(selectStudyApi)

    const dispatch = useDispatch()

    useEffect(( ) => {
        dispatch(studySlice.actions.initApi(id))
        dispatch(participantSlice.actions.readTokens())
        init()
    }, [])

    useEffect(() => {
        if (study && token) {
            checkParticipant(token);
        }
        setInitialized(true)
    }, [study])

    useEffect(() => {
        if (token && availableParticipant && availableParticipant.state === IN_PROGRESS) {
            console.log("JUMP IN!")
            startParticipating(token);
        }
    }, [availableParticipant])

    // api calls
    const init = async () => {
        await fetchStudy()
        await resumeParticipation()
    }

    const fetchStudy = () => {
        if (id && !study) {
            try {
                return dispatch(getStudy())
            } catch (err) {
                console.log(err)
            }
        }
    }

    const resumeParticipation = async () => {
        console.log("resume participation")
        try {
            if (isStudyActive(selectStudy(store.getState())) && selectParticipantTokens(store.getState())) {
                const participantResponse = await dispatch(me())
                unwrapResult(participantResponse) // needed to throw exception on error
            }
        } catch (err) {
            console.log("resume refresh")
            try {
                //TODO: SET ACCESS TOKEN AFTER REFRESHING
                const refreshTokenResponse = await dispatch(refreshToken())
                unwrapResult(refreshTokenResponse) // needed to throw exception on error
                const participantResponse = await dispatch(me())
                unwrapResult(participantResponse) // needed to throw exception on error
            } catch (err) {
                console.log(err)
                dispatch(dispatch(participantSlice.actions.deleteTokens()))
            }
        }
        // if closed study (invite) and UUID token in get param
            //resumeparticipationUUIDBased (issue tokens if still participating)
            //me
        //catch
            // display error
    }

    const checkParticipant = (token) => {
        try {
            return dispatch(getParticipant(token));
        } catch (err) {
            console.log(err)
        }
    }

    const startParticipating = async (token) => {
        try {
            let prolific = {}
            if (PROLIFICPID) {
                prolific.PROLIFICPID = PROLIFICPID
            }
            if (SESSIONID) {
                prolific.SESSIONID = SESSIONID
            }
            if (STUDYID) {
                prolific.STUDYID = STUDYID
            }

            await dispatch(participate(token));
            await dispatch(me());

            if (Object.keys(prolific).length > 0) {
                await dispatch(logProlificParams(prolific))
            }

            const url = new URL(window.location.href);
            const prolific_id = url.searchParams.get("PROLIFIC_PID");
            const prolific_study_id = url.searchParams.get("STUDY_ID");
            const prolific_session = url.searchParams.get("SESSION_ID");
        } catch (err) {
            console.log(err)
        }
    }

    // display loader or redirect
    if (!isInitialized) {
        return <Loader />
    } else {
        if (auth.participant) {
            let redirectTo;
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
            if (auth.participant.current_procedure_step) {
                redirectTo = "/" + id + "/run" + queryString
            } else {
                redirectTo = "/" + id + "/start" + queryString
            }
            console.log("REDIRECTTO", redirectTo)
            return <Redirect to={redirectTo}/>
        }


    }

    console.log("RENDER UI")

    // define view
    let studyHeader;
    let studyDetails;
    let consentCheckbox;
    let participantDetails;
    let participateButton;
    let studyIsOver;
    let studyIsInviteOnly;

    if (study && isStudyActive(study)) {
        studyHeader = <StudyHeader studyName={study.name} startDate={study.startDate} endDate={study.endDate} studyActive />
        studyDetails = <Row className="study-description">
            <Col>
                <Card className="study-description">
                    <Card.Body>
                        <div dangerouslySetInnerHTML={{ __html: study.description }} />
                    </Card.Body>
                </Card>
                <Card className="study-consent-privacy">
                    <Card.Body>
                        <div dangerouslySetInnerHTML={{ __html: study.consent }} />
                    </Card.Body>
                </Card>
            </Col>
        </Row>

        if (participantApi === LOADING) {
            participateButton = <Spinner animation="grow" />
        }

        if (!tokens) {
            participateButton = <Button className="participate-button" variant="primary" size="lg" disabled={!isConsentGiven} onClick={() => startParticipating(token)}>
                Participate
            </Button>
        }

        consentCheckbox = <Row className="consent-check">
            <Col md={4}>
                Please give your consent:
            </Col>
            <Col md={8}>
                <Form.Check type="checkbox" id="consent-checkbox" label="I agree to the data policy"
                            onClick={() => {
                                setIsConsentGiven(!isConsentGiven);
                            }}/>
            </Col>
        </Row>

        if (participant) {
            participateButton = null
            participantDetails = <div>
                {participant.id}
                {participant.state}
                {participant.procedure_id}
                {participant.current_procedure_step}
            </div>
        }
    }

    if (study && !isStudyActive(study)) {
        studyIsOver =  <Row>
            <Col>
                <Card className="study-description">
                    <Card.Body>
                        <p><strong>The Study has already ended.</strong></p>
                        <p>Thank you for your interest in participating.</p>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    }

    if (study && study.invite_only && !availableParticipant) {
        studyIsInviteOnly =  <Row>
            <Col>
                <Card className="study-description">
                    <Card.Body>
                        <p><strong>The Study is only for invited participants.</strong></p>
                        <p>Thank you for your interest in participating. Reach out to the experimenter to get a valid participant token.</p>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    }

    const studyErrorMessage = <ErrorMessage studyId={id} studyStatus={studyStatus} studyError={studyError}/>

    // build view
    let view;
    if (studyApi === LOADING) {
        view = <Spinner animation="grow" />
    } else {
        if (studyDetails) {

            let participationInfo = studyIsInviteOnly;
            if (!studyIsInviteOnly) {
                participationInfo = <>
                    {consentCheckbox}
                    {participantDetails}
                    {participateButton && <div className="button-bar">{participateButton}</div>}
                </>
            }

            view = <Container>
                <Row>
                    <Col lg={{ span: 8, offset: 2 }} md={{ span: 10, offset: 1 }} xs={12}>
                        {studyHeader}
                        {studyDetails}
                        {participationInfo}
                    </Col>
                </Row>
            </Container>
        }
        if (studyIsOver) {
            view = <Container>
                <Row>
                    <Col lg={{ span: 8, offset: 2 }} md={{ span: 10, offset: 1 }} xs={12}>
                        {studyHeader}
                        {studyIsOver}
                    </Col>
                </Row>
            </Container>
        }
        // if (!studyIsOver && studyIsInviteOnly) {
        //     view = <Container>
        //         <Row>
        //             <Col lg={{ span: 8, offset: 2 }} md={{ span: 10, offset: 1 }} xs={12}>
        //                 {studyHeader}
        //                 {studyIsInviteOnly}
        //             </Col>
        //         </Row>
        //     </Container>
        // }
        if (studyError) {
            view = studyErrorMessage
        }
    }

    return <div id="wrapper">
        <Topbar />
        {view}
    </div>
}