import React from 'react';
import ReactDOMServer from 'react-dom/server';

const html = ReactDOMServer.renderToString(
    <div>Hello 서버 사이드 렌더링</div>
);

console.log(html);