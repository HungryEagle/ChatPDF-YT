'use client';
import React, { useState } from 'react'
import { Input } from './ui/input'
import { useChat } from 'ai/react'
import { Button } from './ui/button'
import { Send } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'
import MessageList from './MessageList';

type Props = {}
interface Message {
    id: string,
    content: string;
    role: string;
}
const ChatComponent = (props: Props) => {
    const [userInput, setUserInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUserInput(event.target.value);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setMessages([...messages, { id: uuidv4(), content: userInput, role: 'user' }]);

        setUserInput("")

        // Send a POST request to your API endpoint
        const response = await fetch('<some url>/bot/prompt', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt: userInput }),
        });

        // Check for a valid response
        if (response.ok) {
            const data = await response.json();
            const botAnswer = data.botAnswer;
            setMessages([...messages, { id: uuidv4(), content: botAnswer, role: 'assistant' }]);
        } else {
            console.error('Failed to send message:', response.statusText);
        }
    };

    return (
        <div className='relative max-h-screen overflow-y-scroll'>
            <div className='sticky top-0 inset-x-0 p-2 bg-white h-fit'>
                <h3 className='text-xl font-bold'>Chat</h3>
            </div>
            <MessageList messages={messages} />
            <form onSubmit={handleSubmit} className='sticky bottom-0 inset-x-0 px-2 py-4 bg-white'>
                <div className='flex'>

                    <Input value={userInput} onChange={handleInputChange} placeholder='Ask any question' className='w-full' />

                    <Button className='bg-blue-600 ml-2'>
                        <Send className='h-4 w-4' />
                    </Button>
                </div>

            </form>
        </div>
    )
}

export default ChatComponent