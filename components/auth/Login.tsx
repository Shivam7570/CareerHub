
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Card from '../shared/Card';
import Button from '../shared/Button';
import Loader from '../shared/Loader';

interface LoginProps {
    onToggle: () => void;
}

const Login: React.FC<LoginProps> = ({ onToggle }) => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            await login(formData);
        } catch (err: any) {
            setError(err.message || 'Failed to login. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <h2 className="text-2xl font-bold text-center text-white">Login</h2>
                {error && <div className="bg-red-900/50 text-red-300 p-3 rounded-md text-sm">{error}</div>}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300" htmlFor="email">Email</label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        required
                        className="w-full bg-slate-900 border border-slate-600 rounded-md p-3 text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300" htmlFor="password">Password</label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        required
                        className="w-full bg-slate-900 border border-slate-600 rounded-md p-3 text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        value={formData.password}
                        onChange={handleChange}
                    />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? <><Loader size="sm"/> Logging in...</> : 'Login'}
                </Button>
                <p className="text-sm text-center text-slate-400">
                    Don't have an account?{' '}
                    <button type="button" onClick={onToggle} className="font-medium text-indigo-400 hover:underline">
                        Register
                    </button>
                </p>
            </form>
        </Card>
    );
};

export default Login;
