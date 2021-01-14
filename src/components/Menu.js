import React from 'react';
import {Link} from 'react-router-dom';
const Menu = () => {
    return (
        <ul>
            <li>
                <Link to="/red">red</Link>
            </li>    
            <li>
                <Link to="/blue">blue</Link>
            </li>    
        </ul>
    )
}

export default Menu;

// 빨간박스, 파란박스 보여주는 컴포넌트로 이동하는 메뉴 컴포넌트