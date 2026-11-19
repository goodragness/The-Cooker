import { useForm, useFieldArray, type SubmitHandler } from 'react-hook-form';
import { useState } from 'react';
import Loading from './Loading_page';
import {useNavigate} from 'react-router-dom';

// how long the user is willing to cook (value is in minutes; 120 means "2+ hours")
const COOKING_TIME_OPTIONS = [
    { value: 15, label: '15 minutes' },
    { value: 30, label: '30 minutes' },
    { value: 45, label: '45 minutes' },
    { value: 60, label: '1 hour' },
    { value: 90, label: '1.5 hours' },
    { value: 120, label: '2+ hours' },
] as const;

// dietary options the user can pick from (they can pick more than one)
const DIETARY_OPTIONS = [
    { value: 'gluten_free', label: 'Gluten free' },
    { value: 'vegan', label: 'Vegan' },
    { value: 'vegetarian', label: 'Vegetarian' },
    { value: 'dairy_free', label: 'Dairy free' },
    { value: 'pescatarian', label: 'Pescatarian' },
    { value: 'nut_free', label: 'Nut free' },
    { value: 'egg_free', label: 'Egg free' },
    { value: 'shellfish_free', label: 'Shellfish free' },
    { value: 'halal', label: 'Halal' },
    { value: 'kosher', label: 'Kosher' },
    { value: 'low_carb', label: 'Low carb / Keto' },
] as const;

type DietaryRequirement = (typeof DIETARY_OPTIONS)[number]['value'];

type GroceryItem = {
    name: string;
    quantity: string; // free text, e.g. "2", "500g", "1 bunch"
};

// the shape of the data this form collects
export type DecideToCookInputs = {
    moodRating: number;
    cookingTimeMinutes: number; // how long the user is willing to spend cooking
    finishBy: string; // "HH:MM" from the time input
    groceries: GroceryItem[];
    wouldRatherEat: string;
    dietaryRequirements: DietaryRequirement[];
    otherDietaryRequirement: string;
};

