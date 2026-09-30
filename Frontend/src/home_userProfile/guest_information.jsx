import { useState } from 'react';
import { useAuth } from '../AuthContext';
import UserProfile from './userProfile';
import styles from './guest_information.module.css';

function GuestInformation() {
    const { user, isAuthenticated, login, register, loading } = useAuth();
    const [view, setView] = useState('default');

    // 表单字段
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // 切换视图时清空表单
    function switchView(newView) {
        setView(newView);
        setUsername('');
        setPassword('');
        setError('');
    }

    // 如果正在检查登录状态，显示 loading
    if (loading) {
        return (
            <div id="guestInformation" className={styles.guestInformation}>
                <div className={styles.rightSection}>
                    <p>加载中...</p>
                </div>
            </div>
        );
    }

    // 如果已登录，直接显示 UserProfile
    if (isAuthenticated) {
        return <UserProfile />;
    }

    async function handleLogin(e) {
        e.preventDefault();
        if (!username.trim() || !password.trim()) {
            setError('请填写用户名和密码');
            return;
        }
        setSubmitting(true);
        setError('');
        try {
            await login(username, password);
            // 登录成功 → isAuthenticated 变为 true，组件自动显示 UserProfile
        } catch (err) {
            if (err.status === 401) {
                setError('用户名或密码错误');
            } else {
                setError(err.message || '登录失败，请稍后重试');
            }
        } finally {
            setSubmitting(false);
        }
    }

    async function handleRegister(e) {
        e.preventDefault();
        if (!username.trim() || !password.trim()) {
            setError('请填写用户名和密码');
            return;
        }
        if (password.length < 4) {
            setError('密码至少 4 位');
            return;
        }
        setSubmitting(true);
        setError('');
        try {
            await register(username, password);
            // 注册成功 → 自动登录 → isAuthenticated 变为 true
        } catch (err) {
            if (err.status === 400) {
                setError('用户名已存在');
            } else {
                setError(err.message || '注册失败，请稍后重试');
            }
        } finally {
            setSubmitting(false);
        }
    }

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
                        <button className={styles.loginButton} onClick={() => switchView('login')}>Login</button>
                        <button className={styles.registerButton} onClick={() => switchView('register')}>Register</button>
                    </>
                )}

                {view === 'login' && (
                    <form className={styles.form} onSubmit={handleLogin}>
                        <h2 className={styles.formTitle}>Login</h2>
                        <input
                            className={styles.input}
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            disabled={submitting}
                        />
                        <input
                            className={styles.input}
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={submitting}
                        />
                        {error && <p className={styles.errorMsg}>{error}</p>}
                        <button className={styles.submitBtn} type="submit" disabled={submitting}>
                            {submitting ? '登录中...' : 'Login'}
                        </button>
                        <button className={styles.backLink} type="button" onClick={() => switchView('default')}>
                            ← Back
                        </button>
                        <p className={styles.switchLink}>
                            Don't have an account?{' '}
                            <span onClick={() => switchView('register')}>Register</span>
                        </p>
                    </form>
                )}

                {view === 'register' && (
                    <form className={styles.form} onSubmit={handleRegister}>
                        <h2 className={styles.formTitle}>Register</h2>
                        <input
                            className={styles.input}
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            disabled={submitting}
                        />
                        <input
                            className={styles.input}
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={submitting}
                        />
                        {error && <p className={styles.errorMsg}>{error}</p>}
                        <button className={styles.submitBtn} type="submit" disabled={submitting}>
                            {submitting ? '注册中...' : 'Register'}
                        </button>
                        <button className={styles.backLink} type="button" onClick={() => switchView('default')}>
                            ← Back
                        </button>
                        <p className={styles.switchLink}>
                            Already have an account?{' '}
                            <span onClick={() => switchView('login')}>Login</span>
                        </p>
                    </form>
                )}
            </div>
        </div>
    );
}

export default GuestInformation;