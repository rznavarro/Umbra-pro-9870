import React, { useState } from 'react';
import { X, Send, Upload, FileText, Download, Eye, Search, Shield, AlertTriangle } from 'lucide-react';

interface Tool {
  id: number;
  name: string;
  category: string;
  webhookUrl: string;
  chatType: 'chat' | 'document' | 'analysis' | 'research' | 'compliance';
}

interface ChatMessage {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
  isLoading?: boolean;
  fileAttachment?: string;
}

const tools: Tool[] = [
  {
    id: 1,
    name: "Chat Legal 24/7",
    category: "Consultoría",
    webhookUrl: "https://8f7056be6e10.ngrok-free.app/webhook/Chat%20Legal%2024/7",
    chatType: 'chat'
  },
  {
    id: 2,
    name: "Revisión Rápida",
    category: "Documentos",
    webhookUrl: "https://8f7056be6e10.ngrok-free.app/webhook/Revisi%C3%B3n%20R%C3%A1pida%20de%20Documentos",
    chatType: 'document'
  },
  {
    id: 3,
    name: "Informes Legales",
    category: "Análisis",
    webhookUrl: "https://8f7056be6e10.ngrok-free.app/webhook/Generaci%C3%B3n%20de%20Informes%20Legales",
    chatType: 'analysis'
  },
  {
    id: 4,
    name: "Simulador Legal",
    category: "Investigación",
    webhookUrl: "https://8f7056be6e10.ngrok-free.app/webhook-test/Simulador%20de%20Problemas%20Legales",
    chatType: 'research'
  },
  {
    id: 5,
    name: "Normativas Locales",
    category: "Búsqueda",
    webhookUrl: "https://8f7056be6e10.ngrok-free.app/webhook-test/Buscador%20de%20Normativas%20Locales",
    chatType: 'research'
  },
  {
    id: 6,
    name: "Promesas Compraventa",
    category: "Contratos",
    webhookUrl: "https://39ac2851022c.ngrok-free.app/webhook-test/Generador de Promesas de Compraventa",
    chatType: 'document'
  },
  {
    id: 7,
    name: "Cláusulas Riesgosas",
    category: "Detección",
    webhookUrl: "https://604f346ffa2a.ngrok-free.app/webhook-test/deteccion_de_clausulas_riesgosas",
    chatType: 'analysis'
  },
  {
    id: 8,
    name: "Arriendos y Cesiones",
    category: "Revisión",
    webhookUrl: "https://604f346ffa2a.ngrok-free.app/webhook-test/revision_de_arriendos_y_cesiones",
    chatType: 'document'
  },
  {
    id: 9,
    name: "Corrección Contratos",
    category: "Automatización",
    webhookUrl: "https://604f346ffa2a.ngrok-free.app/webhook-test/correccion_automatica_de_contratos",
    chatType: 'document'
  },
  {
    id: 10,
    name: "Firmas Electrónicas",
    category: "Análisis",
    webhookUrl: "https://604f346ffa2a.ngrok-free.app/webhook-test/analisis_de_firmas_electronicas",
    chatType: 'analysis'
  },
  {
    id: 11,
    name: "Cumplimiento Legal",
    category: "Verificación",
    webhookUrl: "https://604f346ffa2a.ngrok-free.app/webhook-test/verificador_de_cumplimiento_legal",
    chatType: 'compliance'
  },
  {
    id: 12,
    name: "Revisión Express",
    category: "Documentos",
    webhookUrl: "https://604f346ffa2a.ngrok-free.app/webhook-test/revision_rapida_de_documentos",
    chatType: 'document'
  },
  {
    id: 13,
    name: "Informes Ejecutivos",
    category: "Reportes",
    webhookUrl: "https://604f346ffa2a.ngrok-free.app/webhook-test/generacion_de_informes_legales",
    chatType: 'analysis'
  },
  {
    id: 14,
    name: "Permisos Pendientes",
    category: "Evaluación",
    webhookUrl: "https://604f346ffa2a.ngrok-free.app/webhook-test/evaluacion_de_permisos_pendientes",
    chatType: 'compliance'
  },
  {
    id: 15,
    name: "Riesgo Inversionistas",
    category: "Informes",
    webhookUrl: "https://604f346ffa2a.ngrok-free.app/webhook-test/informe_de_riesgo_para_inversionistas",
    chatType: 'analysis'
  },
  {
    id: 16,
    name: "Seguimiento Promesas",
    category: "Automatización",
    webhookUrl: "https://604f346ffa2a.ngrok-free.app/webhook-test/seguimiento_automatico_de_promesas",
    chatType: 'document'
  },
  {
    id: 17,
    name: "Revisión Integral",
    category: "Documentos",
    webhookUrl: "https://604f346ffa2a.ngrok-free.app/webhook-test/revision_rapida_de_documentos",
    chatType: 'document'
  },
  {
    id: 18,
    name: "Agenda Legal",
    category: "Automatización",
    webhookUrl: "https://604f346ffa2a.ngrok-free.app/webhook-test/agenda_legal_automatica",
    chatType: 'compliance'
  },
  {
    id: 19,
    name: "Notificaciones Legales",
    category: "Automatización",
    webhookUrl: "https://604f346ffa2a.ngrok-free.app/webhook-test/automatizacion_de_notificaciones_legales",
    chatType: 'compliance'
  },
  {
    id: 20,
    name: "Recordatorio Firmas",
    category: "Seguimiento",
    webhookUrl: "https://604f346ffa2a.ngrok-free.app/webhook-test/recordatorio_de_firmas_pendientes",
    chatType: 'compliance'
  }
];

