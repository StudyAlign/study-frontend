import {NOT_FOUND, UNPROCESSABLE_ENTITY} from "../api/apiCodes";
import React from "react";

export default function ErrorMessage(props) {

    const studyId = props.studyId
    const studyStatus = props.studyStatus
    const studyError = props.studyError

    if (studyError) {
        switch(studyStatus) {
            case NOT_FOUND:
                return <div>
                    <h2>404 - Study not found</h2>
                    <p>A study with id: '{studyId}' could not be found.</p>
                </div>
                break;
            case UNPROCESSABLE_ENTITY:
                return <div>
                    <h2>422 - Invalid study id</h2>
                    <p>A study with id: '{studyId}' could not be processed.</p>
                </div>
                break;
            default:
                return <div>
                    There was an error getting the study:
                    <p>{studyError.statusText}</p>
                </div>
        }
    }
    return null;
}