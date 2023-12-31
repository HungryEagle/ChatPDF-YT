import ChatComponent from '@/components/ChatComponent'
import ChatSideBar from '@/components/ChatSideBar'
import { db } from '@/lib/db'
import { chats } from '@/lib/db/schema'
import { auth, redirectToSignIn } from '@clerk/nextjs'
import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import React from 'react'

type Props = {
    params: {
        chatId: string
    }
}

const ChatPage = async ({ params: { chatId } }: Props) => {
    const { userId } = await auth()
    if (!userId) {
        return redirect('/sign-in')
    }
    const _chats = await db.select().from(chats).where(eq(chats.userId, userId))
    if (!_chats) {
        return redirect('/')
    }
    if (!_chats.find((chat) => chat.id === parseInt(chatId))) {

    }
    return (
        <div className='flex max-h-screen overflow-y-scroll'>
            <div className="flex w-full max-h-screen overflow-y-scroll">
                <div className='flex-[1] max-w-xs'>
                    <ChatSideBar chats={_chats} chatId={parseInt(chatId)} />
                </div>
                <div className='flex-[3] border-l-4 border-l-slate-200'>
                    <ChatComponent />
                </div>
            </div>
        </div>
    )
}

export default ChatPage