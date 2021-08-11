import {Navbar} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import {
    currentProcedure,
    nextProcedure,
    selectCurrentProcedureStep, selectProcedureError,
    selectProcedureStatus
} from "../../../redux/reducers/procedureSlice";
import {unwrapResult} from "@reduxjs/toolkit";
import {useDispatch, useSelector} from "react-redux";
import {
    navigatorSlice,
    reconnectNavigator,
    selectNavigator,
    selectNavigatorError,
    selectNavigatorStatus,
    startNavigator
} from "../../../redux/reducers/navigatorSlice";
import {useEffect, useState} from "react";
import {CONDITION, QUESTIONNAIRE, TEXT} from "../stepTypes";
import {getNavigatorApi} from "../../../api/studyAlignApi";
import {participantSlice} from "../../../redux/reducers/participantSlice";
import {DONE} from "./navigatorStates";

export default function Navigator () {
    const dispatch = useDispatch()

    const [isDisabled, setIsDisabled] = useState(false);
    const [backendConnection, setBackendConnection] = useState("");

    const navigator = useSelector(selectNavigator)
    const navigatorStatus = useSelector(selectNavigatorStatus)
    const navigatorError = useSelector(selectNavigatorError)

    const currentProcedureStep = useSelector(selectCurrentProcedureStep)
    const procedureStatus = useSelector(selectProcedureStatus)
    const procedureError =  useSelector(selectProcedureError)

    const procedureStepType = currentProcedureStep && currentProcedureStep.procedure_step_type;

    let sse;

    useEffect(() => {
        console.log(procedureStepType)
        if (procedureStepType === CONDITION || procedureStepType === QUESTIONNAIRE) {
            setIsDisabled(true);
        } else {
            setIsDisabled(false);
        }
    }, [])

    useEffect(() => {
        if (procedureStepType === CONDITION || procedureStepType === QUESTIONNAIRE) {
            console.log("START NAVI!")
            setIsDisabled(true);
            navigatorStart();
        }
    }, [procedureStepType])

    useEffect(() => {
        if (navigatorStatus) {
            sse = getNavigatorApi();

            sse.addEventListener("participant_subscribed", (e) => {
                console.log("participant_subscribed")
                console.log(e.data);
            })

            sse.addEventListener("participant_unsubscribed", (e) => {
                console.log("participant_unsubscribed")
                console.log(e.data);
            })

            sse.addEventListener("state_change", (e) => {
                console.log("state_change")
                const message = JSON.parse(e.data);
                if (message.state === DONE) {
                    sse = null;
                    dispatch(navigatorSlice.actions.closeNavigator());
                    setIsDisabled(false);
                    dispatch(navigatorSlice.actions.setNavigatorStatus(false))
                }
            })
            sse.onopen = function() {
                console.log("ON OOOPEN")
                setBackendConnection("Connected to backend");
            };
            sse.onerror = function() {
                console.log("ON ERROR")
                navigatorReconnect()
                setBackendConnection("Trying to reconnect after error")
            };
        }
    }, [navigatorStatus])

    const navigatorStart = async () => {
        try {
            await dispatch(startNavigator())
            setBackendConnection("Connected")
        } catch (err) {
            console.log(err)
        }
    }

    const navigatorReconnect = async () => {
        try {
            await dispatch(reconnectNavigator())
        } catch (err) {
            console.log(err)
        }
    }

    const next = async () => {
        try {
            setIsDisabled(true);
            const procedureStep = await dispatch(nextProcedure());
            unwrapResult(procedureStep)
        } catch (err) {
            console.log(err)
        }
    }

    return <Navbar fixed="bottom" style={{borderTop: "1px solid #000"}}>
        {backendConnection}
        <Button variant="outline-success" disabled={isDisabled} onClick={() => next()}>Next </Button>
    </Navbar>
}