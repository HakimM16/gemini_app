import { createContext, useState, useEffect } from "react";
import runChat from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {
    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [prevPrompts, setPrevPrompts] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("");
    const [displayedText, setDisplayedText] = useState("");
    const [scrollTrigger, setScrollTrigger] = useState(0);

    const revealTextGradually = (text) => {
        if (!text) return;
        
        // Split text into words but preserve punctuation and spacing
        const words = text.match(/[\w\d]+|\s+|[^\w\s]/g) || [];
        let currentIndex = 0;
        let accumulated = '';
        
        const revealNextWord = () => {
            if (currentIndex < words.length) {
                accumulated += words[currentIndex];
                setDisplayedText(accumulated);
                currentIndex++;
                setScrollTrigger(prev => prev + 1);
                setTimeout(revealNextWord, Math.random() * 25 + 25);
            }
        };
        
        revealNextWord();
    };

    const onSent = async (prompt) => {
        setResultData("");
        setDisplayedText("");
        setLoading(true);
        setShowResult(true);

        const currentPrompt = prompt || input;
        setPrevPrompts(prev => [...prev, currentPrompt]);
        setRecentPrompt(currentPrompt);

        try {
            const response = await runChat(currentPrompt);
            
            if (!response) {
                throw new Error("No response received");
            }

            // Clean up the response text
            const cleanResponse = response.trim();
            setResultData(cleanResponse);
            revealTextGradually(cleanResponse);

        } catch (error) {
            console.error("Error fetching response:", error);
            setDisplayedText("I encountered an error. Please try again.");
        } finally {
            setLoading(false);
            setInput("");
        }
    };

    const newChat = () => {
        setLoading(false);
        setShowResult(false);
        setResultData("");
        setDisplayedText("");
    };

    const contextValue = {
        prevPrompts,
        setPrevPrompts,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        displayedText,
        scrollTrigger,
        input,
        setInput,
        newChat
    };

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    );
};

export default ContextProvider;