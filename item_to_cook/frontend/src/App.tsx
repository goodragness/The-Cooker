import { Navigate, Route, Routes } from 'react-router-dom';
import DecideToCookForm from './pages/Decide_To_Cook_Form';
import DecidedMeal from './pages/Decided_Meal_Page';
import GeneratedMealOptions from './pages/Generated_Meal_Options_Page';
import Loading from './pages/Loading_page';

function App() {
    return (
        <Routes>
            <Route path="/" element={<DecideToCookForm />} />
            <Route path="/loading" element={<Loading />} />
            <Route path="/meal-options" element={<GeneratedMealOptions />} />
            <Route path="/decided-meal" element={<DecidedMeal />} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default App;


