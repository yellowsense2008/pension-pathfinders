import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem('pensionquest-user');
    if (saved) {
      const user = JSON.parse(saved);
      if (user.onboarded) {
        navigate('/dashboard', { replace: true });
        return;
      }
    }
    navigate('/onboarding', { replace: true });
  }, [navigate]);

  return null;
};

export default Index;
