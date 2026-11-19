function Loading(){
    return(
        <div className="meal-loading" role="status" aria-live="polite" aria-busy="true">
            <div className="meal-loading__card">
                <span className="meal-loading__label">THE COOKER</span>
                <div className="meal-loading__spinner" aria-hidden="true" />
                <h1>Finding something delicious</h1>
                <p>We’re sending your request and waiting for your meal ideas.</p>
                <span className="meal-loading__hint">This may take a moment. Hang tight!</span>
            </div>
        </div>
    )
}

export default Loading

