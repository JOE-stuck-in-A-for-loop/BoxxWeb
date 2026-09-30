import { useAuth } from '../AuthContext';

function UserProfile() {
    const { user, logout } = useAuth();

    return (
        <div id="guestInformation">
            <div>
                <p>欢迎, <strong>{user?.username}</strong>!</p>
                <button onClick={logout}>登出</button>
            </div>
        </div>
    );
}

export default UserProfile;