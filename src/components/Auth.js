import {
    Redirect,
    Route,
    useParams
} from "react-router-dom";
import { useSelector} from "react-redux";
import {
    selectParticipant,
    selectParticipantApi
} from "../redux/reducers/participantSlice";
import {
    selectStudy, selectStudyApi,
    selectStudyError,
    selectStudyStatus,

} from "../redux/reducers/studySlice";
import React from "react";
import {FINISHED} from "../redux/participantStates";
const {createContext} = require("react");
const {useContext} = require("react");

const authContext = createContext();

export function ProvideAuth({children}) {
    const auth = useProvideAuth()
    return (
        <authContext.Provider value={auth}>
            {children}
        </authContext.Provider>
    );
}

export function useAuth() {
    return useContext(authContext)
}

function useProvideAuth() {
    const participant = useSelector(selectParticipant)
    const participantStatus = useSelector(selectStudyStatus)
    const participantError =  useSelector(selectStudyError)
    const participantApi =  useSelector(selectParticipantApi)

    const study = useSelector(selectStudy)
    const studyStatus = useSelector(selectStudyStatus)
    const studyError = useSelector(selectStudyError)
    const studyApi =  useSelector(selectStudyApi)

    return {
        participant,
        participantStatus,
        participantError,
        participantApi,
        study,
        studyStatus,
        studyError,
        studyApi
    };
}

export function StudyRoute({ children, ...rest }) {
    let auth = useAuth()
    let id  = rest.computedMatch.params.id

    if (auth.study && auth.participant && auth.participant.state === FINISHED) {
        return (
            <Route
                {...rest}
                render={({ location }) =>
                    (
                        <Redirect
                            to={{
                                pathname: "/" + id + "/finish",
                                state: { from: location }
                            }}
                        />
                    )
                }
            />
        );
    }

    return (
        <Route
            {...rest}
            render={({ location }) =>
                auth.study !== null && auth.participant !== null ? (
                    /* we are only checking if study exists, since active participants should end the study
                    even though endDate is reached */
                    children
                ) : (
                    <Redirect
                        to={{
                            pathname: "/" + id,
                            state: { from: location }
                        }}
                    />
                )
            }
        />
    );
}
