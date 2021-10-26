import {Col, Container, Row} from "react-bootstrap";
import React from "react";

export default function Topbar(props) {
    return <div className="top-bar">
        <Container>
            <Row>
                <Col lg={{ span: 8, offset: 2 }} md={{ span: 10, offset: 1 }} xs={12}>
                    <img className={"logo"} src={process.env.PUBLIC_URL + '/hciai-ubt-combination-rgb-white-dense.png'} />
                </Col>
            </Row>
        </Container>
    </div>
}