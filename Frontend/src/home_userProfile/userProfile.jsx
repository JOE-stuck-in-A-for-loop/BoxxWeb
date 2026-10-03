import { useAuth } from '../AuthContext';
import { useI18n } from '../i18n';

function UserProfile() {
    const { user, logout } = useAuth();
    const { t } = useI18n();

    return (
        <div id="guestInformation">
            <div>
                <p>{t('userProfile.welcome', { username: user?.username })}</p>
                <button onClick={logout}>{t('userProfile.logout')}</button>
            </div>
        </div>
    );
}

export default UserProfile;