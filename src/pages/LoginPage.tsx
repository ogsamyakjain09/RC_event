import { useState } from 'react';
import { ShieldCheck, Store, Heart, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/RC_LOGO.jpg';

const roles = [
  {
    id: 'admin',
    label: 'Admin',
    description: 'Full system access - manage users, events, and settings',
    icon: ShieldCheck,
    color: 'bg-brand-primary',
  },
  {
    id: 'vendor',
    label: 'Vendor',
    description: 'View assigned tasks and update status',
    icon: Store,
    color: 'bg-status-info',
  },
  {
    id: 'wedding_couple',
    label: 'Wedding Couple',
    description: 'View event progress and approvals',
    icon: Heart,
    color: 'bg-status-success',
  },
];

export function LoginPage() {
  const { login } = useAuth();
  const [selected, setSelected] = useState<string | null>(null);
  const [step, setStep] = useState<'role' | 'credentials'>('role');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRoleSelect = (roleId: string) => {
    setSelected(roleId);
  };

  const handleContinue = () => {
    if (selected) {
      setStep('credentials');
      setError('');
    }
  };

  const handleBack = () => {
    setStep('role');
    setError('');
    setEmail('');
    setPassword('');
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await login(email, password);
    } catch (err) {
      setError('Invalid email or password. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mb-4 flex justify-center">
            <img src={logo} alt="RC Events" className="h-16 w-auto" />
          </div>
          <h1 className="text-2xl font-bold">RC Events</h1>
          <p className="text-sm text-muted-foreground mt-1">AI-Powered Event Operations Platform</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">

          {step === 'role' && (
            <>
              <h2 className="text-lg font-semibold mb-1">Welcome to RC Events</h2>
              <p className="text-sm text-muted-foreground mb-5">Select your role to continue</p>

              <div className="space-y-3">
                {roles.map((role) => {
                  const Icon = role.icon;
                  const isSelected = selected === role.id;
                  return (
                    <button
                      key={role.id}
                      onClick={() => handleRoleSelect(role.id)}
                      className={`w-full flex items-start gap-4 p-4 rounded-xl border text-left transition-all duration-200 ${
                        isSelected
                          ? 'border-brand-primary bg-brand-primary/5 ring-2 ring-brand-primary/20'
                          : 'border-border hover:border-brand-primary/50 hover:bg-accent'
                      }`}
                    >
                      <div className={`flex-shrink-0 w-10 h-10 rounded-lg ${role.color} flex items-center justify-center`}>
                        <Icon size={20} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm">{role.label}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">{role.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <button
                onClick={handleContinue}
                disabled={!selected}
                className="w-full mt-6 py-3 rounded-xl bg-brand-primary text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition"
              >
                Continue as {selected ? roles.find(r => r.id === selected)?.label : '...'} <ArrowRight size={18} />
              </button>
            </>
          )}

          {step === 'credentials' && (
            <>
              <button onClick={handleBack} className="text-sm text-muted-foreground mb-4 hover:text-foreground transition">
                ← Back to role selection
              </button>

              <h2 className="text-lg font-semibold mb-1">
                Login as {roles.find(r => r.id === selected)?.label}
              </h2>
              <p className="text-sm text-muted-foreground mb-5">Enter your credentials to continue</p>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
                      onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                    />
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3.5 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                    {error}
                  </div>
                )}

                <button
                  onClick={handleLogin}
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-brand-primary text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50 hover:opacity-90 transition"
                >
                  {loading ? 'Logging in...' : 'Login'} {!loading && <ArrowRight size={18} />}
                </button>
              </div>
            </>
          )}

        </div>
        <p className="text-center text-xs text-muted-foreground mt-4">RC Events POC v1.0</p>
      </div>
    </div>
  );
}