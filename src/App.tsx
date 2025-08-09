import React, { useState, useEffect } from 'react';
import { X, Send, Upload, FileText, Download, Eye, Search, Shield, AlertTriangle, Lock, Loader2, MessageCircle, FileCheck, Edit3, AlertCircle, PenTool, Calendar, BookOpen, TrendingUp } from 'lucide-react';

interface Tool {
  id: number;
  name: string;
  category: string;
  description: string;
  webhookUrl: string;
  chatType: 'chat' | 'document' | 'analysis' | 'research' | 'compliance';
  icon: React.ComponentType<any>;
  priority: number;
}

interface ChatMessage {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
  isLoading?: boolean;
  fileAttachment?: string;
}

// CORE 8 FUNCTIONS - High Impact Tools Only
const coreTools: Tool[] = [
  {
    id: 1,
    name: "Chat Legal 24/7",
    category: "Consultoría",
    description: "Asesoría legal instantánea disponible las 24 horas",
    webhookUrl: "https://8f7056be6e10.ngrok-free.app/webhook/Chat%20Legal%2024/7",
    chatType: 'chat',
    icon: MessageCircle,
    priority: 1
  },
  {
    id: 2,
    name: "Revisión Rápida",
    category: "Documentos",
    description: "Análisis inmediato de documentos legales",
    webhookUrl: "https://8f7056be6e10.ngrok-free.app/webhook/Revisi%C3%B3n%20R%C3%A1pida%20de%20Documentos",
    chatType: 'document',
    icon: FileCheck,
    priority: 2
  },
  {
    id: 3,
    name: "Corrección de Contratos",
    category: "Automatización",
    description: "Corrección automática e inteligente de contratos",
    webhookUrl: "https://604f346ffa2a.ngrok-free.app/webhook-test/correccion_automatica_de_contratos",
    chatType: 'document',
    icon: Edit3,
    priority: 3
  },
  {
    id: 4,
    name: "Análisis de Cláusulas Riesgosas",
    category: "Detección",
    description: "Identificación automática de cláusulas de alto riesgo",
    webhookUrl: "https://604f346ffa2a.ngrok-free.app/webhook-test/deteccion_de_clausulas_riesgosas",
    chatType: 'analysis',
    icon: AlertCircle,
    priority: 4
  },
  {
    id: 5,
    name: "Firmas Electrónicas",
    category: "Análisis",
    description: "Validación y análisis de firmas digitales",
    webhookUrl: "https://604f346ffa2a.ngrok-free.app/webhook-test/analisis_de_firmas_electronicas",
    chatType: 'analysis',
    icon: PenTool,
    priority: 5
  },
  {
    id: 6,
    name: "Agenda Legal + Recordatorio de Firmas",
    category: "Automatización",
    description: "Gestión automatizada de agenda y recordatorios",
    webhookUrl: "https://604f346ffa2a.ngrok-free.app/webhook-test/agenda_legal_automatica",
    chatType: 'compliance',
    icon: Calendar,
    priority: 6
  },
  {
    id: 7,
    name: "Normativas Locales",
    category: "Búsqueda",
    description: "Búsqueda especializada en normativas y regulaciones",
    webhookUrl: "https://8f7056be6e10.ngrok-free.app/webhook-test/Buscador%20de%20Normativas%20Locales",
    chatType: 'research',
    icon: BookOpen,
    priority: 7
  },
  {
    id: 8,
    name: "Evaluación de Riesgo para Inversionistas",
    category: "Informes",
    description: "Análisis de riesgo especializado para inversiones",
    webhookUrl: "https://604f346ffa2a.ngrok-free.app/webhook-test/informe_de_riesgo_para_inversionistas",
    chatType: 'analysis',
    icon: TrendingUp,
    priority: 8
  }
];

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleLogin = async () => {
    if (password !== 'UMBRA') {
      setAuthError('Contraseña incorrecta');
      return;
    }

    setIsLoading(true);
    setAuthError('');

    // 5 second loading simulation
    setTimeout(() => {
      setIsAuthenticated(true);
      setIsLoading(false);
    }, 5000);
  };

  const openChat = (tool: Tool) => {
    setSelectedTool(tool);
    setMessages([
      {
        id: 1,
        text: `Bienvenido a ${tool.name}. ${tool.description}. ¿En qué puedo ayudarte?`,
        isUser: false,
        timestamp: new Date()
      }
    ]);
  };

  const closeChat = () => {
    setSelectedTool(null);
    setMessages([]);
    setInputMessage('');
    setIsSending(false);
    setUploadedFile(null);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() && !uploadedFile) return;

    setIsSending(true);

    const userMessage: ChatMessage = {
      id: messages.length + 1,
      text: inputMessage || `Archivo: ${uploadedFile?.name}`,
      isUser: true,
      timestamp: new Date(),
      fileAttachment: uploadedFile?.name
    };

    const loadingMessage: ChatMessage = {
      id: messages.length + 2,
      text: "Procesando con IA especializada...",
      isUser: false,
      timestamp: new Date(),
      isLoading: true
    };

    setMessages(prev => [...prev, userMessage, loadingMessage]);
    setInputMessage('');
    setUploadedFile(null);

    try {
      const formData = new FormData();
      formData.append('message', inputMessage);
      formData.append('tool', selectedTool!.name);
      
      if (uploadedFile) {
        formData.append('file', uploadedFile);
      }

      const response = await fetch(selectedTool!.webhookUrl, {
        method: 'POST',
        headers: {
          'ngrok-skip-browser-warning': 'true'
        },
        body: formData
      });

      const responseText = await response.text();
      
      const botResponse: ChatMessage = {
        id: messages.length + 2,
        text: responseText || "Análisis completado exitosamente.",
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => prev.map(msg => 
        msg.isLoading ? botResponse : msg
      ));

    } catch (error) {
      const errorResponse: ChatMessage = {
        id: messages.length + 2,
        text: "Error en la conexión. Intenta nuevamente.",
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => prev.map(msg => 
        msg.isLoading ? errorResponse : msg
      ));
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isSending) {
      sendMessage();
    }
  };

  // Authentication Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-900/20 via-black to-yellow-800/10"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-600/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        {isLoading ? (
          // Loading Screen
          <div className="relative z-10 text-center">
            <div className="mb-8">
              <Loader2 className="w-16 h-16 text-yellow-400 animate-spin mx-auto mb-4" />
              <h2 className="text-2xl font-light text-yellow-400 tracking-[0.3em] mb-2">
                INICIALIZANDO
              </h2>
              <p className="text-gray-400 text-sm tracking-wider">
                Cargando núcleo de alto impacto...
              </p>
            </div>
            <div className="w-64 h-1 bg-gray-800 rounded-full mx-auto overflow-hidden">
              <div className="h-full bg-gradient-to-r from-yellow-600 to-yellow-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        ) : (
          // Login Screen
          <div className="relative z-10 bg-black/80 backdrop-blur-sm border border-yellow-600/30 rounded-lg p-8 w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-thin tracking-[0.3em] mb-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
                UMBRA
              </h1>
              <p className="text-gray-400 text-sm tracking-wider uppercase">
                Core Legal Intelligence
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-yellow-300 text-sm mb-2 tracking-wide">
                  Contraseña de Acceso
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                    className="w-full bg-gray-900/50 text-yellow-100 pl-10 pr-4 py-3 rounded-lg border border-yellow-600/30 focus:border-yellow-400 focus:outline-none transition-colors"
                    placeholder="Ingresa la contraseña"
                  />
                </div>
                {authError && (
                  <p className="text-red-400 text-xs mt-2 animate-pulse">
                    {authError}
                  </p>
                )}
              </div>

              <button
                onClick={handleLogin}
                className="w-full bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-500 hover:to-yellow-600 text-black py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
              >
                ACCEDER AL NÚCLEO
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Optimized Chat Interface
  const renderChatInterface = () => {
    if (!selectedTool) return null;

    return (
      <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
        <div className="bg-gradient-to-br from-gray-900/90 to-black/90 rounded-xl shadow-2xl w-full max-w-2xl h-[65vh] flex flex-col border border-yellow-600/20 animate-slideUp">
          
          {/* Optimized Header */}
          <div className="flex items-center justify-between p-4 border-b border-yellow-600/20 bg-gradient-to-r from-gray-900/80 to-black/80">
            <div className="flex items-center space-x-3">
              <selectedTool.icon className="w-5 h-5 text-yellow-400" />
              <div>
                <h3 className="font-light text-yellow-400 text-lg tracking-wide">
                  {selectedTool.name}
                </h3>
                <p className="text-xs text-gray-500 uppercase tracking-wider">{selectedTool.category}</p>
              </div>
            </div>
            <button
              onClick={closeChat}
              className="text-gray-400 hover:text-yellow-400 transition-colors duration-200 hover:rotate-90 transform"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Optimized Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-black/50 to-gray-900/50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} animate-messageSlide`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                    message.isUser
                      ? 'bg-gradient-to-r from-yellow-600 to-yellow-700 text-black font-medium'
                      : `bg-gray-800/60 text-gray-200 border border-yellow-600/20 ${
                          message.isLoading ? 'animate-pulse' : ''
                        }`
                  }`}
                >
                  {message.fileAttachment && (
                    <div className="flex items-center mb-1 text-xs opacity-75">
                      <FileText className="w-3 h-3 mr-1" />
                      {message.fileAttachment}
                    </div>
                  )}
                  {message.text}
                  {message.isLoading && (
                    <div className="flex space-x-1 mt-1">
                      <div className="w-1 h-1 bg-yellow-400 rounded-full animate-bounce"></div>
                      <div className="w-1 h-1 bg-yellow-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-1 h-1 bg-yellow-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Optimized Input */}
          <div className="p-4 border-t border-yellow-600/20 bg-gradient-to-r from-gray-900/80 to-black/80">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isSending}
                placeholder="Escribe tu consulta..."
                className="flex-1 bg-black/40 text-yellow-100 px-3 py-2 rounded-lg border border-yellow-600/30 focus:border-yellow-400 focus:outline-none disabled:opacity-50 text-sm placeholder-gray-500"
              />
              <button
                onClick={sendMessage}
                disabled={isSending || (!inputMessage.trim() && !uploadedFile)}
                className="bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-500 hover:to-yellow-600 text-black px-3 py-2 rounded-lg transition-all duration-200 disabled:opacity-50 font-medium transform hover:scale-105"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-yellow-100 overflow-hidden">
      {/* Optimized animated background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-600/3 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-yellow-400/3 rounded-full blur-3xl animate-float-delayed"></div>
      </div>

      {/* Optimized Header */}
      <header className="relative py-8 px-8 text-center border-b border-yellow-600/20 animate-fadeInDown">
        <div className="absolute inset-0 bg-gradient-to-b from-yellow-900/5 to-transparent"></div>
        <div className="relative">
          <h1 className="text-5xl font-thin tracking-[0.3em] mb-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 animate-glow">
            UMBRA
          </h1>
          <p className="text-base text-gray-400 font-light tracking-[0.2em] uppercase animate-fadeIn">
            Core Legal Intelligence • 8 Funciones Esenciales
          </p>
          <div className="mt-3 w-24 h-px bg-gradient-to-r from-transparent via-yellow-600 to-transparent mx-auto animate-expand"></div>
        </div>
      </header>

      {/* Optimized Core Functions Dashboard */}
      <main className="px-6 py-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Priority Grid - 2x4 Layout for Core Functions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {coreTools.map((tool, index) => (
              <div
                key={tool.id}
                className="group relative bg-gradient-to-br from-gray-900/60 to-black/80 backdrop-blur-sm rounded-xl p-6 border border-yellow-600/30 hover:border-yellow-400/80 transition-all duration-300 cursor-pointer transform hover:scale-105 hover:-translate-y-2 animate-cardSlideUp shadow-lg hover:shadow-yellow-600/20"
                onClick={() => openChat(tool)}
                style={{
                  animationDelay: `${index * 0.1}s`
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-600/0 to-yellow-600/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                
                <div className="relative z-10 text-center">
                  {/* Priority Icon */}
                  <div className="mb-4 flex justify-center">
                    <div className="p-3 bg-gradient-to-br from-yellow-600/20 to-yellow-700/30 rounded-lg group-hover:from-yellow-500/30 group-hover:to-yellow-600/40 transition-all duration-300">
                      <tool.icon className="w-8 h-8 text-yellow-400 group-hover:text-yellow-300 transition-colors duration-300" />
                    </div>
                  </div>
                  
                  {/* Tool Name */}
                  <h3 className="text-sm font-medium text-yellow-100 mb-2 tracking-wide group-hover:text-yellow-300 transition-colors duration-300 leading-tight">
                    {tool.name}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-xs text-gray-400 mb-3 group-hover:text-gray-300 transition-colors duration-300 leading-relaxed">
                    {tool.description}
                  </p>
                  
                  {/* Category Badge */}
                  <div className="inline-block px-2 py-1 bg-yellow-600/20 rounded-full">
                    <span className="text-[10px] text-yellow-300 uppercase tracking-wider font-medium">
                      {tool.category}
                    </span>
                  </div>
                  
                  {/* Priority Indicator */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Core Stats */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center space-x-4 bg-gradient-to-r from-gray-900/40 to-black/60 backdrop-blur-sm rounded-lg px-6 py-3 border border-yellow-600/20">
              <div className="text-center">
                <div className="text-lg font-light text-yellow-400">8</div>
                <div className="text-xs text-gray-500 uppercase tracking-wider">Funciones Core</div>
              </div>
              <div className="w-px h-8 bg-yellow-600/30"></div>
              <div className="text-center">
                <div className="text-lg font-light text-yellow-400">80%</div>
                <div className="text-xs text-gray-500 uppercase tracking-wider">Impacto</div>
              </div>
              <div className="w-px h-8 bg-yellow-600/30"></div>
              <div className="text-center">
                <div className="text-lg font-light text-yellow-400">24/7</div>
                <div className="text-xs text-gray-500 uppercase tracking-wider">Disponible</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Chat Interface */}
      {renderChatInterface()}

      {/* Optimized Footer */}
      <footer className="border-t border-yellow-600/10 py-4 text-center bg-gradient-to-t from-gray-900/30 to-transparent relative z-10">
        <p className="text-gray-600 text-xs font-light tracking-[0.15em] uppercase">
          © 2025 UMBRA • Optimized Legal Core • High Impact Functions Only
        </p>
      </footer>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes cardSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes messageSlide {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-180deg); }
        }
        
        @keyframes glow {
          0%, 100% { text-shadow: 0 0 5px rgba(202, 138, 4, 0.3); }
          50% { text-shadow: 0 0 20px rgba(202, 138, 4, 0.6); }
        }
        
        @keyframes expand {
          from { width: 0; }
          to { width: 6rem; }
        }
        
        .animate-fadeIn { animation: fadeIn 0.6s ease-out; }
        .animate-fadeInDown { animation: fadeInDown 0.8s ease-out; }
        .animate-slideUp { animation: slideUp 0.4s ease-out; }
        .animate-cardSlideUp { animation: cardSlideUp 0.6s ease-out forwards; opacity: 0; }
        .animate-messageSlide { animation: messageSlide 0.3s ease-out; }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 8s ease-in-out infinite; }
        .animate-glow { animation: glow 3s ease-in-out infinite; }
        .animate-expand { animation: expand 1s ease-out 0.5s forwards; width: 0; }
      `}</style>
    </div>
  );
}

export default App;