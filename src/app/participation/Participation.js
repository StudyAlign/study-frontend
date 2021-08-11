import {useDispatch, useSelector} from "react-redux";
import {me, participate, selectParticipant} from "../../redux/reducers/participantSlice";
import {selectStudy, selectStudyError, selectStudyStatus} from "../../redux/reducers/studySlice";
import {Redirect, useParams} from "react-router-dom";
import {isStudyActive} from "../study/StudyAlign";
import React from "react";
import styles from "../../features/counter/Counter.module.css";
import {useAuth} from "../../components/Auth";
import {
    selectCurrentProcedureStep,
    selectProcedureError,
    selectProcedureStatus,
    startProcedure
} from "../../redux/reducers/procedureSlice";
import {unwrapResult} from "@reduxjs/toolkit";

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
    const procedureStatus = useSelector(selectProcedureStatus)
    const procedureError = useSelector(selectProcedureError)

    // api calls
    const startStudy = async () => {
        try {
            const procedureStep = await dispatch(startProcedure());
            unwrapResult(procedureStep)
        } catch (err) {
            console.log(err)
        }
    }

    // redirect if already participating
    console.log(auth.participant)
    if (auth.participant) {
        let redirectTo;
        if (auth.participant.current_procedure_step) {
            redirectTo = "/" + id + "/run"
            return <Redirect to={redirectTo} />
        }
    }
    if (currentProcedureStep) {
        const redirectTo = "/" + id + "/run"
        return <Redirect to={redirectTo} />
    }

    // define view
    let studyHeader = <div>
        <h2>Study: {study.name}</h2>
    </div>
    let studyDetails = <div>
        <p>TODO: Study description needed!</p>
        {study.id}
        {study.startDate}
        {study.endDate}
    </div>

    let participantDetails = <div>
        Your token: "{participant.token}"
    </div>

    let participationInfo = <div>
        <p>Press the button below to start the study.</p>
        <p>Be sure to have enough time to finish the study. An active study cannot be paused!</p>
    </div>

    let startButton =  <button
        className={styles.asyncButton}
        onClick={() => startStudy()}
    > Start Study
    </button>
    return <div>
        {studyHeader}
        {studyDetails}
        <hr />
        {participantDetails}
        {participationInfo}
        {startButton}
    </div>

}