function DecideToCookForm(){
    const [submitError, setSubmitError] = useState<string | null>(null);

    // using the useNavigate module:
    const navigate = useNavigate();

    // making a function that will be called on submit:
    const onSubmit: SubmitHandler<DecideToCookInputs> = async (data)=>{
        setSubmitError(null);
        // getting all the data from the form:
        const cleaned = {
            ...data,
            groceries: data.groceries.filter((g) => g.name.trim() !=''),
        };
        // in simple words, groq is being called here to generate a response and a list of 3 dishes the
        // person can cook.

        try{
            const response = await fetch('http://localhost:3000/api/decide_meal_form', {
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify(cleaned),
            });
            if (!response.ok){
                throw new Error(`Request failed: ${response.status}`);
            }

        //     if the response sent by the backend is ok and ha no problem in it
        //     if it's good to go:
            const result = await response.json();  //converting the response to js object
        //     navigating to teh meal option page:
        //     using the route defined it erh App.tsx helping us to navigate to teh meal option page.
        //     while navigating, i have to send the response as well to teh meal option page.
            navigate('/meal-options', {
                state:{meals:result.meals},
            });


        }
        catch (err){
            console.error(err);
            setSubmitError('We couldn’t get your meal ideas. Please try again.');
        }
    }





    // all the required functions and states will be stored and built here
    const {
        register,
        control,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<DecideToCookInputs>({
        defaultValues: {
            moodRating: 5,
            cookingTimeMinutes: undefined,
            finishBy: '',
            groceries: [{ name: '', quantity: '' }],
            wouldRatherEat: '',
            dietaryRequirements: [],
            otherDietaryRequirement: '',
        },
    });

    // dynamic list of groceries the user can add to / remove from
    const { fields: groceryFields, append, remove } = useFieldArray({
        control,
        name: 'groceries',
    });

    // live value so the current rating can be shown next to the slider
    const moodRating = watch('moodRating');

    // const onSubmit: SubmitHandler<DecideToCookInputs> = (data) => {
    //     // drop empty grocery rows before using the data
    //     const cleaned = {
    //         ...data,
    //         groceries: data.groceries.filter((g) => g.name.trim() !== ''),
    //     };
    //     console.log(cleaned);
    // };

    // what will be rendered on the page
    return (
        <div>
            {isSubmitting && <Loading />}
            {submitError && <p role="alert">{submitError}</p>}
            <form onSubmit={handleSubmit(onSubmit)} inert={isSubmitting}>
                {/* 1. mood */}
                <div>
                    <label htmlFor="moodRating">On a scale of 1 to 10, rate your mood: {moodRating}</label>
                    <input
                        id="moodRating"
                        type="range"
                        min={1}
                        max={10}
                        {...register('moodRating', {
                            valueAsNumber: true,
                            required: 'Please rate your mood',
                            min: { value: 1, message: 'Minimum is 1' },
                            max: { value: 10, message: 'Maximum is 10' },
                        })}
                    />
                    {errors.moodRating && <p role="alert">{errors.moodRating.message}</p>}
                </div>

                {/* 2. how much time they're willing to spend cooking */}
                <div>
                    <label htmlFor="cookingTimeMinutes">How much time are you willing to spend cooking?</label>
                    <select
                        id="cookingTimeMinutes"
                        defaultValue=""
                        {...register('cookingTimeMinutes', {
                            valueAsNumber: true,
                            required: 'Please choose how long you want to cook',
                        })}
                    >
                        <option value="" disabled>Select a time</option>
                        {COOKING_TIME_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    {errors.cookingTimeMinutes && <p role="alert">{errors.cookingTimeMinutes.message}</p>}
                </div>

                {/* 3. finish time */}
                <div>
                    <label htmlFor="finishBy">What time do you want to be done cooking?</label>
                    <input
                        id="finishBy"
                        type="time"
                        {...register('finishBy', { required: 'Please pick a time' })}
                    />
                    {errors.finishBy && <p role="alert">{errors.finishBy.message}</p>}
                </div>

                {/* 4. available groceries */}
                <fieldset>
                    <legend>What groceries do you have available?</legend>
                    {groceryFields.map((field, index) => (
                        <div key={field.id}>
                            <input
                                placeholder="Item (e.g. chicken)"
                                aria-label={`Grocery item ${index + 1}`}
                                {...register(`groceries.${index}.name` as const)}
                            />
                            <input
                                placeholder="Quantity (optional)"
                                aria-label={`Quantity for item ${index + 1}`}
                                {...register(`groceries.${index}.quantity` as const)}
                            />
                            <button
                                type="button"
                                onClick={() => remove(index)}
                                disabled={groceryFields.length === 1}
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                    <button type="button" onClick={() => append({ name: '', quantity: '' })}>
                        + Add grocery
                    </button>
                </fieldset>

                {/* 5. what they'd eat if not cooking */}
                <div>
                    <label htmlFor="wouldRatherEat">If you weren't cooking, what would you like to eat?</label>
                    <input
                        id="wouldRatherEat"
                        placeholder="e.g. pizza, sushi, a burger"
                        {...register('wouldRatherEat')}
                    />
                </div>

                {/* 6. dietary requirements (optional) */}
                <fieldset>
                    <legend>Any dietary requirements? (optional)</legend>
                    {DIETARY_OPTIONS.map((option) => (
                        <label key={option.value}>
                            <input
                                type="checkbox"
                                value={option.value}
                                {...register('dietaryRequirements')}
                            />
                            {option.label}
                        </label>
                    ))}
                    <div>
                        <label htmlFor="otherDietaryRequirement">Other:</label>
                        <input
                            id="otherDietaryRequirement"
                            placeholder="e.g. no mushrooms, low sodium"
                            {...register('otherDietaryRequirement')}
                        />
                    </div>
                </fieldset>

                <button type="submit" disabled={isSubmitting}>Submit</button>
            </form>
        </div>
    )
}

export default DecideToCookForm
