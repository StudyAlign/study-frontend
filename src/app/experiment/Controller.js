import {useAuth} from "../../components/Auth";
import {useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {
    participantSlice,
    selectParticipant,
    selectParticipantApi,
} from "../../redux/reducers/participantSlice";
import {
    getStudy,
    selectStudy,
    selectStudyApi,
    selectStudyError,
    selectStudyStatus,
} from "../../redux/reducers/studySlice";
import {
    currentProcedure, endProcedure, getProcedure, procedureSlice,
    selectCurrentProcedureStep, selectProcedure,
    selectProcedureError,
    selectProcedureStatus
} from "../../redux/reducers/procedureSlice";
import {useEffect, useLayoutEffect, useRef, useState} from "react";
import {CONDITION, PAUSE, QUESTIONNAIRE, TEXT} from "./stepTypes";
import Questionnaire from "./steps/Questionnaire";
import Condition from "./steps/Condition";
import Text from "./steps/Text";
import Navigator from "./navigator/Navigator";
import {Container, Row} from "react-bootstrap";
import {unwrapResult} from "@reduxjs/toolkit";
import Pause from "./steps/Pause";

function useWindowSize() {
    const [size, setSize] = useState([0, 0]);
    useLayoutEffect(() => {
        const updateSize = () => {
            setSize([window.innerWidth, window.innerHeight]);
        }
        window.addEventListener('resize', updateSize);
        updateSize();
        return () => window.removeEventListener('resize', updateSize);
    }, []);
    return size;
}

export default function Controller() {
    let { id } = useParams();
    const ref = useRef(null)
    const [width, height] = useWindowSize();
    const [bodyHeight, setBodyheight] = useState(height)

    // Select values from store
    const participant = useSelector(selectParticipant)
    const participantStatus = useSelector(selectStudyStatus)
    const participantError =  useSelector(selectStudyError)
    const participantApi =  useSelector(selectParticipantApi)
    const study = useSelector(selectStudy)
    const studyStatus = useSelector(selectStudyStatus)
    const studyError =  useSelector(selectStudyError)
    const studyApi = useSelector(selectStudyApi)

    const procedure = useSelector(selectProcedure)
    const currentProcedureStep = useSelector(selectCurrentProcedureStep)
    const procedureStatus = useSelector(selectProcedureStatus)
    const procedureError =  useSelector(selectProcedureError)

    const isLastStep = currentProcedureStep && currentProcedureStep.is_last_step;

    const dispatch = useDispatch()

    const adjustHeight = () => {
        if (ref && ref.current) {
            setBodyheight(window.innerHeight - ref.current.childNodes[0].offsetHeight)
        } else {
            setBodyheight(window.innerHeight)
        }
    }

    const end = async () => {
        try {
            await dispatch(endProcedure());
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        dispatch(participantSlice.actions.readTokens())
        fetchCurrentProcedureStep()
        adjustHeight()
    }, [])

    useEffect(() => {
        adjustHeight()
    }, [height, isLastStep])

    useEffect(() => {
        if (isLastStep) {
            end()
        }
    }, [isLastStep])

    const fetchCurrentProcedureStep = async () => {
        if (!currentProcedureStep) {
            try {
                await dispatch(getProcedure(participant.procedure_id))
                await dispatch(currentProcedure())
            } catch (err) {
                console.log(err)
            }
        }
    }

    let view;
    if (currentProcedureStep && currentProcedureStep.procedure_step_type) {
        switch (currentProcedureStep.procedure_step_type) {
            case CONDITION:
                view = <Condition height={bodyHeight} />
                break;
            case TEXT:
                view = <Text />
                break;
            case PAUSE:
                view = <Pause />
                break;
            case QUESTIONNAIRE:
                view = <Questionnaire id={id} height={bodyHeight} />
                break;
        }
    }

    const navigator =  <Navigator adjustHeight={adjustHeight} />
    let navigatorBar = <div ref={ref} >
        {navigator}
    </div>

    return (
        <div>
            <Container fluid>
                <Row>
                    {view}
                </Row>
            </Container>
            {navigatorBar}
        </div>
    );
}