import axios from "axios";
import React, { useState, useEffect, useLayoutEffect } from "react";
import { useLoaderData } from "react-router-dom";

function LanguageSelect() {
    const [language, setLang] = useState("en");
    const [prevLang, setPrevLang] = useState("en");

    async function translate_all() {
        if (prevLang == language) {
            return;
        }
        
        const allElements = document.querySelectorAll(":not(style):not(.languageOption)");
    
        allElements.forEach(async (ele) => {
            ele.normalize();
            const textNodes = [...ele.childNodes] // has childNodes inside, including text ones
            .filter(child => child.nodeType === Node.TEXT_NODE) // get only text nodes
            .filter(child => child.textContent.trim()) // eliminate empty text
            .map(textNode => textNode.textContent) // extract text content
    
            if (textNodes.length != 0) {
                let result = await translate(textNodes[0].toLowerCase(), prevLang, language);
                ele.textContent = result.translatedText;
            }
        });
    }
    
    async function translate(query, source, target) {
        const res = await fetch("http://localhost:5000/translate", {
        method: "POST",
        body: JSON.stringify({
            q: query,
            source: source,
            target: target,
            format: "text",
            api_key: ""
        }),
            headers: { "Content-Type": "application/json" }
        });

        return await res.json();
    }

    useEffect(() => {
        const currLang = JSON.parse(sessionStorage.getItem('language'));
        if (currLang) {
            setLang(currLang);
        } else {
            sessionStorage.setItem("language", JSON.stringify(language));
            sessionStorage.setItem("prevLang", JSON.stringify(prevLang));
        } 
    }, []);

    useEffect(() => {
        var dom_observer = new MutationObserver(function(mutation) {
            const currLang = JSON.parse(sessionStorage.getItem('language'));
            const pLang = JSON.parse(sessionStorage.getItem('prevLang'));
            if (currLang == pLang) {
                return;
            } 
            mutation.forEach(async m => {
                m.addedNodes.forEach(async ele => {
                    if (ele.nodeType === Node.ELEMENT_NODE && !(ele instanceof HTMLStyleElement || ele instanceof HTMLTitleElement || ele.classList.contains("languageOption"))) {
                        let allChildElements = ele.querySelectorAll("*");
                
                        if (allChildElements.length == 0) {
                            ele.normalize();
                            const textNodes = [...ele.childNodes]
                            .filter(child => child.nodeType === Node.TEXT_NODE) // get only text nodes
                            .filter(child => child.textContent.trim()) // eliminate empty text
                            .map(textNode => textNode.textContent) // extract text content
                
                            if (textNodes.length != 0) {
                                let result = await translate(textNodes[0].toLowerCase(), pLang, currLang);
                                ele.textContent = result.translatedText;
                            }
                        } else {
                            allChildElements.forEach(async (childele) => {
                                childele.normalize();
                                const textNodes = [...childele.childNodes] // has childNodes inside, including text ones
                                .filter(child => child.nodeType === Node.TEXT_NODE) // get only text nodes
                                .filter(child => child.textContent.trim()) // eliminate empty text
                                .map(textNode => textNode.textContent) // extract text content
                        
                                if (textNodes.length != 0) {
                                    let result = await translate(textNodes[0].toLowerCase(), pLang, currLang);
                                    childele.textContent = result.translatedText;
                                }
                            });
                        }
                    }
                });
            });
        });
        var config = { characterData: true, childList: true, subtree: true };
        dom_observer.observe(document.body, config);
    }, []);

    useEffect(() => {
        translate_all();
    }, [language, translate_all]);

    const selectLang = (event) => {
        setPrevLang(language);
        let newLang = event.target.value;
        setLang(newLang);
        sessionStorage.setItem("language", JSON.stringify(newLang));
        sessionStorage.setItem("prevLang", JSON.stringify(prevLang));
    };

    const [options, setOptions] = useState([]);
  
    useEffect(() => {
      async function fetchData() {
        // Fetch data
        const { data } = await axios.get("http://localhost:5000/languages");
        const results = []
        // Store results in the results array
        data.forEach((value) => {
          results.push({
            key: value.name,
            value: value.code,
          });
        });
        // Update the options state
        setOptions([
          ...results
        ]);
      }
  
      // Trigger the fetch
      fetchData();
    }, []);

    return (
        <div>
            <select value={language} onChange={selectLang}>
                {options.map((option) => (
                <option class="languageOption" key={option.key} value={option.value}>{option.key}</option>
                ))}  
            </select>    
        </div>
    )
}

export default LanguageSelect;