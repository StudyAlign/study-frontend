import { combineReducers } from "redux";
import participant from "./participantSlice";
import study from "./studySlice";
import procedure from "./procedureSlice";
import navigator from "./navigatorSlice";

export default combineReducers({
    study,
    participant,
    procedure,
    navigator
});