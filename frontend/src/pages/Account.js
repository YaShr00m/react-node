import React, { useState, useEffect } from 'react';
const API_URL = process.env.REACT_APP_API_URL;
import '../assets/css/account.css';

function Account() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        birthDate: '',
        gender: '',
        profilePicture: null,
    });
    const [preview, setPreview] = useState('');
    const [isSaved, setIsSaved] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userId = localStorage.getItem('userData') && JSON.parse(localStorage.getItem('userData'))._id;
                const response = await fetch(`${API_URL}/users/${userId}`);

                if (!response.ok) {
                    throw new Error('Не удалось получить данные пользователя');
                }
                const userData = await response.json();
                setFormData({
                    email: userData.email,
                    password: '',
                    birthDate: userData.birthDate,
                    gender: userData.gender,
                    profilePicture: userData.profilePicture,
                });

                // предварительный просмотр профиля, если изображение уже установлено
                if (userData.profilePicture) {
                    setPreview(`${API_URL}/${userData.profilePicture}`);
                }
            } catch (error) {
                console.error('Ошибка получения данных пользователя:', error);
            }
        };

        fetchUserData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prevState => ({
                ...formData,
                profilePicture: file,
            }));
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const userId = localStorage.getItem('userData') && JSON.parse(localStorage.getItem('userData'))._id;

        const formDataToSend = new FormData();
        formDataToSend.append('email', formData.email);
        if (formData.password) {
            formDataToSend.append('password', formData.password);
        }
        formDataToSend.append('birthDate', formData.birthDate);
        formDataToSend.append('gender', formData.gender);
        if (formData.profilePicture) {
            formDataToSend.append('profilePicture', formData.profilePicture);
        }

        // Логирование содержимого formData
        for (let pair of formDataToSend.entries()) {
            console.log(`${pair[0]}: ${pair[1]}`);
        }

        try {
            const response = await fetch(`${API_URL}/users/${userId}`, {
                method: 'PUT',
                body: formDataToSend,
            });

            if (!response.ok) {
                throw new Error('Ошибка при обновлении данных профиля');
            }

            const updatedUser = await response.json();
            console.log('Профиль успешно обновлен', updatedUser);

            // Обновляем состояние, чтобы показать, что изменения сохранены
            setIsSaved(true);

            setTimeout(() => {
                setIsSaved(false);
            }, 2000);

        } catch (error) {
            console.error('Ошибка обновления профиля:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    return (
        <div className="content">
            <div className="white_box">
                <h2>Edit Your Profile</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Email:</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="name@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Password (if forgot just type new one):</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label>Birth Date:</label>
                        <input
                            type="date"
                            name="birthDate"
                            value={formatDate(formData.birthDate)}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Gender:</label>
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            required
                        >
                            <option value="" disabled>Select</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>
                    <div>
                        <label>Profile Picture:</label>
                        <input
                            type="file"
                            name="profilePicture"
                            onChange={handleFileChange}
                        />
                        {preview && (
                            <div>
                                <img
                                    className={'photo_preview'}
                                    src={preview}
                                    alt="Profile Preview"
                                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                />
                            </div>
                        )}
                    </div>
                    <button type="submit">
                        {isLoading ? 'Please wait...' : isSaved ? 'Saved' : 'Save Changes'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Account;
