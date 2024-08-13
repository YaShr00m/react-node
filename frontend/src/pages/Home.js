import React from 'react';
import { useAuth } from '../context/AuthContext';

console.log(localStorage);
function Home() {
    const { userData } = useAuth();
    console.log (userData);
    const username = userData.email.split('@')[0];
    return (
        <div className={'content'}>
            <div className={'white_box'}>
                <h1>Hello, {username}!</h1>
                <p>Glad to see you today, hope you're feel good. Is it nice day to live, huh?</p>
            </div>
        </div>
    );
}

export default Home;