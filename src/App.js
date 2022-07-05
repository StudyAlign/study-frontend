import React, {createContext} from 'react';
import './App.css';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import Home from "./app/home/Home";
import StudyAlign from "./app/study/StudyAlign";
import {ProvideAuth, StudyRoute} from "./components/Auth";
import Participation from "./app/participation/Participation";
import Controller from "./app/experiment/Controller"
import Finish from "./app/finish/Finish"

export default function App() {
    return (
        <ProvideAuth>
            <Router basename={process.env.PUBLIC_URL}>
                <Switch>
                    <StudyRoute path="/:id/start" children={<Participation/>} />
                    <StudyRoute path="/:id/run" children={<Controller/>} />
                    <StudyRoute path="/:id/end" children={<Finish/>} />
                    <Route path="/:id/participate/:token" children={<StudyAlign/>} />
                    <Route path="/:id" children={<StudyAlign/>} />
                    <Route path="/">
                        <Home/>
                    </Route>
                </Switch>
            </Router>
        </ProvideAuth>
    );
}

