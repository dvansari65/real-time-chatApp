"use client";
import { useState, useEffect } from "react";
// import { useAuth } from "@/contextApi";
// import { useChatCreation } from "@/hooks/useCreateChat";
// import { RootState } from "@/lib/store";
// import { useSelector } from "react-redux";
import Loader from "@/components/ui/Loader";
import RedirectPage from "./Redirecting/page";
import {
  MessageSquare,
  Sparkles,
  Zap,
  Users,
  Shield,
  ArrowRight,
  ChevronDown,
  Star,
  Check,
} from "lucide-react";
import { useAuth } from "@/contextApi";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";

const FloatingElement = ({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`transform transition-all duration-1000 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  );
};

const GradientText = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <span
    className={`bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent ${className}`}
  >
    {children}
  </span>
);

const FeatureCard = ({
  icon: Icon,
  title,
  description,
  delay = 0,
}: {
  icon: React.ComponentType<any>;
  title: string;
  description: string;
  delay?: number;
}) => (
  <FloatingElement delay={delay}>
    <div className="group relative p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-500 hover:scale-105 hover:shadow-2xl">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="relative z-10">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
          <Icon className="w-7 h-7 text-white" />
        </div>
        <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
        <p className="text-gray-400 leading-relaxed">{description}</p>
      </div>
    </div>
  </FloatingElement>
);

const StatCard = ({
  number,
  label,
  delay = 0,
}: {
  number: string;
  label: string;
  delay?: number;
}) => (
  <FloatingElement delay={delay}>
    <div className="text-center">
      <div className="text-4xl font-bold text-white mb-2">
        <GradientText>{number}</GradientText>
      </div>
      <div className="text-gray-400 text-sm uppercase tracking-wide">
        {label}
      </div>
    </div>
  </FloatingElement>
);

export default function Home() {
  const { data, isLoading } = useAuth();
  const { isLoading: chatCreationLoading } = useSelector((state: RootState) => state.Loading);

  // Mock data for demo - replace with your actual auth data
  // const data = { user: { username: "John" } };

  // const isLoading = false;


  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);
  const [particles, setParticles] = useState<
    { left: string; top: string; delay: string; duration: string }[]
  >([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 20 }).map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 3}s`,
      duration: `${2 + Math.random() * 3}s`,
    }));
    setParticles(newParticles);
  }, []);

  if (chatCreationLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <div className="relative">
          <Loader />
          <div className="absolute inset-0 animate-ping rounded-full bg-blue-500/20"></div>
        </div>
      </div>
    );
  }

  if (!data?.user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden">
      {chatCreationLoading && <div>Loading...</div>}

      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900/50 to-purple-900/50"></div>
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.15) 0%, transparent 50%)`,
        }}
      ></div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((p, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-blue-500/20 rounded-full animate-pulse"
            style={{
              left: p.left,
              top: p.top,
              animationDelay: p.delay,
              animationDuration: p.duration,
            }}
          ></div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* Header */}
        <FloatingElement>
          <header className="flex justify-between items-center mb-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">ChatConnect</h1>
                <p className="text-xs text-gray-400">Real-Time Messaging</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-white/5 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-300">Online</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center font-bold text-white text-sm">
                {data?.user?.username?.charAt(0).toUpperCase()}
              </div>
            </div>
          </header>
        </FloatingElement>

        {/* Welcome Hero Section */}
        <div className="text-center mb-20">
          <FloatingElement delay={200}>
            <div className="inline-flex items-center space-x-2 bg-white/5 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/10">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-gray-300">
                Welcome back, {data?.user?.username}!
              </span>
            </div>
          </FloatingElement>

          <FloatingElement delay={400}>
            <h2 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Connect & Chat
              <br />
              <GradientText>Instantly</GradientText>
              <br />
              Anywhere
            </h2>
          </FloatingElement>

          <FloatingElement delay={600}>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Join millions of users in seamless real-time conversations. Chat
              with friends, share moments, and stay connected like never before.
            </p>
          </FloatingElement>

          {/* <FloatingElement delay={800}>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold text-lg hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl">
                <span className="relative z-10 flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5" />
                  <span>Start Chatting</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
              
              <button className="px-8 py-4 border-2 border-white/20 text-white rounded-2xl font-semibold text-lg hover:bg-white/5 transition-all duration-300 backdrop-blur-sm">
                View Messages
              </button>
            </div>
          </FloatingElement> */}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <FeatureCard
            icon={Zap}
            title="Instant Messaging"
            description="Send and receive messages in real-time with lightning-fast delivery and read receipts."
            delay={1000}
          />
          <FeatureCard
            icon={Shield}
            title="Secure & Private"
            description="Your conversations are end-to-end encrypted and protected with advanced security measures."
            delay={1200}
          />
          <FeatureCard
            icon={Users}
            title="Group Chats"
            description="Create group conversations, share media, and collaborate with multiple friends and colleagues."
            delay={1400}
          />
        </div>

        {/* Recent Activity Section */}
        <FloatingElement delay={1600}>
          <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">
                Recent Conversations
              </h3>
              <button className="text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium">
                View All
              </button>
            </div>

            <div className="space-y-4">
              {[
                {
                  title: "Team Project Discussion",
                  time: "2 minutes ago",
                  type: "group",
                },
                { title: "Sarah Johnson", time: "1 hour ago", type: "direct" },
                {
                  title: "Weekend Plans Group",
                  time: "3 hours ago",
                  type: "group",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <h4 className="text-white font-medium">{item.title}</h4>
                    <p className="text-gray-400 text-sm">{item.time}</p>
                  </div>
                  <div className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-medium">
                    {item.type}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FloatingElement>

        {/* Bottom CTA */}
        <FloatingElement delay={1800}>
          <div className="text-center mt-20 pb-12">
            <div className="inline-flex items-center space-x-2 text-gray-400 mb-4">
              <span>Ready to start chatting?</span>
              <ChevronDown className="w-4 h-4 animate-bounce" />
            </div>
            <button className="group relative px-12 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold text-xl hover:scale-105 transition-all duration-300 shadow-2xl">
              <span className="relative z-10">Open ChatConnect</span>
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-purple-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
          </div>
        </FloatingElement>
      </div>
    </div>
  );
}
