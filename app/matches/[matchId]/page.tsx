"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import NavBar from "@/app/components/NavBar";
import ProfileCardExpanded from "@/app/components/ProfileCardExpanded";
import UnmatchDialog from "@/app/components/UnmatchDialog";
import { Profile, Message } from "@/lib/types";
import {
  ArrowLeft,
  Send,
  UserX,
  Info,
  AlertTriangle,
} from "lucide-react";

const MAX_MESSAGES = 10;

export default function ChatPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const matchId = params.matchId as string;

  const [otherProfile, setOtherProfile] = useState<Profile | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [myMessageCount, setMyMessageCount] = useState(0);
  const [messageText, setMessageText] = useState("");
  const [sending, setSending] = useState(false);
  const [loadingChat, setLoadingChat] = useState(true);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);

  // Profile modal
  const [showProfile, setShowProfile] = useState(false);

  // Unmatch
  const [showUnmatch, setShowUnmatch] = useState(false);
  const [unmatching, setUnmatching] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const sendingRef = useRef(false);

  const remaining = MAX_MESSAGES - myMessageCount;
  const limitReached = remaining <= 0;

  // Auth redirect
  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
    if (!authLoading && user && !profile) router.push("/login");
  }, [user, profile, authLoading, router]);

  // Fetch messages (skips if a send is in-flight to protect optimistic updates)
  const fetchMessages = useCallback(async () => {
    if (sendingRef.current) return;

    try {
      const res = await fetch(`/api/matches/${matchId}/messages`);
      if (res.status === 404) {
        setNotFound(true);
        return;
      }
      const data = await res.json();
      if (data.messages && !sendingRef.current) {
        setMessages(data.messages);
        setMyMessageCount(data.my_message_count);
      }

      // Set other user's profile from the response
      if (data.profile && !otherProfile) {
        setOtherProfile(data.profile);
      }
    } catch {
      // Silently fail on poll errors
    } finally {
      setLoadingChat(false);
    }
  }, [matchId, user?.id, otherProfile]);

  // Initial fetch + polling
  useEffect(() => {
    if (!user || !profile) return;
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [user, profile, fetchMessages]);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message
  const handleSend = async () => {
    const text = messageText.trim();
    if (!text || sending || limitReached) return;

    setSending(true);
    sendingRef.current = true;
    setError("");

    // Optimistic update
    const tempMsg: Message = {
      id: `temp-${Date.now()}`,
      match_id: matchId,
      sender_id: user!.id,
      content: text,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempMsg]);
    setMyMessageCount((prev) => prev + 1);
    setMessageText("");

    try {
      const res = await fetch(`/api/matches/${matchId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to send");
      }

      const data = await res.json();
      // Replace temp message with real one
      setMessages((prev) =>
        prev.map((m) => (m.id === tempMsg.id ? data.message : m))
      );
    } catch (err) {
      // Revert optimistic update
      setMessages((prev) => prev.filter((m) => m.id !== tempMsg.id));
      setMyMessageCount((prev) => prev - 1);
      setError(err instanceof Error ? err.message : "Failed to send message");
    } finally {
      setSending(false);
      sendingRef.current = false;
      inputRef.current?.focus();
    }
  };

  // Unmatch
  const handleUnmatch = async () => {
    setUnmatching(true);
    try {
      const res = await fetch(`/api/matches/${matchId}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/matches");
      }
    } catch {
      setUnmatching(false);
    }
  };

  // Loading state
  if (authLoading || !user || !profile || loadingChat) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-uw-purple border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Match not found (deleted/unmatched)
  if (notFound) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <AlertTriangle size={40} className="mb-4" />
          <p className="text-lg font-medium">Match not found</p>
          <p className="text-sm mb-4">This match may have been removed</p>
          <button
            onClick={() => router.push("/matches")}
            className="px-6 py-2 bg-uw-purple text-white rounded-lg font-medium hover:bg-uw-purple-dark transition-colors"
          >
            Back to Matches
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[100dvh] flex flex-col bg-gray-50">
      <NavBar />

      {/* Chat header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => router.push("/matches")}
          className="text-gray-500 hover:text-gray-700 -ml-1"
        >
          <ArrowLeft size={20} />
        </button>

        {otherProfile && (
          <button
            onClick={() => setShowProfile(true)}
            className="flex items-center gap-3 flex-1 min-w-0"
          >
            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-uw-purple flex-shrink-0">
              {otherProfile.photo_urls?.length > 0 ? (
                <Image
                  src={otherProfile.photo_urls[0]}
                  alt={otherProfile.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white text-lg">
                  🐺
                </div>
              )}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-gray-900 truncate">
                {otherProfile.name}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {otherProfile.location}
              </p>
            </div>
            <Info size={16} className="text-gray-300 flex-shrink-0" />
          </button>
        )}

        <button
          onClick={() => setShowUnmatch(true)}
          className="text-gray-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-colors flex-shrink-0"
          title="Unmatch"
        >
          <UserX size={18} />
        </button>
      </div>

      {/* Disclaimer banner */}
      <div className="bg-uw-spirit-gold/20 border-b border-uw-spirit-gold/30 px-4 py-2.5 text-center">
        <p className="text-sm text-uw-purple-dark font-medium">
          To keep Roomates free you only have {MAX_MESSAGES} messages per chat.
          Exchange some other contact info ASAP!
        </p>
      </div>

      {/* Message counter */}
      <div className="bg-white border-b border-gray-100 px-4 py-2 text-center">
        <span
          className={`text-2xl font-bold ${
            limitReached
              ? "text-red-500"
              : remaining <= 3
              ? "text-orange-500"
              : "text-uw-purple"
          }`}
        >
          {remaining}/{MAX_MESSAGES}
        </span>
        <span className="text-sm text-gray-500 ml-2">messages remaining</span>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <p className="text-lg font-medium mb-1">
              Say hi to {otherProfile?.name || "your match"}!
            </p>
            <p className="text-sm">
              You have {MAX_MESSAGES} messages. Make them count!
            </p>
          </div>
        )}

        {messages.map((msg) => {
          const isMe = msg.sender_id === user.id;
          return (
            <div
              key={msg.id}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] px-4 py-2.5 rounded-2xl ${
                  isMe
                    ? "bg-uw-purple text-white rounded-br-md"
                    : "bg-white text-gray-900 border border-gray-200 rounded-bl-md"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap break-words">
                  {msg.content}
                </p>
                <p
                  className={`text-[10px] mt-1 ${
                    isMe ? "text-white/60" : "text-gray-400"
                  }`}
                >
                  {new Date(msg.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      {/* Error message */}
      {error && (
        <div className="px-4 py-2 bg-red-50 text-red-600 text-sm text-center">
          {error}
        </div>
      )}

      {/* Input area */}
      <div className="bg-white border-t border-gray-200 px-4 py-3">
        {limitReached ? (
          <div className="text-center py-2">
            <p className="text-sm text-red-500 font-medium">
              You&apos;ve used all {MAX_MESSAGES} messages
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Hopefully you exchanged contact info!
            </p>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Type a message..."
              maxLength={1000}
              className="flex-1 px-4 py-2.5 rounded-full border border-gray-300 focus:ring-2 focus:ring-uw-purple focus:border-transparent outline-none text-sm"
            />
            <button
              type="submit"
              disabled={!messageText.trim() || sending}
              className="p-2.5 rounded-full bg-uw-purple text-white hover:bg-uw-purple-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Send size={18} />
            </button>
          </form>
        )}
      </div>

      {/* Profile modal */}
      {showProfile && otherProfile && (
        <ProfileCardExpanded
          profile={otherProfile}
          onClose={() => setShowProfile(false)}
          onInterested={async () => setShowProfile(false)}
          alreadySwiped
        />
      )}

      {/* Unmatch dialog */}
      {showUnmatch && (
        <UnmatchDialog
          matchName={otherProfile?.name || "this person"}
          onConfirm={handleUnmatch}
          onCancel={() => setShowUnmatch(false)}
          loading={unmatching}
        />
      )}
    </div>
  );
}
