//  this is the handle click bar function where the prompt of the user send will go directly to gemini backend and comes with a json object which will then comes to my server , i will stores that in my useState function and put render on the a container

"use client"

import 'config/dotenv';
import axios from "axios"
import { GetSystemPrompt } from './SystemPrompt';

import { useState, useEffect } from "react";
import { userAgent } from 'next/server';

const API_KEY = process.env.API_KEY;
const GEMINI_API_URL = process.env.GEMINI_API_URL;
const SystemPrompt = GetSystemPrompt();


export async const HandleInputComponent = (e: React.FormEvent) => {
    const [ isData, setisData ] = useState(" ");
    const [ inputData, setInputData  ] = useState(" ")

    const userQuery = inputData;

    try {
        const response = await axios.get(GEMINI_API_URL, {
            method: 'POST',
            headers: {
                "content-type": "application/json"
            },
            body:JSON.stringify({
                contents: [
                    { role: "system", parts: [{ text: SystemPrompt}]},
                    { role: "user", parts: [{ text: userQuery}]}
                ]
            })
        })
    
        const data = await response.json();
        console.log("Gemini Response", data)

        s
    } catch (error) {
                
    }


}