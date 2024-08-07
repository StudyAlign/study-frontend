import {useSelector} from "react-redux";
import {
    selectCurrentProcedureStep,
    selectProcedureError,
    selectProcedureStatus
} from "../../../redux/reducers/procedureSlice";
import {useAuth} from "../../../components/Auth";

export default function Questionnaire(props) {

    const auth = useAuth()

    const currentProcedureStep = useSelector(selectCurrentProcedureStep)
    const procedureStatus = useSelector(selectProcedureStatus)
    const procedureError =  useSelector(selectProcedureError)

    const participantToken = auth.participant.token;

    console.log("PARTICIPANT TOKEN FOR SURVEY", auth.participant.token, participantToken)

    const url = new URL(window.location.href);
    const prolific_id = url.searchParams.get("PROLIFICPID");
    const prolific_study_id = url.searchParams.get("STUDYID");
    const prolific_session = url.searchParams.get("SESSIONID");

    let src = new URL(currentProcedureStep.url);
    let params = new URLSearchParams(src.search);
    params.set("SAL_TOKEN", participantToken);

    if (prolific_id) {
        params.set("PROLIFICPID", prolific_id);
    }
    if (prolific_study_id) {
        params.set("STUDYID", prolific_study_id);
    }
    if (prolific_session) {
        params.set("SESSIONID", prolific_session);
    }
    src.search = params;
    return (
        <iframe
            title="Questionnaire"
            name="sal-questionnaire"
            src={ src.href }
            style={{width: "100%", height: props.height}}
            frameBorder={0}
        ></iframe>
    );
}