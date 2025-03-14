"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { formatDistanceToNow } from "date-fns"
import { Loader2, MessageSquare, Send } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { getConversations, getMessages, sendMessage } from "../actions"

export default function MessagesPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [conversations, setConversations] = useState<any[]>([])
  const [selectedConversation, setSelectedConversation] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isSending, setIsSending] = useState(false)

  // Get Supabase client
  const supabase = createClient()

  // Get user session and conversations on component mount
  useEffect(() => {
    async function initialize() {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        toast({
          title: "Authentication required",
          description: "You must be logged in to view messages",
          variant: "destructive",
        })
        router.push("/login?redirect=/marketplace/messages")
        return
      }

      setUser(session.user)

      try {
        const { conversations: convos, error } = await getConversations()

        if (error) {
          toast({
            title: "Failed to load conversations",
            description: error,
            variant: "destructive",
          })
        } else {
          setConversations(convos || [])
        }
      } catch (err) {
        console.error("Error loading conversations:", err)
      } finally {
        setIsLoading(false)
      }
    }

    initialize()

    // Set up real-time subscription for new messages
    const channel = supabase
      .channel("marketplace_messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "marketplace_messages",
        },
        async (payload) => {
          // Refresh conversations
          const { conversations: convos } = await getConversations()
          setConversations(convos || [])

          // If this message is part of the current conversation, add it
          if (
            selectedConversation &&
            payload.new.item_id === selectedConversation.item_id &&
            ((payload.new.sender_id === user.id && payload.new.receiver_id === selectedConversation.other_user_id) ||
              (payload.new.sender_id === selectedConversation.other_user_id && payload.new.receiver_id === user.id))
          ) {
            // Get sender info
            const { data: senderData } = await supabase
              .from("profiles")
              .select("username, avatar_url")
              .eq("id", payload.new.sender_id)
              .single()

            setMessages((prev) => [
              ...prev,
              {
                ...payload.new,
                sender: {
                  username: senderData?.username,
                  avatar_url: senderData?.avatar_url,
                },
              },
            ])
          }
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  // Load messages when a conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      async function loadMessages() {
        try {
          const { messages: msgs, error } = await getMessages(
            selectedConversation.item_id,
            selectedConversation.other_user_id,
          )

          if (error) {
            toast({
              title: "Failed to load messages",
              description: error,
              variant: "destructive",
            })
          } else {
            setMessages(msgs || [])
          }
        } catch (err) {
          console.error("Error loading messages:", err)
        }
      }

      loadMessages()
    }
  }, [selectedConversation])

  // Handle sending a message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newMessage.trim() || !selectedConversation) return

    setIsSending(true)

    const formData = new FormData()
    formData.append("item_id", selectedConversation.item_id)
    formData.append("receiver_id", selectedConversation.other_user_id)
    formData.append("message", newMessage)

    const { success, error } = await sendMessage(formData)

    setIsSending(false)

    if (success) {
      setNewMessage("")
    } else {
      toast({
        title: "Failed to send message",
        description: error || "An error occurred. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="container py-8 px-4 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto" />
        <p className="mt-2">Loading your messages...</p>
      </div>
    )
  }

  return (
    <div className="container py-8 px-4">
      <h1 className="text-3xl font-bold tracking-tight text-black dark:text-white mb-6">Messages</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Conversations List */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Conversations</CardTitle>
            </CardHeader>
            <CardContent>
              {conversations.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 dark:text-gray-400">No conversations yet</p>
                  <Button
                    className="mt-4 bg-[#B65FCF] hover:bg-[#B65FCF]/80 text-white"
                    onClick={() => router.push("/marketplace")}
                  >
                    Browse Marketplace
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {conversations.map((convo) => (
                    <div
                      key={convo.conversation_id}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedConversation?.conversation_id === convo.conversation_id
                          ? "bg-[#B65FCF]/10"
                          : "hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                      onClick={() => setSelectedConversation(convo)}
                    >
                      <Avatar className="h-10 w-10 border border-gray-200 dark:border-gray-800">
                        <AvatarImage src={convo.other_avatar_url || undefined} alt={convo.other_username} />
                        <AvatarFallback>{convo.other_username.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium truncate">{convo.other_username}</p>
                          {convo.unread_count > 0 && (
                            <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#B65FCF] text-xs text-white">
                              {convo.unread_count}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{convo.item_title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDistanceToNow(new Date(convo.last_message_time), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Message Thread */}
        <div className="md:col-span-2">
          <Card className="h-full flex flex-col">
            {selectedConversation ? (
              <>
                <CardHeader className="border-b">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border border-gray-200 dark:border-gray-800">
                      <AvatarImage
                        src={selectedConversation.other_avatar_url || undefined}
                        alt={selectedConversation.other_username}
                      />
                      <AvatarFallback>{selectedConversation.other_username.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>{selectedConversation.other_username}</CardTitle>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{selectedConversation.item_title}</p>
                    </div>
                  </div>
                </CardHeader>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500 dark:text-gray-400">No messages yet</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Send a message to start the conversation
                      </p>
                    </div>
                  ) : (
                    messages.map((msg) => {
                      const isCurrentUser = msg.sender_id === user.id

                      return (
                        <div key={msg.id} className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
                          <div className={`flex max-w-[80%] ${isCurrentUser ? "flex-row-reverse" : "flex-row"}`}>
                            {!isCurrentUser && (
                              <Avatar className="h-8 w-8 mr-2 mt-1 border border-gray-200 dark:border-gray-800">
                                <AvatarImage src={msg.sender?.avatar_url || undefined} alt={msg.sender?.username} />
                                <AvatarFallback>{msg.sender?.username.charAt(0).toUpperCase()}</AvatarFallback>
                              </Avatar>
                            )}
                            <div>
                              <div
                                className={`rounded-lg px-4 py-2 ${
                                  isCurrentUser
                                    ? "bg-[#B65FCF] text-white"
                                    : "bg-gray-100 dark:bg-gray-800 text-black dark:text-white"
                                }`}
                              >
                                <p>{msg.message}</p>
                              </div>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true })}
                              </p>
                            </div>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
                <div className="border-t p-4">
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <Input
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      disabled={isSending}
                    />
                    <Button
                      type="submit"
                      size="icon"
                      className="bg-[#B65FCF] hover:bg-[#B65FCF]/80 text-white"
                      disabled={!newMessage.trim() || isSending}
                    >
                      {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center p-8">
                <div className="text-center">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 dark:text-gray-400">Select a conversation to view messages</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}

