
import React from 'react';
import axios from 'axios';

function PostButton(props) {
    return (
        <button
            type="button"
            className="btn btn-secondary"
            onClick={
                function () {
                    axios.post(`${props.action}`).catch((err) => {
                        console.log('Error on POST to ' + props.action + err);
                    });
                }
            }
        >
            {props.text}
        </button>
    );
}

export default PostButton;