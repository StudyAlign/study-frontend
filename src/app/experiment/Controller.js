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
    currentProcedure,
    selectCurrentProcedureStep,
    selectProcedureError,
    selectProcedureStatus
} from "../../redux/reducers/procedureSlice";
import {useEffect, useLayoutEffect, useRef, useState} from "react";
import {CONDITION, QUESTIONNAIRE, TEXT} from "./stepTypes";
import Questionnaire from "./steps/Questionnaire";
import Condition from "./steps/Condition";
import Text from "./steps/Text";
import Navigator from "./navigator/Navigator";
import {Container, Row} from "react-bootstrap";

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

    const currentProcedureStep = useSelector(selectCurrentProcedureStep)
    const procedureStatus = useSelector(selectProcedureStatus)
    const procedureError =  useSelector(selectProcedureError)

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(participantSlice.actions.readTokens())
        fetchCurrentProcedureStep()

        console.log(window.innerHeight)
        console.log(ref.current.childNodes[0].offsetHeight)

        setBodyheight(window.innerHeight - ref.current.childNodes[0].offsetHeight)
    }, [])

    useEffect(() => {
        setBodyheight(window.innerHeight - ref.current.childNodes[0].offsetHeight)
    }, [height])

    const fetchCurrentProcedureStep = async () => {
        if (!currentProcedureStep) {
            try {
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
            case QUESTIONNAIRE:
                view = <Questionnaire height={bodyHeight} />
                break;
        }
    }

    let navigator = <Navigator />

    return (
        <div>
            <Container fluid>
                <Row>
                    {view}
                </Row>
            </Container>
            <div ref={ref} >
                {navigator}
            </div>
        </div>
    );
}