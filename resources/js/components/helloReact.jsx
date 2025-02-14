import React from 'react';
import { createRoot } from "react-dom/client"

export default function HelloReact() {
    return (
        <h1>Hello React!</h1>
    );
}

if (document.getElementById('hello-react')) {
    const helloReact = createRoot(document.getElementById('hello-react'));
    helloReact.render(<HelloReact />);
}
