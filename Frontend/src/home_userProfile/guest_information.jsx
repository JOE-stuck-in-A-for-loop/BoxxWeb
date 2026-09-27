import { useState } from 'react';
import styles from './guest_information.module.css';

function GuestInformation() {
    const [view, setView] = useState('default');

    return (
        <div id="guestInformation" className={styles.guestInformation}>
            <div className={styles.leftSection}>
                <h1>Guests need to know</h1>
                <ul>
                    <li>You can totally browse all posts, articles, etc.</li>
                    <li>To post or comment on existing content, you need to be logged in</li>
                    <li>To utilize the Chat feature, you need to be logged in</li>
                    <li>Besides logging in, you also need identity verification</li>
                </ul>
            </div>

            <div className={styles.rightSection}>
                {view === 'default' && (
                    <>
                        <h1>Login or Register</h1>
                        <p>To access the full features of Boxx, please log in or register for an account.</p>
                        <button className={styles.loginButton} onClick={() => setView('login')}>Login</button>
                        <button className={styles.registerButton} onClick={() => setView('register')}>Register</button>
                    </>
                )}

                {view === 'login' && (
                    <div className={styles.form}>
                        <h2 className={styles.formTitle}>Login</h2>
                        <input className={styles.input} type="text" placeholder="Username" />
                        <input className={styles.input} type="password" placeholder="Password" />
                        <button className={styles.submitBtn}>Login</button>
                        <button className={styles.backLink} onClick={() => setView('default')}>← Back</button>
                        <p className={styles.switchLink}>
                            Don't have an account?{' '}
                            <span onClick={() => setView('register')}>Register</span>
                        </p>
                    </div>
                )}

                {view === 'register' && (
                    <div className={styles.form}>
                        <h2 className={styles.formTitle}>Register</h2>
                        <input className={styles.input} type="text" placeholder="Username" />
                        <input className={styles.input} type="password" placeholder="Password" />
                        <input className={styles.input} type="text" placeholder="ID" />
                        <button className={styles.submitBtn}>Register</button>
                        <button className={styles.backLink} onClick={() => setView('default')}>← Back</button>
                        <p className={styles.switchLink}>
                            Already have an account?{' '}
                            <span onClick={() => setView('login')}>Login</span>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default GuestInformation;