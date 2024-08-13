import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

function AuthForm() {
    const { isAuthenticated, login, register, setIsAuthenticated } = useAuth();

    if (isAuthenticated) return <div>Вы уже авторизованы.</div>;

    const [isRegistering, setIsRegistering] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        birthDate: '',
        gender: '',
        profilePicture: null,
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleFileChange = (file) => {
        setFormData(prevState => ({
            ...prevState,
            profilePicture: file,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        const submitData = new FormData();
        submitData.append('email', formData.email);
        submitData.append('password', formData.password);
        submitData.append('birthDate', formData.birthDate);
        submitData.append('gender', formData.gender);
        if (formData.profilePicture) {
            submitData.append('profilePicture', formData.profilePicture);
        }

        try {
            let response;
            if (isRegistering) {
                console.log('Registering...');
                response = await register(submitData);
            } else {
                console.log('Logging in...');
                response = await login(submitData);
            }

            if (response) {
                setSuccess('Success! Logging in...');
            } else {
                throw new Error('Error, try again');
            }
        } catch (err) {
            console.error('Error:', err);
            setError(err.message || 'Error, try again');
        } finally {
            setLoading(false);
        }
    };

    const toggleForm = () => {
        setIsRegistering(!isRegistering);
    };

    const today = new Date().toISOString().split('T')[0];

    // Обработчики Drag & Drop
    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const file = e.dataTransfer.files[0];
        if (file) {
            handleFileChange(file);
        }
    };

    return (
        <div className="auth-form">
            <h2>{isRegistering ? 'Register' : 'Login'}</h2>
            {error && <span className="error">{error}</span>}
            {success && <span className="success">{success}</span>}
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
                    <label>Password:</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                {isRegistering && (
                    <>
                        <div>
                            <label>Date of birth:</label>
                            <input
                                type="date"
                                name="birthDate"
                                value={formData.birthDate}
                                onChange={handleChange}
                                max={today}
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
                                <option value="" disabled>Please choose</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </div>
                        <label>Photo:</label>
                        <div
                            className="dragDrop drop-zone"
                            onClick={() => fileInputRef.current.click()}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                        >
                            <input
                                type="file"
                                name="profilePicture"
                                ref={fileInputRef}
                                onChange={(e) => handleFileChange(e.target.files[0])}
                                accept="image/*"
                                style={{display: 'none'}}
                            />
                            <p>
                                {formData.profilePicture ? (
                                    <img
                                        src={URL.createObjectURL(formData.profilePicture)}
                                        alt="Preview"
                                        style={{maxWidth: '100%', maxHeight: '200px'}}
                                    />
                                ) : (
                                    "Drop file here or click to select"
                                )}
                            </p>
                        </div>
                    </>
                )}
                <button type="submit" disabled={loading}>
                    {loading ? 'Please wait...' : isRegistering ? 'Register' : 'Login'}
                </button>
            </form>
            <p>
                {isRegistering ? (
                    <>Already have an account? <a href="#" onClick={toggleForm}>Login</a></>
                ) : (
                    <>No account? <a href="#" onClick={toggleForm}>Sign up now</a>!</>
                )}
            </p>
        </div>
    );
}

export default AuthForm;