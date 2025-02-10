import React, { useContext } from 'react';
import { Context } from '../../context/Context';

const Result = () => {
    const { displayedText, loading } = useContext(Context);

    return (
        <div>
            {loading && <p>Loading...</p>}
            <div dangerouslySetInnerHTML={{ __html: displayedText }} />
        </div>
    );
};

export default Result;