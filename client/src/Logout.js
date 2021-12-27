import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'

const Logout = () => {

    const history = useHistory();
    useEffect(() => {
        fetch('/user/logout', {
            method: "GET",
            headers: {
                Accept: "applications/json",
                "Content-Type": "applications/json"
            },
            credentials: "include"
        }).then((res) => {
            history.push('/login', { replace: true })
            if (res.status !== 200) {
                const error = new Error(res.error);
                throw error;
            }
        }).catch((err) => {
            console.log(err);
        });
    });

    return (
        <h1>Logout</h1>
    )
}

export default Logout