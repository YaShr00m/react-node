import React from 'react';
import '../assets/css/people.css';
const API_URL = process.env.REACT_APP_API_URL;
const defaultProfilePicture = 'ava.svg'; // Укажите путь к заглушке

function UsersTable({ users, selectedUserId, onUserClick }) {
    console.log(`Selected user ID in UsersTable: ${selectedUserId}`);
    const getProfilePictureUrl = (profilePicture) => {
        return profilePicture ? `${API_URL}/${profilePicture}` : defaultProfilePicture;
    };

    return (
        <div className="flex-table">
            <div className="flex-header">
                <div className="flex-cell">Photo</div>
                <div className="flex-cell">Name</div>
                <div className="flex-cell">Age</div>
            </div>
            {users.map((user) => (
                <div
                    className={`flex-row ${user._id === selectedUserId ? 'active' : ''}`}
                    key={user._id}
                    onClick={() => onUserClick(user)}
                >
                    <div
                        className="profile-picture"
                        style={{
                            backgroundImage: `url(${getProfilePictureUrl(user.profilePicture)})`,
                            width: '64px',
                            height: '64px',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            borderRadius: '50%',
                        }}
                        alt={user.name}
                    />
                    <div className="flex-cell">{user.email}</div>
                    <div className="flex-cell">{user.age}</div>
                </div>
            ))}
        </div>
    );
}

export default UsersTable;
