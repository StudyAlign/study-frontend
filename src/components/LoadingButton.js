import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';


export default function LoadingButton(props) {
    const [isLoading, setLoading] = useState(false);

    const handleClick = () => setLoading(true);

    return (
        <Button
            variant="primary"
            disabled={isLoading}
            onClick={!isLoading ? handleClick : null}
        >
            {isLoading ? 'Loading…' : 'Click to load'}
        </Button>
    );
}