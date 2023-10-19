'use client';
import React, { useState } from 'react'
import { Input } from './ui/input'
import { useChat } from 'ai/react'
import { Button } from './ui/button'
import { Send } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'
import MessageList from './MessageList';

type Props = {}
interface BackendResponse {
    botAnswer: string,
}
interface ChatOptions {
    api: string;
    headers: Record<string, string>;
    body: { prompt: string };
    onResponse: (res: BackendResponse) => void;
}
const useMyChat = (options: ChatOptions) => {
    const chat = useChat({
        ...options,
        onResponse: (response) => {
            const res = response as unknown as BackendResponse;
            options.onResponse(res);
        },
    });
    return chat;
};
const ChatComponent = (props: Props) => {
    const [userInput, setUserInput] = useState('');
    const { input, handleSubmit, messages } = useMyChat({
        api: '<some url>/bot/prompt',  // Set the API endpoint
        headers: {
            'Content-Type': 'application/json',
        },
        body: {
            prompt: userInput,  // Include the user's input in the request body
        },
        onResponse: (res: BackendResponse) => {
            // Customize the response handling to extract the bot's answer
            const botAnswer = res.botAnswer;
            // Update the messages array with the bot's answer
            messages.push({ id: uuidv4(), content: botAnswer, role: 'assistant' });
        },
    })
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUserInput(event.target.value);
    }
    return (
        <div className='relative max-h-screen overflow-y-scroll'>
            <div className='sticky top-0 inset-x-0 p-2 bg-white h-fit'>
                <h3 className='text-xl font-bold'>Chat</h3>
            </div>
            <MessageList messages={messages} />
            <form onSubmit={handleSubmit} className='sticky bottom-0 inset-x-0 px-2 py-4 bg-white'>
                <div className='flex'>

                    <Input value={input} onChange={handleInputChange} placeholder='Ask any question' className='w-full' />

                    <Button className='bg-blue-600 ml-2'>
                        <Send className='h-4 w-4' />
                    </Button>
                </div>

            </form>
        </div>
    )
}

export default ChatComponent