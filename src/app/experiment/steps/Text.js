import {useSelector} from "react-redux";
import {
    selectCurrentProcedureStep,
    selectProcedureError,
    selectProcedureStatus
} from "../../../redux/reducers/procedureSlice";

export default function Text() {

    const currentProcedureStep = useSelector(selectCurrentProcedureStep)
    // const procedureStatus = useSelector(selectProcedureStatus)
    // const procedureError =  useSelector(selectProcedureError)

    let title = currentProcedureStep.title
    let body = currentProcedureStep.body

    return (
        <div>
            <h2>{title}</h2>
            <p>{body}</p>
        </div>
    );
}