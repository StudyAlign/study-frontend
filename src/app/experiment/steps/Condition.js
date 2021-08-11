import {useSelector} from "react-redux";
import {
    selectCurrentProcedureStep,
    selectProcedureError,
    selectProcedureStatus
} from "../../../redux/reducers/procedureSlice";

export default function Condition(props) {

    const currentProcedureStep = useSelector(selectCurrentProcedureStep)
    const procedureStatus = useSelector(selectProcedureStatus)
    const procedureError =  useSelector(selectProcedureError)

    // TODO: pass config via get params?

    return (
            <iframe
                    title={currentProcedureStep.name}
                    src={currentProcedureStep.url}
                    style={{width: "100%", height: props.height}}
                    frameBorder={0}
            ></iframe>
    );
}