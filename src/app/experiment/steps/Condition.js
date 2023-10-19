import {useSelector} from "react-redux";
import {
    selectCurrentProcedureStep,
    selectProcedureError,
    selectProcedureStatus
} from "../../../redux/reducers/procedureSlice";
import {selectParticipant} from "../../../redux/reducers/participantSlice";
import {current} from "@reduxjs/toolkit";
import {selectStudy} from "../../../redux/reducers/studySlice";

export default function Condition(props) {

    const study = useSelector(selectStudy)
    const participant = useSelector(selectParticipant)
    const currentProcedureStep = useSelector(selectCurrentProcedureStep)
    const procedureStatus = useSelector(selectProcedureStatus)
    const procedureError =  useSelector(selectProcedureError)

    const loggerKey = participant.logger_key;
    const participantToken = participant.token;

    const condition_id = currentProcedureStep.id;
    const study_id = study.id;

    const config = currentProcedureStep.config;

    let iframeAllow = config && config.iframeAllow;

    let src = new URL(currentProcedureStep.url);
    let params = new URLSearchParams(src.search);
    params.set("condition_id", condition_id);
    params.set("study_id", study_id);
    if (loggerKey) {
        params.set("logger_key", loggerKey);
    }

    if (participantToken) {
        params.set("participant_token", participantToken);
    }
    src.search = params;

    return (
            <iframe
                    title={currentProcedureStep.name}
                    src={src.href}
                    style={{width: "100%", height: props.height}}
                    allow={iframeAllow}
                    frameBorder={0}
            ></iframe>
    );
}