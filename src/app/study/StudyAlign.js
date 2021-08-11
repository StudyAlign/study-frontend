import {
    me,
    participantSlice, participate, refreshToken,
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
import {Spinner} from "react-bootstrap";
import {NOT_FOUND, UNPROCESSABLE_ENTITY} from "../../api/apiCodes";
import {useAuth} from "../../components/Auth";

export default function StudyAlign(props) {
    const [isInitialized, setInitialized] = useState(false);
    const auth = useAuth()

    let { id } = useParams();

    const store = useStore()
    // Select values from store
    const tokens = useSelector(selectParticipantTokens)
    const participant = useSelector(selectParticipant)
    const participantStatus = useSelector(selectStudyStatus)
    const participantError =  useSelector(selectStudyError)
    const participantApi =  useSelector(selectParticipantApi)
    const study = useSelector(selectStudy)
    const studyStatus = useSelector(selectStudyStatus)
    const studyError =  useSelector(selectStudyError)
    const studyApi = useSelector(selectStudyApi)

    const dispatch = useDispatch()

    useEffect(() => {
        console.log("Init StudyAlign, intialized: " + isInitialized)
        dispatch(studySlice.actions.initApi(id))
        dispatch(participantSlice.actions.readTokens())
        init()
    }, [])

    // api calls
    const init = async () => {
        await fetchStudy()
        await resumeParticipation()
        setInitialized(true)
        console.log("FINISHED INIT")
    }

    const fetchStudy = async () => {
        if (id && !study) {
            try {
                await dispatch(getStudy())
            } catch (err) {
                console.log(err)
            }
        }
    }

    const resumeParticipation = async () => {
        console.log("RESUMERY")
        try {
            if (isStudyActive(selectStudy(store.getState())) && selectParticipantTokens(store.getState())) {
                const participantResponse = await dispatch(me())
                unwrapResult(participantResponse) // needed to throw exception on error
            }
        } catch (err) {
            console.log("resume refresh")
            try {
                const refreshTokenResponse = await dispatch(refreshToken())
                unwrapResult(refreshTokenResponse) // needed to throw exception on error
                const participantResponse = await dispatch(me())
                unwrapResult(participantResponse) // needed to throw exception on error
            } catch (err) {
                console.log(err)
                dispatch(dispatch(participantSlice.actions.deleteTokens()))
            }
        }
    }


    const startParticipating = async () => {
        try {
            await dispatch(participate());
            await dispatch(me());
        } catch (err) {
            console.log(err)
        }
    }

    // display loader or redirect
    if (!isInitialized) {
        return <Spinner animation="grow" />
    } else {
        if (auth.participant) {
            let redirectTo;
            if (auth.participant.current_procedure_step) {
                redirectTo = "/" + id + "/run"
            } else {
                redirectTo = "/" + id + "/start"
            }
            return <Redirect to={redirectTo} />
        }
    }

    // define view
    let studyHeader;
    let studyDetails;
    let participantDetails;
    let participateButton;
    let studyIsOver;

    if (study && isStudyActive(study)) {
        studyHeader = <div>
            <h2>Study: {study.name}</h2>
        </div>
        studyDetails = <div>
            <p>TODO: Study description needed!</p>
            {study.id}
            {study.startDate}
            {study.endDate}
        </div>

        if (participantApi === LOADING) {
            participateButton = <Spinner animation="grow" />
        }
        if (!tokens) {
            participateButton = <button
                className={styles.asyncButton}
                onClick={() => startParticipating()}
            > Participate
            </button>
        }
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
        studyIsOver = <div>
            <strong>The Study has already ended.</strong>
            Thank you for your interest in participating.
        </div>
    }

    let studyErrorMessage;
    if (studyError) {
        switch(studyStatus) {
            case NOT_FOUND:
                studyErrorMessage = <div>
                    <h2>404 - Study not found</h2>
                    <p>A study with id: '{id}' could not be found.</p>
                </div>
                break;
            case UNPROCESSABLE_ENTITY:
                studyErrorMessage = <div>
                    <h2>422 - Invalid study id</h2>
                    <p>A study with id: '{id}' could not be processed.</p>
                </div>
                break;
            default:
                studyErrorMessage = <div>
                    There was an error getting the study:
                    <p>{studyError.statusText}</p>
                </div>
        }
    }

    let view;
    if (studyApi === LOADING) {
        view = <Spinner animation="grow" />
    } else {
        if (studyDetails) {
            view = <div>
                {studyHeader}
                {studyDetails}
                {participantDetails}
                {participateButton && <div>{participateButton}</div>}
            </div>
        }
        if (studyIsOver) {
            view = <div>
                {studyHeader}
                {studyIsOver}
            </div>
        }
        if (studyError) {
            view = <div>{studyErrorMessage}</div>
        }
    }

    return <div>
        {view}
    </div>
}

export function isStudyActive(study) {
    if (study && study.startDate && study.endDate && study.isActive) {
        const currentDate = new Date().getTime();
        const studyStartDate = new Date(study.startDate).getTime();
        const studyEndDate = new Date(study.endDate).getTime();
        return currentDate >= studyStartDate && currentDate <= studyEndDate;
    }
    return false;
}
