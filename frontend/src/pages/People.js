import React, { useState, useEffect } from 'react';
import UsersTable from '../components/UsersTable';
import '../assets/css/people.css';
const API_URL = process.env.REACT_APP_API_URL;

function Home() {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);

    const defaultProfilePicture = '/ava.svg';

    function getProfilePictureUrl(profilePicture) {
        return profilePicture ? `${API_URL}/${profilePicture}` : defaultProfilePicture;
    }

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/users`);
                if (!response.ok) {
                    throw new Error('Cant fetch users');
                }
                const data = await response.json();


                const usersWithAge = data.map(user => ({
                    ...user,
                    age: calculateAge(user.birthDate),
                }));

                setUsers(usersWithAge);
                if (usersWithAge.length > 0) {
                    setSelectedUser(usersWithAge[0]); // Установить первого пользователя в качестве выбранного
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    // Функция для вычисления возраста
    const calculateAge = (birthDate) => {
        const birth = new Date(birthDate);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const monthDifference = today.getMonth() - birth.getMonth();
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    };

    // Функция для форматирования даты
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;
    };

    // Функция для получения части email до '@'
    const getEmailPrefix = (email) => {
        return email.split('@')[0];
    };

    const handleUserClick = (user) => {
        console.log(`User clicked: ${user.name}`);
        setSelectedUser(user);
    };

    return (
        <div className="content">
            <div className="grid">
                <div className="white_box tabled">
                    <div className="flex">
                        <UsersTable users={users} selectedUserId={selectedUser ? selectedUser._id : null} onUserClick={handleUserClick} />
                    </div>
                </div>
                {selectedUser && (
                    <div className="white_box profile_card overflowed">
                        <div className="header">
                            <h1>{getEmailPrefix(selectedUser.email)} {selectedUser.id}</h1>
                            <span>Registered at {formatDate(selectedUser.registrationDate)}</span>
                        </div>
                        <div className="flex">
                            <img
                                className="profile-picture"
                                src={getProfilePictureUrl(selectedUser.profilePicture)}
                                alt={`${selectedUser.name}'s photo`}
                            />
                            <table>
                                <tbody>
                                <tr>
                                    <td>Age:</td>
                                    <td>{selectedUser.age}</td>
                                </tr>
                                <tr>
                                    <td>Birth:</td>
                                    <td>{new Date(selectedUser.birthDate).toLocaleDateString()}</td>
                                </tr>
                                <tr>
                                    <td>Email:</td>
                                    <td>{selectedUser.email}</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Home;