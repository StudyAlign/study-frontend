import {Navbar} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import {
    currentProcedure, endProcedure,
    nextProcedure, procedureSlice,
    selectCurrentProcedureStep, selectIsSecondLastStep, selectProcedure, selectProcedureError,
    selectProcedureStatus
} from "../../../redux/reducers/procedureSlice";
import {current, unwrapResult} from "@reduxjs/toolkit";
import {useDispatch, useSelector} from "react-redux";
import {
    navigatorSlice,
    reconnectNavigator,
    selectNavigator,
    selectNavigatorError,
    selectNavigatorStatus,
    startNavigator
} from "../../../redux/reducers/navigatorSlice";
import React, {useEffect, useState} from "react";
import {CONDITION, PAUSE, QUESTIONNAIRE, TEXT} from "../stepTypes";
import {getNavigatorApi} from "../../../api/studyAlignApi";
import {participantSlice, selectParticipant} from "../../../redux/reducers/participantSlice";
import {DONE, IN_PROGRESS} from "./navigatorStates";

import './Navigator.css';
import {Cloud, CloudCheck, CloudFill, CloudHail, CloudHaze} from "react-bootstrap-icons";


const CONN = "CONN"; // has SSE connection
const CONN_BACKEND = "CONN_BACKEND"; // SSE connection is open
const RECONN_AFTER_ERR = "RECONN_AFTER_ERR" // SEE connection failed, try reconnecting


export default function Navigator(props) {
    const dispatch = useDispatch()

    const [isDisabled, setIsDisabled] = useState(true);
    const [isVisible, setIsVisible] = useState(true);
    const [backendConnection, setBackendConnection] = useState("");

    const navigator = useSelector(selectNavigator)
    const navigatorStatus = useSelector(selectNavigatorStatus)
    const navigatorError = useSelector(selectNavigatorError)

    const visible = isVisible ? null : "hide-navigator";

    const participant = useSelector(selectParticipant)
    const procedure = useSelector(selectProcedure)
    const currentProcedureStep = useSelector(selectCurrentProcedureStep)
    const procedureStatus = useSelector(selectProcedureStatus)
    const procedureError =  useSelector(selectProcedureError)

    const procedureStepId = currentProcedureStep && currentProcedureStep.id;
    const procedureStepType = currentProcedureStep && currentProcedureStep.procedure_step_type;
    const isLastStep = currentProcedureStep && currentProcedureStep.is_last_step;
    const isSecondLastStep =  currentProcedureStep && currentProcedureStep.is_second_last_step;

    let sse;

    const config = currentProcedureStep && currentProcedureStep.config;
    const hideNavigator = config && config.hideNavigator;

    const proceedPause = () => {
        if (participant.current_procedure_step_config && participant.current_procedure_step_config.proceed) {
            setIsDisabled(false);
        } else {
            setIsDisabled(true);
            if (currentProcedureStep.config && currentProcedureStep.config.waiting_time) {
                setTimeout(() => {
                    setIsDisabled(false);
                }, currentProcedureStep.config.waiting_time * 1000)
            }
        }
    }

    const proceedCondition = () => {
        console.log("proceedCondition", currentProcedureStep.id)
        if (currentProcedureStep.config && currentProcedureStep.config.long_term) {
            console.log("cond is long_term")
            if (participant.current_procedure_step_config &&
                participant.current_procedure_step_config.proceed_condition &&
                participant.current_procedure_step_config.proceed_condition === currentProcedureStep.id
            ) {
                console.log("allow participant to proceed with cond")
                setIsVisible(true);
                setIsDisabled(false);
            } else {
                console.log("disallow participant to proceed with cond")
                setIsVisible(false);
            }
        } else {
            if (hideNavigator) {
                console.log("hide navigator")
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }
        }
    }

    useEffect(() => {
        if (procedureStepType === CONDITION) {
            setIsDisabled(true);
            proceedCondition();
        } else if (procedureStepType === QUESTIONNAIRE) {
            setIsDisabled(true);
        } else if (procedureStepType === TEXT) {
            setIsDisabled(false);
        } else if (procedureStepType === PAUSE) {
            proceedPause();
        }
    }, [])

    useEffect(() => {
        if (procedureStepType === CONDITION) {
            setIsDisabled(true);
            proceedCondition();
            //for long_term studies we do not rely on the navigator
            if(currentProcedureStep.config && !currentProcedureStep.config.long_term) {
                navigatorStart();
            }
        } else if (procedureStepType === QUESTIONNAIRE) {
            setIsDisabled(true);
            navigatorStart();
        } else if (procedureStepType === TEXT) {
            setIsDisabled(false);
        } else if (procedureStepType === PAUSE) {
            proceedPause();
        }
    }, [procedureStepId, procedureStepType])

    // Workaround: Call adjustheight from controller component to fit iframe to the full height
    useEffect(() => {
        props.adjustHeight();
    }, [visible]);

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
                const message = JSON.parse(e.data);
                if (message.state === DONE) {
                    //sse = null;
                    //dispatch(navigatorSlice.actions.closeNavigator());
                    setIsDisabled(false);
                    //dispatch(navigatorSlice.actions.setNavigatorStatus(false));
                    //setBackendConnection("");
                    if (hideNavigator) {
                        console.log("Show navigator")
                        setIsVisible(true);
                    }
                }

                if (message.state === IN_PROGRESS) {
                    setIsDisabled(true);
                }

            })

            sse.onopen = function() {
                setBackendConnection(CONN_BACKEND)
            };

            sse.onerror = function() {
                navigatorReconnect()
                setBackendConnection(RECONN_AFTER_ERR)
            };
        }
    }, [navigatorStatus])

    const navigatorStart = async () => {
        try {
            await dispatch(startNavigator())
            setBackendConnection(CONN)
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

            if (navigatorStatus) {
                sse = null;
                dispatch(navigatorSlice.actions.closeNavigator());
                dispatch(navigatorSlice.actions.setNavigatorStatus(false));
                setBackendConnection("");
            }

            const procedureStep = await dispatch(nextProcedure());
            unwrapResult(procedureStep)
        } catch (err) {
            console.log(err)
        }
    }

    let connectionIndicator = <Cloud size={24} className="connection-indicator"/>
    if (backendConnection === CONN || backendConnection === CONN_BACKEND) {
        connectionIndicator = <CloudCheck size={24} className="connection-indicator"/>
    } else if (backendConnection === RECONN_AFTER_ERR) {
        connectionIndicator = <CloudHaze size={24} className="connection-indicator"/>
    }

    let button = <button id="next" disabled={isDisabled} onClick={() => next()}>Next</button>;
    if (isSecondLastStep) {
        button = <button id="next" disabled={isDisabled} onClick={() => next()}>Finish</button>;
    } else if (isLastStep) {
        button = <div className="end-message">Please read the text above, before closing this window!</div>
    }

    return <Navbar id="navigator" fixed="bottom" className={visible}>
        {connectionIndicator}
        {button}
    </Navbar>
}