import React, { useContext, useEffect, useRef } from 'react'
import './Main.css'
import { assets } from '../../assets/assets'
import { Context } from '../../context/Context'

const Main = () => {
    const { 
        onSent, 
        recentPrompt, 
        showResult, 
        loading, 
        displayedText, 
        scrollTrigger, 
        setInput, 
        input 
    } = useContext(Context);
    
    const resultRef = useRef(null);

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && input.trim() !== '') {
            onSent();
        }
    };

    useEffect(() => {
        if (resultRef.current) {
            resultRef.current.scrollTop = resultRef.current.scrollHeight;
        }
    }, [scrollTrigger]);

    const renderResponse = () => {
        if (loading) {
            return (
                <div className='loader'>
                    <hr />
                    <hr />
                    <hr />
                </div>
            );
        }
    
        if (!displayedText) {
            return null;
        }
    
        return (
            <div className="response-content">
                <div dangerouslySetInnerHTML={{ __html: displayedText }} />
            </div>
        );
    };

    return (
        <div className='main'>
            <div className='nav'>
                <p>Gemini</p>
                <img src={assets.user_icon} alt='' />
            </div>
            <div className="main-container">
                {!showResult ? (
                    <>
                        <div className="greet">
                            <p><span>Hello, Guest.</span></p>
                            <p>How can I help you today?</p>
                        </div>
                        <div className="cards">
                            <div className="card" onClick={() => onSent("Suggest beautiful places to see on an upcoming road trip")}>
                                <p>Suggest beautiful places to see on an upcoming road trip</p>
                                <img src={assets.compass_icon} alt='' />
                            </div>
                            <div className="card" onClick={() => onSent("Briefly summarise this concept: urban planning")}>
                                <p>Briefly summarise this concept: urban planning</p>
                                <img src={assets.bulb_icon} alt='' />
                            </div>
                            <div className="card" onClick={() => onSent("Brainstorm team bonding activities for our work retreat")}>
                                <p>Brainstorm team bonding activities for our work retreat</p>
                                <img src={assets.message_icon} alt='' />
                            </div>
                            <div className="card" onClick={() => onSent("Improve the readability of the following code")}>
                                <p>Improve the readability of the following code</p>
                                <img src={assets.code_icon} alt='' />
                            </div>
                        </div>
                    </>
                ) : (
                    <div className='result' ref={resultRef}>
                        <div className="result-title">
                            <img src={assets.user_icon} alt='' />
                            <p>{recentPrompt}</p>
                        </div>
                        <div className="result-data">
                            <img src={assets.gemini_icon} alt="" />
                            {renderResponse()}
                        </div>
                    </div>
                )}

                <div className="main-bottom">
                    <div className="search-box">
                        <input
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyPress}
                            value={input}
                            type="text"
                            placeholder='Enter a prompt here'
                        />
                        <div>
                            <img src={assets.gallery_icon} alt="" />
                            <img src={assets.mic_icon} alt="" />
                            {input ? <img onClick={() => onSent()} src={assets.send_icon} alt="" /> : null}
                        </div>
                    </div>
                    <p className="bottom-info">
                        Gemini may display inaccurate info, including about people, so double-check its responses. Your privacy and Gemini Apps
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Main