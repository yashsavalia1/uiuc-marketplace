import { Send } from "lucide-react"
import { cn, formatDate } from "@/lib/utils"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"

import { Separator } from "./ui/separator"
import { getImageURL, usePocketBase } from "@/lib/pb"
import { useEffect, useRef, useState } from "react"
import { AuthModel } from "pocketbase"
import { Message } from "@/types/Message"
import { LoadingSpinner } from "./ui/spinner"
import { LuX } from "react-icons/lu"
import { ScrollArea } from "./ui/scroll-area"

export function Chat({ lister, show = true, setShow }: { lister: AuthModel, show?: boolean, setShow: (show: boolean) => void }) {
  if (!lister) return null

  const pb = usePocketBase();

  const messageDivRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([])
  const [sending, setSending] = useState(false)

  useEffect(() => {
    (async () => {
      if (!lister.id) return;

      const messagesResult = await pb.collection<Message>('messages').getList(1, 50, {
        filter: `sender="${lister.id}" && receiver="${pb.authStore.model?.id}" 
        || sender="${pb.authStore.model?.id}" && receiver="${lister.id}"`,
        sort: 'created',
        order: 'desc',
      });
      setMessages(messagesResult.items);
    })();
  }, [lister.id]);

  useEffect(() => {
    pb.collection<Message>('messages').subscribe('*', ({ action, record }) => {
      if (action === 'create') {
        setMessages((prev) => [...prev, record]);
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
  }, [messages]);


  const sendMessage = async (event: React.FormEvent) => {
    event.preventDefault()
    if (inputLength === 0) return

    setSending(true)

    await pb.collection<Message>('messages').create({
      sender: pb.authStore.model?.id,
      receiver: lister.id,
      message: input,
    })

    setInput("")
    setSending(false)
  }


  const [input, setInput] = useState("")
  const inputLength = input.trim().length

  return (
    <Card className={`fixed right-2 transition-all ${show ? "bottom-2" : "-bottom-full"}`}>
      <CardHeader className="flex flex-row items-center justify-between py-3">
        <div className="flex items-center gap-2">
          <Avatar className="w-9 h-9 border-2 border-black">
            <AvatarImage src={getImageURL(lister, lister.avatar, "thumb=100x100")} />
            <AvatarFallback>{lister.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="font-semibold">{lister.name}</span>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setShow(false)}>
          <span className="sr-only">Close</span>
          <LuX className="h-4 w-4" />
        </Button>
      </CardHeader>
      <Separator />
      <CardContent className="overflow-y-auto px-0 pb-3">
        <ScrollArea className="h-96 w-80 px-6">
          {messages.map((message, index) => (
            <div className="my-2 space-y-1" key={index} ref={index === messages.length - 1 ? messageDivRef : null}>
              <div
                key={index}
                className={cn(
                  "flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm break-words",
                  message.sender === pb.authStore.model?.id
                    ? "ml-auto bg-slate-900 text-white"
                    : "bg-gray-100 text-gray-800"
                )}
              >
                {message.message}
              </div>
              {/* index == messages.length - 1 &&  */<div className={cn("text-xs text-gray-500",
                message.sender === pb.authStore.model?.id
                  ? "text-right"
                  : "text-left"
              )}>
                {formatDate(message.created)}
              </div>}
            </div>
          ))}
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <form
          onSubmit={sendMessage}
          className="flex w-full items-center space-x-2"
        >
          <Input
            id="message"
            placeholder="Type your message..."
            className="flex-1"
            autoComplete="off"
            value={input}
            onChange={(event) => setInput(event.target.value)}
          />
          <Button type="submit" size="icon" disabled={inputLength === 0 || sending}>
            {sending
              ? <LoadingSpinner className="h-4 w-4" />
              : <>
                <Send className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </>

            }
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}