function App() {
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const openChat = (tool: Tool) => {
    setSelectedTool(tool);
    setMessages([
      {
        id: 1,
        text: `Bienvenido a ${tool.name}. Soy tu asistente especializado. ¿En qué puedo ayudarte?`,
        isUser: false,
        timestamp: new Date()
      }
    ]);
  };

  const closeChat = () => {
    setSelectedTool(null);
    setMessages([]);
    setInputMessage('');
    setIsLoading(false);
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

    setIsLoading(true);

    const userMessage: ChatMessage = {
      id: messages.length + 1,
      text: inputMessage || `Archivo adjunto: ${uploadedFile?.name}`,
      isUser: true,
      timestamp: new Date(),
      fileAttachment: uploadedFile?.name
    };

    const loadingMessage: ChatMessage = {
      id: messages.length + 2,
      text: "Procesando tu solicitud...",
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
      formData.append('toolId', selectedTool!.id.toString());
      formData.append('timestamp', new Date().toISOString());
      formData.append('sessionId', `session_${Date.now()}`);
      
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

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseText = await response.text();
      
      const botResponse: ChatMessage = {
        id: messages.length + 2,
        text: responseText || "He procesado tu solicitud exitosamente.",
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => prev.map(msg => 
        msg.isLoading ? botResponse : msg
      ));

    } catch (error) {
      console.error('Webhook error:', error);
      
      const errorResponse: ChatMessage = {
        id: messages.length + 2,
        text: "Error procesando la solicitud. Verifica la conexión.",
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => prev.map(msg => 
        msg.isLoading ? errorResponse : msg
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      sendMessage();
    }
  };

  const renderChatInterface = () => {
    if (!selectedTool) return null;

    const { chatType } = selectedTool;

    return (
      <div className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-gradient-to-br from-gray-900 to-black rounded-lg shadow-2xl w-full max-w-5xl h-[85vh] flex border border-yellow-600/30">
          
          {/* Sidebar for specialized tools */}
          {(chatType === 'document' || chatType === 'analysis' || chatType === 'compliance') && (
            <div className="w-80 bg-gradient-to-b from-gray-800 to-gray-900 border-r border-yellow-600/20 p-6">
              <h4 className="text-yellow-400 font-light text-lg mb-6 tracking-wide">
                {chatType === 'document' && 'Gestión de Documentos'}
                {chatType === 'analysis' && 'Centro de Análisis'}
                {chatType === 'compliance' && 'Panel de Cumplimiento'}
              </h4>
              
              {chatType === 'document' && (
                <div className="space-y-4">
                  <div className="bg-black/40 rounded-lg p-4 border border-yellow-600/20">
                    <label className="block text-yellow-300 text-sm mb-2">Subir Documento</label>
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      className="w-full text-xs text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-yellow-600 file:text-black file:font-medium hover:file:bg-yellow-500"
                      accept=".pdf,.doc,.docx,.txt"
                    />
                    {uploadedFile && (
                      <p className="text-yellow-400 text-xs mt-2">
                        Archivo: {uploadedFile.name}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <button className="w-full bg-gradient-to-r from-yellow-600 to-yellow-700 text-black py-2 px-4 rounded-lg text-sm font-medium hover:from-yellow-500 hover:to-yellow-600 transition-all">
                      <FileText className="w-4 h-4 inline mr-2" />
                      Análisis Completo
                    </button>
                    <button className="w-full bg-gray-700 text-yellow-300 py-2 px-4 rounded-lg text-sm hover:bg-gray-600 transition-all">
                      <Download className="w-4 h-4 inline mr-2" />
                      Generar Reporte
                    </button>
                  </div>
                </div>
              )}

              {chatType === 'analysis' && (
                <div className="space-y-4">
                  <div className="bg-black/40 rounded-lg p-4 border border-yellow-600/20">
                    <h5 className="text-yellow-300 text-sm mb-3">Tipo de Análisis</h5>
                    <div className="space-y-2">
                      <label className="flex items-center text-gray-300 text-sm">
                        <input type="radio" name="analysis" className="mr-2 accent-yellow-600" />
                        Análisis de Riesgo
                      </label>
                      <label className="flex items-center text-gray-300 text-sm">
                        <input type="radio" name="analysis" className="mr-2 accent-yellow-600" />
                        Evaluación Legal
                      </label>
                      <label className="flex items-center text-gray-300 text-sm">
                        <input type="radio" name="analysis" className="mr-2 accent-yellow-600" />
                        Informe Ejecutivo
                      </label>
                    </div>
                  </div>
                  
                  <button className="w-full bg-gradient-to-r from-yellow-600 to-yellow-700 text-black py-2 px-4 rounded-lg text-sm font-medium hover:from-yellow-500 hover:to-yellow-600 transition-all">
                    <Eye className="w-4 h-4 inline mr-2" />
                    Iniciar Análisis
                  </button>
                </div>
              )}

              {chatType === 'compliance' && (
                <div className="space-y-4">
                  <div className="bg-black/40 rounded-lg p-4 border border-yellow-600/20">
                    <h5 className="text-yellow-300 text-sm mb-3">Estado de Cumplimiento</h5>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-300">Documentos</span>
                        <span className="text-green-400">85%</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-300">Permisos</span>
                        <span className="text-yellow-400">60%</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-300">Firmas</span>
                        <span className="text-red-400">40%</span>
                      </div>
                    </div>
                  </div>
                  
                  <button className="w-full bg-gradient-to-r from-yellow-600 to-yellow-700 text-black py-2 px-4 rounded-lg text-sm font-medium hover:from-yellow-500 hover:to-yellow-600 transition-all">
                    <Shield className="w-4 h-4 inline mr-2" />
                    Verificar Todo
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="flex items-center justify-between p-6 border-b border-yellow-600/20 bg-gradient-to-r from-gray-900 to-black">
              <div>
                <h3 className="font-light text-yellow-400 tracking-wide text-xl">
                  {selectedTool.name}
                </h3>
                <p className="text-sm text-gray-400">{selectedTool.category}</p>
              </div>
              <button
                onClick={closeChat}
                className="text-gray-400 hover:text-yellow-400 transition-colors duration-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-black to-gray-900">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-2xl px-4 py-3 rounded-lg ${
                      message.isUser
                        ? 'bg-gradient-to-r from-yellow-600 to-yellow-700 text-black text-sm font-medium'
                        : `bg-gray-800/80 text-gray-200 border border-yellow-600/20 text-sm ${
                            message.isLoading ? 'animate-pulse' : ''
                          }`
                    }`}
                  >
                    {message.fileAttachment && (
                      <div className="flex items-center mb-2 text-xs opacity-75">
                        <FileText className="w-3 h-3 mr-1" />
                        {message.fileAttachment}
                      </div>
                    )}
                    {message.text}
                    {message.isLoading && (
                      <div className="flex space-x-1 mt-2">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="p-6 border-t border-yellow-600/20 bg-gradient-to-r from-gray-900 to-black">
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                  placeholder="Escribe tu consulta..."
                  className="flex-1 bg-black/60 text-yellow-100 px-4 py-3 rounded-lg border border-yellow-600/30 focus:border-yellow-400 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed placeholder-gray-500"
                />
                <button
                  onClick={sendMessage}
                  disabled={isLoading || (!inputMessage.trim() && !uploadedFile)}
                  className="bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-500 hover:to-yellow-600 text-black px-4 py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-yellow-100">
      {/* Header */}
      <header className="relative py-16 px-8 text-center border-b border-yellow-600/20">
        <div className="absolute inset-0 bg-gradient-to-b from-yellow-900/10 to-transparent"></div>
        <div className="relative">
          <h1 className="text-7xl font-thin tracking-[0.3em] mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
            UMBRA
          </h1>
          <p className="text-xl text-gray-400 font-light tracking-[0.2em] uppercase">
            Legal Intelligence System
          </p>
          <div className="mt-6 w-32 h-px bg-gradient-to-r from-transparent via-yellow-600 to-transparent mx-auto"></div>
        </div>
      </header>

      {/* Tools Grid */}
      <main className="px-8 py-12">
        <div className="max-w-6xl mx-auto">
          <style jsx>{`
            @keyframes fadeInUp {
              from {
                opacity: 0;
                transform: translateY(20px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            
            @keyframes glow {
              0%, 100% {
                box-shadow: 0 0 5px rgba(202, 138, 4, 0.3);
              }
              50% {
                box-shadow: 0 0 20px rgba(202, 138, 4, 0.6);
              }
            }
            
            .tool-card {
              animation: fadeInUp 0.6s ease-out forwards;
              opacity: 0;
            }
            
            .tool-card:hover {
              animation: glow 2s ease-in-out infinite;
            }
          `}</style>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {tools.map((tool, index) => (
              <div
                key={tool.id}
                className="tool-card group relative bg-gradient-to-br from-gray-900/60 to-black/80 backdrop-blur-sm rounded-lg p-4 border border-yellow-600/20 hover:border-yellow-400/60 transition-all duration-300 cursor-pointer transform hover:scale-105"
                onClick={() => openChat(tool)}
                style={{
                  animationDelay: `${index * 0.08}s`
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                
                <div className="relative z-10 text-center">
                  <h3 className="text-sm font-light text-yellow-100 mb-2 tracking-wide group-hover:text-yellow-300 transition-colors duration-300">
                    {tool.name}
                  </h3>
                  
                  <div className="text-xs text-gray-500 uppercase tracking-wider font-medium group-hover:text-yellow-600 transition-colors duration-300">
                    {tool.category}
                  </div>
                  
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Chat Interface */}
      {renderChatInterface()}

      {/* Footer */}
      <footer className="border-t border-yellow-600/20 py-8 text-center bg-gradient-to-t from-gray-900/50 to-transparent">
        <p className="text-gray-500 text-sm font-light tracking-[0.15em] uppercase">
          © 2025 UMBRA • Classified Legal Technology
        </p>
      </footer>
    </div>
  );
}

export default App;
