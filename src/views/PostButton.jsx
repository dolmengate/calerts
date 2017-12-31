
import React from 'react';
import axios from 'axios';

function PostButton(props) {
    return (
        <button
            type="button"
            className={props.styles}
            tabIndex="0"
            onClick={
                function () {
                    axios.post(`${props.action}`).catch((err) => {
                        console.log('Error on POST to ' + props.action + err);
                    });
                }
            }
        >
            {props.children}
        </button>
    );
}

export default PostButton;