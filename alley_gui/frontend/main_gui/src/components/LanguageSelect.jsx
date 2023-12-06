import axios from "axios";
import React, { useState, useEffect, useLayoutEffect } from "react";
import { useLoaderData } from "react-router-dom";

/**
 * @description This is the component that translates all the text on the page to the desired language.
 * @component LanguageSelect
 * @returns language translation
 */
function LanguageSelect() {
    const [language, setLang] = useState("en");
    const [prevLang, setPrevLang] = useState("en");

    /**
     * @function translate_all
     * @description translates all the text on the page to the desired language
     * @returns translation
     */
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
                const nonTextNodes = [...ele.childNodes]
                .filter(child => child.nodeType != Node.TEXT_NODE)

                let result = await translate(textNodes[0], prevLang, language);
                ele.textContent = result;

                nonTextNodes.forEach(child => {
                    ele.prepend(child);
                });
            }
        });
    }
    
    /**
     * @function translate
     * @description queries the translate API
     * @param {*} query
     * @param {*} source
     * @param {*} target
     */
    async function translate(query, source, target) {
        const res = await axios.get("https://thealley.onrender.com/translate", {params: { text: query, target: target}});
        const jsonVals = await res.data;
        return jsonVals.data;
    }

    /**
     * @function currLang
     * @description gets the current language of the website
     */
    useEffect(() => {
        const currLang = JSON.parse(sessionStorage.getItem('language'));
        if (currLang) {
            setLang(currLang);
        } else {
            sessionStorage.setItem("language", JSON.stringify(language));
            sessionStorage.setItem("prevLang", JSON.stringify(prevLang));
        } 
    }, []);

    /**
     * @function dom_observer
     * @description checks if html elements are added to the page after translation
     */
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
                        ele.normalize();
                        const textNodes = [...ele.childNodes]
                        .filter(child => child.nodeType === Node.TEXT_NODE) // get only text nodes
                        .filter(child => child.textContent.trim()) // eliminate empty text
                        .map(textNode => textNode.textContent) // extract text content
            
                        if (textNodes.length != 0) {
                            const nonTextNodes = [...ele.childNodes]
                            .filter(child => child.nodeType != Node.TEXT_NODE)

                            let result = await translate(textNodes[0], pLang, currLang);
                            ele.textContent = result;

                            nonTextNodes.forEach(child => {
                                ele.prepend(child);
                            });
                        }

                        let allChildElements = ele.querySelectorAll("*");

                        if (allChildElements.length > 0) {
                            allChildElements.forEach(async (childele) => {
                                childele.normalize();
                                const textNodes = [...childele.childNodes] // has childNodes inside, including text ones
                                .filter(child => child.nodeType === Node.TEXT_NODE) // get only text nodes
                                .filter(child => child.textContent.trim()) // eliminate empty text
                                .map(textNode => textNode.textContent) // extract text content
                        
                                if (textNodes.length != 0) {
                                    const nonTextNodes = [...childele.childNodes]
                                    .filter(child => child.nodeType != Node.TEXT_NODE)

                                    let result = await translate(textNodes[0], pLang, currLang);
                                    childele.textContent = result;

                                    nonTextNodes.forEach(child => {
                                        childele.prepend(child);
                                    });
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
    }, [language]);

    /**
     * gets the user's selected language
     * @param {*} event 
     */
    const selectLang = (event) => {
        setPrevLang(language);
        let newLang = event.target.value;
        setLang(newLang);
        sessionStorage.setItem("language", JSON.stringify(newLang));
        sessionStorage.setItem("prevLang", JSON.stringify(prevLang));
    };

    const [options, setOptions] = useState([]);
  
    /**
     * @function fetchLanguages
     * @description gets the translations of the user's desired language 
     */
    useEffect(() => {
      async function fetchData() {
        // Fetch data
        const { data } = await axios.get("https://thealley.onrender.com/languages");
        const results = []
        // Store results in the results array
        data.data.forEach((value) => {
          results.push({
            key: value.name,
            value: value.code,
          });
        });
        const unique = [...new Map(results.map(item => [item.key, item])).values()];
        // Update the options state
        setOptions([
          ...unique
        ]);
      }
  
      // Trigger the fetch
      fetchData();
    }, []);

    return (
        <div>
            <select class="langSelect" value={language} onChange={selectLang}>
                {options.map((option) => (
                <option class="languageOption" key={option.key} value={option.value}>{option.key}</option>
                ))}  
            </select>    
        </div>
    )
}

export default LanguageSelect;