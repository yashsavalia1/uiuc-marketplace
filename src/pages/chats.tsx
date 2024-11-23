import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { formatDate } from "@/lib/utils"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { getImageURL, usePocketBase } from "@/lib/pb"
import { AuthModel } from "pocketbase"
import { Message } from "@/types/Message"
import Navbar from "@/components/Navbar"
import { Separator } from "@/components/ui/separator"
import { LoadingSpinner } from "@/components/ui/spinner"



export default function ChatPage() {
  const pb = usePocketBase();

  const [loading, setLoading] = useState(false)
  const [currUser, setCurrUser] = useState(null)

  const [users, setUsers] = useState<AuthModel[]>([])
  const [messagesByUser, setMessagesByUser] = useState(new Map<string, Message[]>())

  const [input, setInput] = useState("")
  const inputLength = input.trim().length
  const [sending, setSending] = useState(false)

  const messageDivRef = useRef<HTMLDivElement>(null)


  useEffect(() => {
    (async () => {
      setLoading(true)
      const messagesResult = await pb.collection<Message>('messages').getList(1, 500, {
        filter: `sender = "${pb.authStore.model?.id}" || receiver = "${pb.authStore.model?.id}"`,
        expand: 'sender,receiver',
        sort: 'created',
        order: 'desc',
      });

      const uniqueIds = new Set();
      const users: AuthModel[] = []

      messagesResult.items.forEach(chat => {
        const otherUser = chat.sender !== pb.authStore.model?.id ? chat.sender : chat.receiver;
        const expandedUser = chat.sender !== pb.authStore.model?.id ? chat.expand?.sender : chat.expand?.receiver;

        if (!uniqueIds.has(otherUser)) {
          uniqueIds.add(otherUser);
          users.push(expandedUser);
          messagesByUser.set(otherUser, [chat]);
        } else {
          messagesByUser.set(otherUser, [...(messagesByUser.get(otherUser) || []), chat]);
        }
      });

      setUsers(users)
      setMessagesByUser(messagesByUser)
      setLoading(false)
    })();
  }, []);

  useEffect(() => {
    pb.collection<Message>('messages').subscribe('*', ({ action, record }) => {
      if (action === 'create') {
        const otherUser = record.sender !== pb.authStore.model?.id ? record.sender : record.receiver;
        setMessagesByUser((prev) => {
          const messages = prev.get(otherUser) || [];
          return new Map(prev.set(otherUser, [...messages, record]));
        });

        if (!users.find(u => u?.id === otherUser)) {
          pb.collection<AuthModel>('users').getOne(otherUser).then(user => {
            setUsers([...users, user]);
          });
        }
      }
    });

    return () => {
      pb.collection<Message>('messages').unsubscribe();
    }
  }, []);

  useEffect(() => {
    messageDivRef.current?.scrollIntoView({
      behavior: "smooth",
    })
  }, [messagesByUser]);

  const sendMessage = async (event: React.FormEvent) => {
    event.preventDefault()
    if (inputLength === 0) return

    setSending(true)

    await pb.collection<Message>('messages').create({
      sender: pb.authStore.model?.id,
      receiver: currUser,
      message: input,
    })

    setInput("")
    setSending(false)
  }

  return (
    <div className="h-screen">
      <Navbar />
      <div className="container mx-auto pt-4 flex flex-col h-[calc(100vh-6rem)]">
        <h1 className="text-2xl font-bold mb-4">My Chats</h1>
        <div className="flex flex-grow overflow-hidden">
          <Card className="w-1/3 mr-4 overflow-hidden">
            <CardHeader>
              <CardTitle>Conversations</CardTitle>
            </CardHeader>
            {loading && <LoadingSpinner className="h-8 w-8 mx-auto mt-4" />}
            <ScrollArea className="h-[calc(100vh-18.5rem)]">
              <CardContent className="px-4">
                {users.map((user) => (
                  <div
                    key={user?.id}
                    className={`flex items-center p-3 cursor-pointer transition-colors hover:bg-slate-100 rounded-lg mb-2 ${currUser === user?.id ? 'bg-slate-100' : ''}`}
                    onClick={() => setCurrUser(user?.id)}
                  >
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={getImageURL(user, user?.avatar, "thumb=100x100")} />
                      <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-grow">
                      <div className="flex justify-between items-baseline">
                        <h3 className="font-semibold">{user?.name}</h3>
                        <span className="text-xs text-gray-500">{formatDate(messagesByUser.get(user?.id)?.at(-1)?.created || '')}</span>
                      </div>
                      <p className="text-sm text-gray-500 truncate w-2/4">{messagesByUser.get(user?.id)?.at(-1)?.message}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </ScrollArea>
          </Card>
          <Card className="flex-grow overflow-hidden">
            {currUser ? (
              <>
                <CardHeader className="py-3">
                  <CardTitle className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={getImageURL(users.filter(u => u?.id === currUser)[0], users.filter(u => u?.id === currUser)[0]?.avatar, "thumb=100x100")} />
                      <AvatarFallback>{users.filter(u => u?.id === currUser)[0]?.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {users.filter(u => u?.id === currUser)[0]?.name}
                  </CardTitle>
                </CardHeader>
                <Separator />
                <ScrollArea className="h-[calc(100vh-18.5rem)]">
                  <CardContent>
                    {messagesByUser.get(currUser)?.map((msg, index) => (
                      <div
                        key={msg.id}
                        ref={index === (messagesByUser.get(currUser)?.length || 0) - 1 ? messageDivRef : null}
                        className={`mt-4 ${msg.sender === pb.authStore.model?.id ? 'text-right' : 'text-left'
                          }`}
                      >
                        <div
                          className={`inline-block px-3 py-2 rounded-lg 
                            ${msg.sender === pb.authStore.model?.id ?
                              'bg-slate-900 text-white' : 'bg-gray-100 text-gray-800'
                            }`}
                        >
                          {msg.message}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {formatDate(msg.created)}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </ScrollArea>
                <div className="p-4 border-t">
                  <form className="flex" onSubmit={sendMessage}>
                    <Input
                      placeholder="Type a message..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                    />
                    <Button type="submit" size="icon" disabled={inputLength === 0 || sending} className="ml-2">
                      {sending
                        ? <LoadingSpinner className="h-4 w-4" />
                        : <>
                          <Send className="h-4 w-4" />
                          <span className="sr-only">Send</span>
                        </>

                      }
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              <CardContent className="h-full flex items-center justify-center">
                <p className="text-muted-foreground">Select a chat to view messages</p>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}