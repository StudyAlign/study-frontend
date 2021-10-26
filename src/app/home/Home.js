import {Col, Container, Row} from "react-bootstrap";
import React from "react";
import {Command} from "react-bootstrap-icons";

export default function Home() {
    return (
        <div id="wrapper">
            <Container>
                <Row>
                    <Col lg={{ span: 8, offset: 2 }} md={{ span: 10, offset: 1 }} xs={12}>
                        <img className={"logo home"} src={process.env.PUBLIC_URL + '/hciai-ubt-combination-rgb-white-dense.png'} />
                    </Col>
                </Row>
            </Container>
            <Container>
                <Row>
                    <Col lg={{ span: 8, offset: 2 }} md={{ span: 10, offset: 1 }} xs={12}>
                        <h2>This is the studyalign frontend.</h2>
                        <p>To participate in a study you have to get the correct URL from the experimenter.</p>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}