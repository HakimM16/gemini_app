import { createContext, useState } from "react";
import runChat from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {
    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [prevPrompts, setPrevPrompts] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("");


    const processResponse = (response) => {
        const paragraphs = response.split(/\n\s*\n/);
        const formattedParagraphs = paragraphs.map(paragraph => {
            let formatted = paragraph.trim();
     
            // Check if it's a title (if you have titles)
            if (formatted.startsWith("##")) {
                const titleText = formatted.substring(2).trim();
                return `<h2>${titleText}</h2><br/>`;
            } else { // It's a regular paragraph
                formatted = formatted.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
                formatted = formatted.replace(/\*(.*?)\*/g, "<i>$1</i>");
                formatted = formatted.replace(/\n/g, "<br/>");
     
                // Replace the first * of each line, including indented lines, with $
                formatted = formatted.replace(/\*/g, "&#x2022;");
                formatted = formatted.replace(/\n\s*\d+\.\s*(.+)/g, "<ol><li>$1</li></ol>"); // Ordered list items
     
                formatted = formatted.replace(/<\/ul>\s*<ul>/g, "");
                formatted = formatted.replace(/<\/ol>\s*<ol>/g, "");
                formatted = formatted.replace(/```(.*?)```/gs, "<pre><code>$1</code></pre>");
                return `<p>${formatted}</p><br/>`;
            }
        });
        return formattedParagraphs.join(""); // Space is already added in individual elements
     };

    const onSent = async (prompt) => {
        setResultData(""); // Clear previous result
        setLoading(true);
        setShowResult(true);

        const currentPrompt = prompt || input;
        setPrevPrompts(prev => [...prev, currentPrompt]);
        setRecentPrompt(currentPrompt);

        try {
            const response = await runChat(currentPrompt);
            const formattedResponse = processResponse(response);
            setResultData(formattedResponse); // Set the full HTML content at once
        } catch (error) {
            console.error("Error fetching response:", error);
            setResultData("<p>Error fetching response. Please try again.</p>");
        } finally {
            setLoading(false);
            setInput("");
        }
    };

    const newChat = () => {
        setLoading(false);
        setShowResult(false);
        setResultData("");
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