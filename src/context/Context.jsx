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

    const processResponse = (response) => {
        const paragraphs = response.split(/\n\s*\n/);
        const formattedParagraphs = paragraphs.map(paragraph => {
            let formatted = paragraph.trim();
     
            if (formatted.startsWith("##")) {
                const titleText = formatted.substring(2).trim();
                return `<h2>${titleText}</h2><br/>`;
            } else {
                formatted = formatted.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
                formatted = formatted.replace(/\*(.*?)\*/g, "<i>$1</i>");
                formatted = formatted.replace(/\n/g, "<br/>");
                formatted = formatted.replace(/\*/g, "&#x2022;");
                formatted = formatted.replace(/\n\s*\d+\.\s*(.+)/g, "<ol><li>$1</li></ol>");
                formatted = formatted.replace(/<\/ul>\s*<ul>/g, "");
                formatted = formatted.replace(/<\/ol>\s*<ol>/g, "");
                formatted = formatted.replace(/```(.*?)```/gs, "<pre><code>$1</code></pre>");
                return `<p>${formatted}</p><br/>`;
            }
        });
        return formattedParagraphs.join("");
    };

    const onSent = async (prompt) => {
        setResultData(""); // Clear previous result
        setDisplayedText(""); // Clear displayed text
        setLoading(true);
        setShowResult(true);

        const currentPrompt = prompt || input;
        setPrevPrompts(prev => [...prev, currentPrompt]);
        setRecentPrompt(currentPrompt);

        try {
            const response = await runChat(currentPrompt);
            const formattedResponse = processResponse(response);
            setResultData(formattedResponse);
            
            // Start word-by-word reveal
            revealTextGradually(formattedResponse);
        } catch (error) {
            console.error("Error fetching response:", error);
            setDisplayedText("<p>Error fetching response. Please try again.</p>");
        } finally {
            setLoading(false);
            setInput("");
        }
    };

const revealTextGradually = (fullText) => {
    const words = fullText.match(/\S+\s*/g) || [];
    let currentIndex = 0;

    const revealNextWord = () => {
        if (currentIndex < words.length) {
            setDisplayedText(prev => prev + words[currentIndex]);
            currentIndex++;
            
            // Reduced delay to speed up text reveal (25-50ms per word)
            setTimeout(revealNextWord, Math.random() * 25 + 25);
        }
    };

    revealNextWord();
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
        displayedText, // New prop for gradually revealed text
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