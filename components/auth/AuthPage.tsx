
import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';

const AuthPage: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);

    const toggleForm = () => setIsLogin(!isLogin);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 p-4">
             <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-white">
                Career<span className="text-indigo-400">Hub</span> AI
                </h1>
                <p className="text-slate-400 mt-2">Your personal AI-powered career assistant</p>
            </div>
            <div className="w-full max-w-md">
                {isLogin ? <Login onToggle={toggleForm} /> : <Register onToggle={toggleForm} />}
            </div>
        </div>
    );
};

export default AuthPage;
