import { useLocation, Link } from 'react-router-dom';

function GeneratedMealOptions(){
    const location = useLocation();
    const meals = location.state?.meals;
    if(meals == null){
        return (
            <main>
                <p>No meal ideas yet. Please submit the form first.</p>
                <Link to="/">Back to the form</Link>
            </main>
        )
    }


    return(
        <main>
            <h1>Your meal options</h1>

            <div style={{ whiteSpace: 'pre-wrap' }}>
                {typeof meals === 'string'
                    ? meals
                    : JSON.stringify(meals, null, 2)}
            </div>

            <Link to="/">Try again</Link>
        </main>
    );

}

export default GeneratedMealOptions

