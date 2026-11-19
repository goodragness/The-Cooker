import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export function DecidedMeal() {
  const [meal, setMeal] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div>
      <h1>Decided Meal</h1>
    </div>
  );
}

export default DecidedMeal;
