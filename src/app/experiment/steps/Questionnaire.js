import {useSelector} from "react-redux";
import {
    selectCurrentProcedureStep,
    selectProcedureError,
    selectProcedureStatus
} from "../../../redux/reducers/procedureSlice";
import {selectParticipant} from "../../../redux/reducers/participantSlice";
import {selectStudyError, selectStudyStatus} from "../../../redux/reducers/studySlice";
import {useAuth} from "../../../components/Auth";

export default function Questionnaire(props) {

    const auth = useAuth()

    const currentProcedureStep = useSelector(selectCurrentProcedureStep)
    const procedureStatus = useSelector(selectProcedureStatus)
    const procedureError =  useSelector(selectProcedureError)

    return (
        <iframe
            title="Questionnaire"
            src={currentProcedureStep.url + "?token=" + auth.participant.token}
            style={{width: "100%", height: props.height}}
            frameBorder={0}
        ></iframe>
    );
}