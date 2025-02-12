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

    const processText = (text) => {
        if (!text) return '';
    
        // Split into lines first to handle bullet points
        const lines = text.split('\n');
        let processed = lines.map(line => {
            // Handle bullet points first
            const leadingSpaces = line.match(/^\s*/)[0].length;
            let processedLine = line;
            
            // Convert double asterisks to bold tags
            processedLine = processedLine.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            
            // Convert single asterisks to italics (but not the bullet point asterisks)
            processedLine = processedLine.replace(/(?<!^)\*(.*?)\*/g, '<i>$1</i>');
            
            // Check if the line is only a bold title (starts and ends with ** after trimming)
            const isTitle = line.trim().startsWith('**') && line.trim().endsWith('**');
            
            // Handle bullet points only if it's not a title
            if (line.trim().startsWith('*') && !isTitle) {
                const withoutAsterisk = processedLine.replace(/^\s*\*\s/, '');
                const indent = Math.floor(leadingSpaces / 2) * 20;
                return `<div style="margin-left: ${indent}px">• ${withoutAsterisk}</div>`;
            }
            return processedLine;
        }).join('\n');
    
        return processed;
    };
    
    const revealTextGradually = (text) => {
        if (!text) return;
        
        // Process the text first
        const processedText = processText(text);
        
        // Split into chunks while preserving HTML tags
        const chunks = processedText.match(/(<[^>]+>)|([^<]+)/g) || [];
        let currentIndex = 0;
        let accumulated = '';
        
        const revealNextChunk = () => {
            if (currentIndex < chunks.length) {
                accumulated += chunks[currentIndex];
                setDisplayedText(accumulated);
                currentIndex++;
                setScrollTrigger(prev => prev + 1);
                // Slightly faster animation for better readability
                setTimeout(revealNextChunk, Math.random() * 15 + 70);
            }
        };
        
        revealNextChunk();
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