import React, { useContext } from 'react'
import './Main.css'
import { assets } from '../../assets/assets'
import { Context } from '../../context/Context'

const Main = () => {
    const {onSent, recentPrompt, showResult, loading, displayedText, setInput, input} = useContext(Context);

    // Add a handler for the Enter key press
    const handleKeyPress = (e) => {
        // Check if the key pressed is Enter and there's an input
        if (e.key === 'Enter' && input.trim() !== '') {
            onSent();
        }
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
                <p><span>Hello, Dev.</span></p>
                <p>How can I help you today?</p>
            </div>
            <div className="cards">
                <div className="card" onClick={()=>onSent("Suggest beautiful places to see on an upcoming road trip")}>
                    <p>Suggest beautiful places to see on an upcoming road trip</p>
                    <img src={assets.compass_icon} alt='' />
                </div>
                <div className="card" onClick={()=>onSent("Briefly summarise this concept: urban planning")}>
                    <p>Briefly summarise this concept: urban planning</p>
                    <img src={assets.bulb_icon} alt='' />
                </div>
                <div className="card" onClick={()=>onSent("Brainstorm team bonding activities for our work retreat")}>
                    <p>Brainstorm team bonding activities for our work retreat</p>
                    <img src={assets.message_icon} alt='' />
                </div>
                <div className="card" onClick={()=>onSent("Improve the readability of the following code")}>
                    <p>Improve the readability of the following code</p>
                    <img src={assets.code_icon} alt='' />
                </div>
            </div>
            </>
            ) : ( 
            <div className='result'>
                <div className="result-title">
                    <img src={assets.user_icon} alt='' />
                    <p>{recentPrompt}</p>
                </div>
                <div className="result-data">
                    <img src={assets.gemini_icon} alt="" />
                    {loading ? (
                     <div className='loader'>
                        <hr />
                        <hr />
                        <hr />
                    </div>
                    ) : (
                        <div dangerouslySetInnerHTML={{ __html: displayedText }} /> // Display using displayedResult
                    )}
                </div>
            </div>

            )}
            
            <div className="main-bottom">
                <div className="search-box">
                    <input 
                        onChange={(e)=>setInput(e.target.value)} 
                        onKeyPress={handleKeyPress} // Add the onKeyPress event handler
                        value={input} 
                        type="text"  
                        placeholder='Enter a prompt here'
                    />
                    <div>
                        <img src={assets.gallery_icon} alt="" />
                        <img src={assets.mic_icon} alt="" />
                        {input?<img onClick={()=>onSent()} src={assets.send_icon} alt="" />:null}
                    </div>
                </div>
                <p className="bottom-info">
                    Gemini may display inaacurate info, including about people, so double-check its responses. Your privacy and Gemini Apps
                </p>
            </div>
        </div>
    </div>
  )
}

export default Main