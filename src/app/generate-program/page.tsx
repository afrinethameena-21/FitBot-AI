"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { vapi } from "@/lib/vapi";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ClerkLoaded, ClerkLoading } from "@clerk/nextjs";

interface ChatMessage {
  content: string;
  role: "assistant" | "user";
}

interface VapiMessage {
  type: string;
  transcriptType?: string;
  transcript?: string;
  role?: "assistant" | "user";
}

interface VapiError {
  message?: string;
  code?: string | number;
}

const GenerateProgramPage = () => {
  const [callActive, setCallActive] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [callEnded, setCallEnded] = useState(false);

  const { user } = useUser();
  const router = useRouter();
  const messageContainerRef = useRef<HTMLDivElement>(null);

  // Scroll messages to bottom
  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Redirect after call ends
  useEffect(() => {
    if (callEnded) {
      const redirectTimer = setTimeout(() => {
        router.push("/profile");
      }, 1500);
      return () => clearTimeout(redirectTimer);
    }
  }, [callEnded, router]);

  // Handle VAPI events
  useEffect(() => {
    const handleCallStart = () => {
      setConnecting(false);
      setCallActive(true);
      setCallEnded(false);
    };

    const handleCallEnd = () => {
      setCallActive(false);
      setIsSpeaking(false);
      setCallEnded(true);
    };

    const handleSpeechStart = () => setIsSpeaking(true);
    const handleSpeechEnd = () => setIsSpeaking(false);

    const handleMessage = (message: VapiMessage) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage: ChatMessage = {
          content: message.transcript || "",
          role: message.role || "assistant",
        };
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    const handleError = (error: VapiError) => {
      console.error("Vapi Error:", error.message || error);
      setConnecting(false);
      setCallActive(false);
    };

    vapi
      .on("call-start", handleCallStart)
      .on("call-end", handleCallEnd)
      .on("speech-start", handleSpeechStart)
      .on("speech-end", handleSpeechEnd)
      .on("message", handleMessage)
      .on("error", handleError);

    return () => {
      vapi
        .off("call-start", handleCallStart)
        .off("call-end", handleCallEnd)
        .off("speech-start", handleSpeechStart)
        .off("speech-end", handleSpeechEnd)
        .off("message", handleMessage)
        .off("error", handleError);
    };
  }, []);

  // Start / Stop call
  const toggleCall = async () => {
    if (callActive) {
      vapi.stop();
    } else {
      try {
        setConnecting(true);
        setMessages([]);
        setCallEnded(false);

        const fullName =
          user?.firstName || user?.lastName
            ? `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim()
            : "There";

        await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!, {
          variableValues: { full_name: fullName },
        });
      } catch (error) {
        console.error("Failed to start call:", error);
        setConnecting(false);
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen text-foreground overflow-hidden pb-6 pt-24">
      <div className="container mx-auto px-4 h-full max-w-5xl">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-mono">
            <span className="uppercase text-[#8A2BE2]">FITNESS PROGRAM</span>
          </h1>
          <p className="text-muted-foreground mt-2">
  Have a voice conversation with FitBot to generate a personalized
  fitness program. Connect to your microphone and click &quot;Start Call&quot; to begin.
</p>
        </div>

        {/* Main Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* AI Card */}
          <Card className="bg-card/90 backdrop-blur-sm border-2 border-[#8A2BE2] overflow-hidden relative">
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              {/* AI Voice Animation */}
              <div
                className={`absolute inset-0 ${
                  isSpeaking ? "opacity-30" : "opacity-0"
                } transition-opacity duration-300`}
              >
                <div
                  className={`absolute inset-0 flex justify-center items-center ${
                    isSpeaking ? "opacity-100" : "opacity-0"
                  } transition-opacity duration-300`}
                >
                  <div className="flex h-20 items-end">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`mx-1 w-1 rounded-full ${
                          isSpeaking ? "animate-sound-wave" : ""
                        }`}
                        style={{
                          backgroundColor: "#8A2BE2",
                          animationDelay: `${i * 0.2}s`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* AI Image */}
              <div className="relative size-32 mb-4">
                <div
                  className={`absolute inset-0 opacity-10 rounded-full blur-lg ${
                    isSpeaking ? "animate-pulse" : ""
                  }`}
                  style={{ backgroundColor: "#8A2BE2" }}
                />
                <Image
                  src="/ai-avatar.jpg"
                  alt="AI Assistant"
                  width={128}
                  height={128}
                  className="rounded-full object-cover"
                />
              </div>

              <h2 className="text-xl font-bold text-foreground">FitBot AI</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Fitness & Diet Coach
              </p>

              <div
                className={`mt-4 flex items-center gap-2 px-3 py-1 rounded-full bg-card border border-border ${
                  isSpeaking ? "border-[#8A2BE2]" : ""
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    isSpeaking ? "bg-[#8A2BE2] animate-pulse" : "bg-muted"
                  }`}
                />
                <span className="text-xs text-muted-foreground">
                  {isSpeaking
                    ? "Speaking..."
                    : callActive
                    ? "Listening..."
                    : callEnded
                    ? "Redirecting to profile..."
                    : "Waiting..."}
                </span>
              </div>
            </div>
          </Card>

          {/* User Card */}
          <Card className="bg-card/90 backdrop-blur-sm border-2 border-[#8A2BE2] overflow-hidden relative">
  <div className="aspect-video flex flex-col items-center justify-center p-6 relative">

    <ClerkLoading>
      {/* Temporary skeleton while Clerk loads */}
      <div className="size-32 rounded-full bg-muted animate-pulse mb-4" />
      <h2 className="text-xl font-bold text-foreground">You</h2>
      <p className="text-sm text-muted-foreground mt-1">Loading...</p>
    </ClerkLoading>

    <ClerkLoaded>
      <div className="relative size-32 mb-4">
        <Image
          src={user?.imageUrl || "/default-user.png"}
          alt="User"
          width={128}
          height={128}
          className="rounded-full object-cover"
        />
      </div>
      <h2 className="text-xl font-bold text-foreground">You</h2>
      <p className="text-sm text-muted-foreground mt-1">
        {user
          ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()
          : "Guest"}
      </p>
      <div className="mt-4 flex items-center gap-2 px-3 py-1 rounded-full bg-card border">
        <div className="w-2 h-2 rounded-full bg-muted" />
        <span className="text-xs text-muted-foreground">Ready</span>
      </div>
    </ClerkLoaded>
  </div>
</Card>
        </div>

        {/* Messages */}
        {messages.length > 0 && (
          <div
            ref={messageContainerRef}
            className="w-full bg-card/90 backdrop-blur-sm border border-border rounded-xl p-4 mb-8 h-64 overflow-y-auto transition-all duration-300 scroll-smooth"
          >
            <div className="space-y-3">
              {messages.map((msg, index) => (
                <div key={index} className="message-item animate-fadeIn">
                  <div className="font-semibold text-xs text-muted-foreground mb-1">
                    {msg.role === "assistant" ? "FitBot AI" : "You"}:
                  </div>
                  <p className="text-foreground">{msg.content}</p>
                </div>
              ))}
              {callEnded && (
                <div className="message-item animate-fadeIn">
                  <div className="font-semibold text-xs text-primary mb-1">
                    System:
                  </div>
                  <p className="text-foreground">
                    Your fitness program has been created! Redirecting to your
                    profile...
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="w-full flex justify-center gap-4">
          <Button
            className="w-40 text-xl rounded-3xl bg-[#8A2BE2] hover:bg-[#7a1fd8] text-white relative"
            onClick={toggleCall}
            disabled={connecting || callEnded}
          >
            {connecting && (
              <span className="absolute inset-0 rounded-full animate-ping bg-[#8A2BE2]/50 opacity-75" />
            )}
            <span>
              {callActive
                ? "End Call"
                : connecting
                ? "Connecting..."
                : callEnded
                ? "View Profile"
                : "Start Call"}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GenerateProgramPage;
