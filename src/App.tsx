import React, { useState, useEffect } from 'react';
import { X, Send, Upload, FileText, Download, Eye, Search, Shield, AlertTriangle, Lock, Loader2, MessageCircle, FileCheck, Edit3, AlertCircle, PenTool, Calendar, BookOpen, TrendingUp, Bot, User, Clock, CheckCircle, FileUp, Zap, Users, Phone, Video, Mail, Star, Award, Briefcase, Database, BarChart3, FileSearch, Building2, UserCheck } from 'lucide-react';

interface Tool {
  id: number;
  name: string;
  category: string;
  description: string;
  webhookUrl: string;
  chatType: 'chat' | 'document' | 'analysis' | 'research' | 'compliance' | 'consultation' | 'due-diligence' | 'data-extraction';
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
  messageType?: 'text' | 'document' | 'template' | 'scenario' | 'normative' | 'agenda' | 'due-diligence' | 'data-extraction';
  formattedContent?: React.ReactNode;
}

interface Consultant {
  id: number;
  name: string;
  specialty: string;
  rating: number;
  experience: string;
  available: boolean;
  avatar: string;
}

interface DueDiligenceResult {
  companyName: string;
  status: string;
  riskLevel: 'low' | 'medium' | 'high';
  findings: string[];
  recommendations: string[];
}

interface ExtractedData {
  fileName: string;
  extractedFields: { [key: string]: string };
  riskScore: number;
  criticalClauses: string[];
}

// CORE 8 FUNCTIONS - Updated with New AI Tools
const coreTools: Tool[] = [
  {
    id: 1,
    name: "Chat Legal 24/7",
    category: "Asistente Avanzado",
    description: "Centro neurálgico legal con IA avanzada, análisis de documentos, plantillas y escalamiento",
    webhookUrl: "https://8f7056be6e10.ngrok-free.app/webhook/Chat%20Legal%2024/7",
    chatType: 'chat',
    icon: Bot,
    priority: 1
  },
  {
    id: 2,
    name: "Consultoría Especializada",
    category: "Humanos Expertos",
    description: "Conexión directa con abogados especializados para casos complejos",
    webhookUrl: "https://8f7056be6e10.ngrok-free.app/webhook/Consultoria",
    chatType: 'consultation',
    icon: Users,
    priority: 2
  },
  {
    id: 3,
    name: "Revisión Rápida",
    category: "Documentos",
    description: "Análisis inmediato de documentos legales",
    webhookUrl: "https://8f7056be6e10.ngrok-free.app/webhook/Revisi%C3%B3n%20R%C3%A1pida%20de%20Documentos",
    chatType: 'document',
    icon: FileCheck,
    priority: 3
  },
  {
    id: 4,
    name: "Corrección de Contratos",
    category: "Automatización",
    description: "Corrección automática e inteligente de contratos",
    webhookUrl: "https://604f346ffa2a.ngrok-free.app/webhook-test/correccion_automatica_de_contratos",
    chatType: 'document',
    icon: Edit3,
    priority: 4
  },
  {
    id: 5,
    name: "Análisis de Cláusulas Riesgosas",
    category: "Detección",
    description: "Identificación automática de cláusulas de alto riesgo",
    webhookUrl: "https://604f346ffa2a.ngrok-free.app/webhook-test/deteccion_de_clausulas_riesgosas",
    chatType: 'analysis',
    icon: AlertCircle,
    priority: 5
  },
  {
    id: 6,
    name: "Due Diligence Automatizado",
    category: "IA Avanzada",
    description: "Investigación automática de empresas y personas con IA",
    webhookUrl: "https://604f346ffa2a.ngrok-free.app/webhook-test/due_diligence_automatizado",
    chatType: 'due-diligence',
    icon: Building2,
    priority: 6
  },
  {
    id: 7,
    name: "Extracción Masiva de Datos",
    category: "IA Avanzada",
    description: "Procesamiento masivo de documentos con extracción inteligente",
    webhookUrl: "https://604f346ffa2a.ngrok-free.app/webhook-test/extraccion_masiva_datos",
    chatType: 'data-extraction',
    icon: Database,
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

// Mock consultants data
const availableConsultants: Consultant[] = [
  {
    id: 1,
    name: "Dr. María González",
    specialty: "Derecho Corporativo",
    rating: 4.9,
    experience: "15 años",
    available: true,
    avatar: "MG"
  },
  {
    id: 2,
    name: "Lic. Carlos Mendoza",
    specialty: "Derecho Laboral",
    rating: 4.8,
    experience: "12 años",
    available: true,
    avatar: "CM"
  },
  {
    id: 3,
    name: "Dra. Ana Ruiz",
    specialty: "Derecho Civil",
    rating: 4.9,
    experience: "18 años",
    available: false,
    avatar: "AR"
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
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [showConsultants, setShowConsultants] = useState(false);
  const [selectedConsultant, setSelectedConsultant] = useState<Consultant | null>(null);
  const [dueDiligenceResults, setDueDiligenceResults] = useState<DueDiligenceResult[]>([]);
  const [extractedData, setExtractedData] = useState<ExtractedData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

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
    
    if (tool.id === 1) { // Chat Legal 24/7 - Advanced Assistant
      setMessages([
        {
          id: 1,
          text: `¡Bienvenido al Asistente Legal Avanzado UMBRA! 🤖⚖️

Soy tu asistente legal inteligente disponible 24/7. Puedo ayudarte con:

📄 **Análisis de Documentos** - Sube contratos para análisis completo
📝 **Plantillas Inteligentes** - Genero documentos legales personalizados  
🎯 **Simulación de Escenarios** - Analizo consecuencias legales
📚 **Normativas Locales** - Consulto leyes y regulaciones vigentes
📅 **Agenda Legal** - Programo recordatorios y citas
👨‍💼 **Escalamiento Humano** - Te conecto con abogados especializados

¿En qué puedo asistirte hoy?`,
          isUser: false,
          timestamp: new Date(),
          messageType: 'text'
        }
      ]);
    } else if (tool.id === 2) { // Consultoría Especializada
      setMessages([
        {
          id: 1,
          text: `Bienvenido a Consultoría Especializada UMBRA 👨‍💼

Te conectamos con abogados expertos para casos complejos que requieren atención personalizada.

Nuestros consultores están especializados en:
• Derecho Corporativo
• Derecho Laboral  
• Derecho Civil
• Derecho Penal
• Derecho Tributario

¿Te gustaría ver los consultores disponibles o prefieres describir tu caso primero?`,
          isUser: false,
          timestamp: new Date(),
          messageType: 'text'
        }
      ]);
    } else if (tool.id === 6) { // Due Diligence Automatizado
      setMessages([
        {
          id: 1,
          text: `🏢 **Due Diligence Automatizado UMBRA**

Sistema de investigación automática con IA para empresas y personas.

**Capacidades:**
• 🔍 Consulta automática a registros públicos
• 📊 Análisis de riesgo crediticio y legal
• 🏛️ Verificación en bases gubernamentales
• 📋 Generación de reportes PDF automáticos
• ⚠️ Detección de alertas y banderas rojas

**Para comenzar:**
Ingresa el nombre de la empresa o persona a investigar, o usa los botones de acción rápida.`,
          isUser: false,
          timestamp: new Date(),
          messageType: 'due-diligence'
        }
      ]);
    } else if (tool.id === 7) { // Extracción Masiva de Datos
      setMessages([
        {
          id: 1,
          text: `📊 **Extracción Masiva de Datos Legales**

Procesamiento inteligente de múltiples documentos con IA avanzada.

**Funcionalidades:**
• 📁 Upload masivo de documentos (PDF, DOC, TXT)
• 🤖 Extracción automática de datos estructurados
• 📈 Análisis comparativo y scoring de riesgo
• 📋 Export a Excel/CSV para análisis
• ⚠️ Detección de cláusulas críticas

**Formatos soportados:** PDF, DOC, DOCX, TXT
**Límite:** Hasta 50 documentos por procesamiento

Sube tus documentos para comenzar el análisis.`,
          isUser: false,
          timestamp: new Date(),
          messageType: 'data-extraction'
        }
      ]);
    } else {
      setMessages([
        {
          id: 1,
          text: `Bienvenido a ${tool.name}. ${tool.description}. ¿En qué puedo ayudarte?`,
          isUser: false,
          timestamp: new Date()
        }
      ]);
    }
  };

  const closeChat = () => {
    setSelectedTool(null);
    setMessages([]);
    setInputMessage('');
    setIsSending(false);
    setUploadedFile(null);
    setUploadedFiles([]);
    setShowConsultants(false);
    setSelectedConsultant(null);
    setDueDiligenceResults([]);
    setExtractedData([]);
    setSearchQuery('');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleMultipleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      setUploadedFiles(prev => [...prev, ...files]);
    }
  };

  const removeUploadedFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleQuickAction = async (action: string) => {
    setIsSending(true);

    const actionMessages = {
      'analyze': 'Por favor, sube un documento para análisis completo con identificación de riesgos y recomendaciones.',
      'template': '¿Qué tipo de documento necesitas? Puedo generar contratos, cartas legales, promesas de compraventa, etc.',
      'scenario': 'Describe la situación legal que quieres simular y te mostraré posibles consecuencias según la normativa.',
      'normative': '¿Qué normativa específica necesitas consultar? Puedo buscar leyes, artículos y regulaciones vigentes.',
      'agenda': 'Te ayudo a programar recordatorios legales o agendar una consulta. ¿Qué necesitas programar?',
      'escalate': 'Te voy a conectar con nuestros consultores humanos especializados.',
      'search-entity': 'Ingresa el nombre de la empresa o persona para iniciar la investigación automática.',
      'generate-report': 'Generando reporte PDF con todos los hallazgos encontrados...',
      'process-documents': 'Iniciando procesamiento masivo de documentos con IA...',
      'export-data': 'Preparando exportación de datos extraídos a Excel/CSV...'
    };

    const userMessage: ChatMessage = {
      id: messages.length + 1,
      text: `Acción rápida: ${action}`,
      isUser: true,
      timestamp: new Date()
    };

    const botResponse: ChatMessage = {
      id: messages.length + 2,
      text: actionMessages[action as keyof typeof actionMessages] || 'Procesando solicitud...',
      isUser: false,
      timestamp: new Date(),
      messageType: action as any
    };

    setMessages(prev => [...prev, userMessage, botResponse]);

    if (action === 'escalate') {
      setTimeout(() => {
        setShowConsultants(true);
      }, 1000);
    }

    // Simulate Due Diligence search
    if (action === 'search-entity' && searchQuery) {
      setTimeout(() => {
        const mockResult: DueDiligenceResult = {
          companyName: searchQuery,
          status: 'Activa',
          riskLevel: 'medium',
          findings: [
            'Empresa registrada correctamente',
            'Sin antecedentes penales',
            'Historial crediticio regular',
            'Algunas demandas civiles menores'
          ],
          recommendations: [
            'Revisar garantías adicionales',
            'Solicitar estados financieros actualizados',
            'Verificar poderes de representación'
          ]
        };
        setDueDiligenceResults([mockResult]);
      }, 2000);
    }

    // Simulate document processing
    if (action === 'process-documents' && uploadedFiles.length > 0) {
      setTimeout(() => {
        const mockExtractedData: ExtractedData[] = uploadedFiles.map((file, index) => ({
          fileName: file.name,
          extractedFields: {
            'Tipo de Contrato': 'Compraventa',
            'Partes': 'Juan Pérez y María García',
            'Monto': '$50,000',
            'Fecha': '2024-01-15',
            'Vigencia': '12 meses'
          },
          riskScore: Math.floor(Math.random() * 100),
          criticalClauses: [
            'Cláusula de penalización excesiva',
            'Falta especificación de garantías'
          ]
        }));
        setExtractedData(mockExtractedData);
      }, 3000);
    }

    setIsSending(false);
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() && !uploadedFile && uploadedFiles.length === 0) return;

    setIsSending(true);

    let messageText = inputMessage;
    if (uploadedFile) {
      messageText += ` 📎 Archivo: ${uploadedFile.name}`;
    }
    if (uploadedFiles.length > 0) {
      messageText += ` 📁 ${uploadedFiles.length} archivos subidos`;
    }

    const userMessage: ChatMessage = {
      id: messages.length + 1,
      text: messageText,
      isUser: true,
      timestamp: new Date(),
      fileAttachment: uploadedFile?.name
    };

    const loadingMessage: ChatMessage = {
      id: messages.length + 2,
      text: "🤖 Procesando con IA especializada...",
      isUser: false,
      timestamp: new Date(),
      isLoading: true
    };

    setMessages(prev => [...prev, userMessage, loadingMessage]);
    
    // Store search query for due diligence
    if (selectedTool?.id === 6) {
      setSearchQuery(inputMessage);
    }
    
    setInputMessage('');
    setUploadedFile(null);

    try {
      const formData = new FormData();
      formData.append('message', inputMessage);
      formData.append('tool', selectedTool!.name);
      
      if (uploadedFile) {
        formData.append('file', uploadedFile);
      }

      uploadedFiles.forEach((file, index) => {
        formData.append(`files[${index}]`, file);
      });

      const response = await fetch(selectedTool!.webhookUrl, {
        method: 'POST',
        headers: {
          'ngrok-skip-browser-warning': 'true'
        },
        body: formData
      });

      const responseText = await response.text();
      
      // Enhanced response formatting
      let formattedResponse = responseText || "✅ Análisis completado exitosamente.";
      
      if (selectedTool?.id === 1) { // Chat Legal 24/7
        formattedResponse = `🤖 **Análisis UMBRA Completado**

${responseText || `He procesado tu consulta con éxito. 

**Recomendaciones:**
• Revisa los puntos destacados
• Considera las implicaciones legales mencionadas
• Si necesitas más detalles, puedo profundizar en cualquier aspecto

¿Hay algo específico en lo que quieras que me enfoque más?`}

---
💡 **Acciones disponibles:** Analizar documento | Generar plantilla | Consultar normativa | Agendar cita`;
      } else if (selectedTool?.id === 6) { // Due Diligence
        formattedResponse = `🔍 **Investigación Completada**

${responseText || `He completado la investigación automática.

**Resultados encontrados:**
• Registros públicos consultados
• Análisis de riesgo realizado
• Verificaciones gubernamentales completadas

Los resultados detallados aparecen en el panel inferior.`}`;
      } else if (selectedTool?.id === 7) { // Data Extraction
        formattedResponse = `📊 **Extracción de Datos Completada**

${responseText || `He procesado ${uploadedFiles.length} documentos exitosamente.

**Datos extraídos:**
• Campos estructurados identificados
• Análisis de riesgo calculado
• Cláusulas críticas detectadas

Los resultados están disponibles en la tabla inferior.`}`;
      }

      const botResponse: ChatMessage = {
        id: messages.length + 2,
        text: formattedResponse,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => prev.map(msg => 
        msg.isLoading ? botResponse : msg
      ));

    } catch (error) {
      const errorResponse: ChatMessage = {
        id: messages.length + 2,
        text: "❌ Error en la conexión. Por favor, intenta nuevamente o contacta a un consultor humano.",
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

  const selectConsultant = (consultant: Consultant) => {
    setSelectedConsultant(consultant);
    setShowConsultants(false);
    
    const escalationMessage: ChatMessage = {
      id: messages.length + 1,
      text: `✅ **Conectado con ${consultant.name}**

**Especialidad:** ${consultant.specialty}
**Experiencia:** ${consultant.experience}
**Rating:** ${'⭐'.repeat(Math.floor(consultant.rating))} ${consultant.rating}/5

Tu consulta ha sido escalada exitosamente. El consultor revisará tu caso y te contactará en breve.

**Próximos pasos:**
1. Recibirás una confirmación por email
2. El consultor te contactará en 15-30 minutos
3. Podrás agendar una videollamada si es necesario

¿Hay información adicional que quieras compartir sobre tu caso?`,
      isUser: false,
      timestamp: new Date(),
      messageType: 'text'
    };

    setMessages(prev => [...prev, escalationMessage]);
  };

  const exportData = (format: 'excel' | 'csv') => {
    // Simulate export functionality
    const exportMessage: ChatMessage = {
      id: messages.length + 1,
      text: `📥 **Exportación ${format.toUpperCase()} Iniciada**

Preparando archivo con todos los datos extraídos...
El archivo se descargará automáticamente cuando esté listo.

**Contenido incluido:**
• Datos estructurados de todos los documentos
• Scores de riesgo calculados
• Cláusulas críticas identificadas
• Recomendaciones de acción`,
      isUser: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, exportMessage]);
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
                INICIALIZANDO UMBRA
              </h2>
              <p className="text-gray-400 text-sm tracking-wider">
                Cargando asistente legal avanzado...
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
                Advanced Legal Intelligence
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
                    placeholder="Ingresa UMBRA"
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
                ACCEDER AL SISTEMA
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Advanced Chat Interface
  const renderAdvancedChatInterface = () => {
    if (!selectedTool) return null;

    const isAdvancedChat = selectedTool.id === 1; // Chat Legal 24/7
    const isConsultation = selectedTool.id === 2; // Consultoría
    const isDueDiligence = selectedTool.id === 6; // Due Diligence
    const isDataExtraction = selectedTool.id === 7; // Data Extraction

    return (
      <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
        <div className="bg-gradient-to-br from-gray-900/90 to-black/90 rounded-xl shadow-2xl w-full max-w-5xl h-[80vh] flex flex-col border border-yellow-600/20 animate-slideUp">
          
          {/* Enhanced Header */}
          <div className="flex items-center justify-between p-4 border-b border-yellow-600/20 bg-gradient-to-r from-gray-900/80 to-black/80">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-yellow-600/20 to-yellow-700/30 rounded-lg">
                <selectedTool.icon className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <h3 className="font-light text-yellow-400 text-xl tracking-wide">
                  {selectedTool.name}
                </h3>
                <p className="text-xs text-gray-500 uppercase tracking-wider">{selectedTool.category}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {(isAdvancedChat || isDueDiligence || isDataExtraction) && (
                <div className="flex items-center space-x-1 text-xs text-green-400">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>IA Activa</span>
                </div>
              )}
              <button
                onClick={closeChat}
                className="text-gray-400 hover:text-yellow-400 transition-colors duration-200 hover:rotate-90 transform"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Actions for Advanced Chat */}
          {isAdvancedChat && (
            <div className="p-3 border-b border-yellow-600/10 bg-gradient-to-r from-gray-900/40 to-black/60">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleQuickAction('analyze')}
                  className="flex items-center space-x-1 px-3 py-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 rounded-full text-xs transition-all duration-200 hover:scale-105"
                >
                  <FileText className="w-3 h-3" />
                  <span>Analizar Documento</span>
                </button>
                <button
                  onClick={() => handleQuickAction('template')}
                  className="flex items-center space-x-1 px-3 py-1 bg-green-600/20 hover:bg-green-600/30 text-green-300 rounded-full text-xs transition-all duration-200 hover:scale-105"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Generar Plantilla</span>
                </button>
                <button
                  onClick={() => handleQuickAction('scenario')}
                  className="flex items-center space-x-1 px-3 py-1 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 rounded-full text-xs transition-all duration-200 hover:scale-105"
                >
                  <Zap className="w-3 h-3" />
                  <span>Simular Escenario</span>
                </button>
                <button
                  onClick={() => handleQuickAction('normative')}
                  className="flex items-center space-x-1 px-3 py-1 bg-orange-600/20 hover:bg-orange-600/30 text-orange-300 rounded-full text-xs transition-all duration-200 hover:scale-105"
                >
                  <BookOpen className="w-3 h-3" />
                  <span>Buscar Normativa</span>
                </button>
                <button
                  onClick={() => handleQuickAction('agenda')}
                  className="flex items-center space-x-1 px-3 py-1 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 rounded-full text-xs transition-all duration-200 hover:scale-105"
                >
                  <Calendar className="w-3 h-3" />
                  <span>Agendar</span>
                </button>
                <button
                  onClick={() => handleQuickAction('escalate')}
                  className="flex items-center space-x-1 px-3 py-1 bg-red-600/20 hover:bg-red-600/30 text-red-300 rounded-full text-xs transition-all duration-200 hover:scale-105"
                >
                  <Users className="w-3 h-3" />
                  <span>Consultor Humano</span>
                </button>
              </div>
            </div>
          )}

          {/* Due Diligence Quick Actions */}
          {isDueDiligence && (
            <div className="p-3 border-b border-yellow-600/10 bg-gradient-to-r from-gray-900/40 to-black/60">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleQuickAction('search-entity')}
                  className="flex items-center space-x-1 px-3 py-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 rounded-full text-xs transition-all duration-200 hover:scale-105"
                >
                  <Search className="w-3 h-3" />
                  <span>Buscar Entidad</span>
                </button>
                <button
                  onClick={() => handleQuickAction('generate-report')}
                  className="flex items-center space-x-1 px-3 py-1 bg-green-600/20 hover:bg-green-600/30 text-green-300 rounded-full text-xs transition-all duration-200 hover:scale-105"
                >
                  <FileText className="w-3 h-3" />
                  <span>Generar Reporte</span>
                </button>
              </div>
            </div>
          )}

          {/* Data Extraction Quick Actions */}
          {isDataExtraction && (
            <div className="p-3 border-b border-yellow-600/10 bg-gradient-to-r from-gray-900/40 to-black/60">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleQuickAction('process-documents')}
                  className="flex items-center space-x-1 px-3 py-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 rounded-full text-xs transition-all duration-200 hover:scale-105"
                >
                  <Database className="w-3 h-3" />
                  <span>Procesar Documentos</span>
                </button>
                <button
                  onClick={() => exportData('excel')}
                  className="flex items-center space-x-1 px-3 py-1 bg-green-600/20 hover:bg-green-600/30 text-green-300 rounded-full text-xs transition-all duration-200 hover:scale-105"
                >
                  <Download className="w-3 h-3" />
                  <span>Export Excel</span>
                </button>
                <button
                  onClick={() => exportData('csv')}
                  className="flex items-center space-x-1 px-3 py-1 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 rounded-full text-xs transition-all duration-200 hover:scale-105"
                >
                  <Download className="w-3 h-3" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>
          )}

          {/* Consultants Panel */}
          {showConsultants && (
            <div className="p-4 border-b border-yellow-600/10 bg-gradient-to-r from-gray-900/60 to-black/80">
              <h4 className="text-yellow-400 text-sm font-medium mb-3">Consultores Disponibles:</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {availableConsultants.map((consultant) => (
                  <div
                    key={consultant.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                      consultant.available
                        ? 'border-green-600/30 bg-green-900/20 hover:bg-green-900/30 hover:scale-105'
                        : 'border-gray-600/30 bg-gray-900/20 opacity-50 cursor-not-allowed'
                    }`}
                    onClick={() => consultant.available && selectConsultant(consultant)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-yellow-600 to-yellow-700 rounded-full flex items-center justify-center text-black font-bold text-sm">
                        {consultant.avatar}
                      </div>
                      <div className="flex-1">
                        <h5 className="text-white text-sm font-medium">{consultant.name}</h5>
                        <p className="text-gray-400 text-xs">{consultant.specialty}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="flex text-yellow-400 text-xs">
                            {'⭐'.repeat(Math.floor(consultant.rating))}
                          </div>
                          <span className="text-gray-500 text-xs">{consultant.experience}</span>
                        </div>
                      </div>
                      <div className={`w-2 h-2 rounded-full ${consultant.available ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Main Content Area */}
          <div className="flex-1 flex overflow-hidden">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-black/50 to-gray-900/50">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} animate-messageSlide`}
                >
                  <div className="flex items-start space-x-2 max-w-2xl">
                    {!message.isUser && (
                      <div className="w-8 h-8 bg-gradient-to-br from-yellow-600 to-yellow-700 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        {isAdvancedChat ? <Bot className="w-4 h-4 text-black" /> : <selectedTool.icon className="w-4 h-4 text-black" />}
                      </div>
                    )}
                    <div
                      className={`px-4 py-3 rounded-lg text-sm ${
                        message.isUser
                          ? 'bg-gradient-to-r from-yellow-600 to-yellow-700 text-black font-medium'
                          : `bg-gray-800/60 text-gray-200 border border-yellow-600/20 ${
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
                      <div className="whitespace-pre-wrap">{message.text}</div>
                      {message.isLoading && (
                        <div className="flex space-x-1 mt-2">
                          <div className="w-1 h-1 bg-yellow-400 rounded-full animate-bounce"></div>
                          <div className="w-1 h-1 bg-yellow-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-1 h-1 bg-yellow-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                      )}
                    </div>
                    {message.isUser && (
                      <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <User className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Results Panel for Due Diligence and Data Extraction */}
            {(isDueDiligence && dueDiligenceResults.length > 0) || (isDataExtraction && extractedData.length > 0) ? (
              <div className="w-1/3 border-l border-yellow-600/20 bg-gradient-to-b from-gray-900/60 to-black/80 overflow-y-auto">
                {isDueDiligence && dueDiligenceResults.length > 0 && (
                  <div className="p-4">
                    <h4 className="text-yellow-400 text-sm font-medium mb-3">Resultados de Investigación</h4>
                    {dueDiligenceResults.map((result, index) => (
                      <div key={index} className="bg-gray-800/40 rounded-lg p-3 mb-3 border border-yellow-600/10">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="text-white text-sm font-medium">{result.companyName}</h5>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            result.riskLevel === 'low' ? 'bg-green-600/20 text-green-300' :
                            result.riskLevel === 'medium' ? 'bg-yellow-600/20 text-yellow-300' :
                            'bg-red-600/20 text-red-300'
                          }`}>
                            {result.riskLevel.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-gray-400 text-xs mb-2">Estado: {result.status}</p>
                        <div className="space-y-2">
                          <div>
                            <p className="text-gray-300 text-xs font-medium">Hallazgos:</p>
                            <ul className="text-gray-400 text-xs space-y-1">
                              {result.findings.map((finding, i) => (
                                <li key={i}>• {finding}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="text-gray-300 text-xs font-medium">Recomendaciones:</p>
                            <ul className="text-gray-400 text-xs space-y-1">
                              {result.recommendations.map((rec, i) => (
                                <li key={i}>• {rec}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {isDataExtraction && extractedData.length > 0 && (
                  <div className="p-4">
                    <h4 className="text-yellow-400 text-sm font-medium mb-3">Datos Extraídos</h4>
                    {extractedData.map((data, index) => (
                      <div key={index} className="bg-gray-800/40 rounded-lg p-3 mb-3 border border-yellow-600/10">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="text-white text-sm font-medium truncate">{data.fileName}</h5>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            data.riskScore < 30 ? 'bg-green-600/20 text-green-300' :
                            data.riskScore < 70 ? 'bg-yellow-600/20 text-yellow-300' :
                            'bg-red-600/20 text-red-300'
                          }`}>
                            {data.riskScore}%
                          </span>
                        </div>
                        <div className="space-y-2">
                          <div>
                            <p className="text-gray-300 text-xs font-medium">Campos Extraídos:</p>
                            <div className="text-gray-400 text-xs space-y-1">
                              {Object.entries(data.extractedFields).map(([key, value]) => (
                                <div key={key} className="flex justify-between">
                                  <span>{key}:</span>
                                  <span className="text-white">{value}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          {data.criticalClauses.length > 0 && (
                            <div>
                              <p className="text-red-300 text-xs font-medium">Cláusulas Críticas:</p>
                              <ul className="text-red-400 text-xs space-y-1">
                                {data.criticalClauses.map((clause, i) => (
                                  <li key={i}>• {clause}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : null}
          </div>

          {/* Enhanced Input */}
          <div className="p-4 border-t border-yellow-600/20 bg-gradient-to-r from-gray-900/80 to-black/80">
            {/* Multiple Files Display for Data Extraction */}
            {isDataExtraction && uploadedFiles.length > 0 && (
              <div className="mb-2 max-h-20 overflow-y-auto">
                <div className="flex flex-wrap gap-2">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center space-x-2 text-xs text-yellow-300 bg-yellow-600/10 px-2 py-1 rounded-lg">
                      <FileText className="w-3 h-3" />
                      <span className="truncate max-w-32">{file.name}</span>
                      <button
                        onClick={() => removeUploadedFile(index)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Single File Display */}
            {uploadedFile && !isDataExtraction && (
              <div className="mb-2 flex items-center space-x-2 text-xs text-yellow-300 bg-yellow-600/10 px-3 py-2 rounded-lg">
                <FileText className="w-4 h-4" />
                <span>{uploadedFile.name}</span>
                <button
                  onClick={() => setUploadedFile(null)}
                  className="text-red-400 hover:text-red-300"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}

            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isSending}
                placeholder={
                  isDueDiligence ? "Ingresa nombre de empresa o persona a investigar..." :
                  isDataExtraction ? "Describe el tipo de datos a extraer..." :
                  isAdvancedChat ? "Describe tu consulta legal o sube un documento..." : 
                  "Escribe tu consulta..."
                }
                className="flex-1 bg-black/40 text-yellow-100 px-4 py-3 rounded-lg border border-yellow-600/30 focus:border-yellow-400 focus:outline-none disabled:opacity-50 text-sm placeholder-gray-500"
              />
              
              {/* File Upload Button */}
              <label className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-3 rounded-lg transition-all duration-200 cursor-pointer hover:scale-105">
                <Upload className="w-4 h-4" />
                <input
                  type="file"
                  onChange={isDataExtraction ? handleMultipleFileUpload : handleFileUpload}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.txt"
                  multiple={isDataExtraction}
                />
              </label>
              
              <button
                onClick={sendMessage}
                disabled={isSending || (!inputMessage.trim() && !uploadedFile && uploadedFiles.length === 0)}
                className="bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-500 hover:to-yellow-600 text-black px-4 py-3 rounded-lg transition-all duration-200 disabled:opacity-50 font-medium transform hover:scale-105"
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

      {/* Enhanced Header */}
      <header className="relative py-8 px-8 text-center border-b border-yellow-600/20 animate-fadeInDown">
        <div className="absolute inset-0 bg-gradient-to-b from-yellow-900/5 to-transparent"></div>
        <div className="relative">
          <h1 className="text-5xl font-thin tracking-[0.3em] mb-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 animate-glow">
            UMBRA
          </h1>
          <p className="text-base text-gray-400 font-light tracking-[0.2em] uppercase animate-fadeIn">
            Advanced Legal Intelligence • IA Avanzada + Due Diligence + Extracción Masiva
          </p>
          <div className="mt-3 w-24 h-px bg-gradient-to-r from-transparent via-yellow-600 to-transparent mx-auto animate-expand"></div>
        </div>
      </header>

      {/* Core Functions Dashboard */}
      <main className="px-6 py-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Priority Grid - 2x4 Layout for Core Functions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {coreTools.map((tool, index) => (
              <div
                key={tool.id}
                className={`group relative bg-gradient-to-br from-gray-900/60 to-black/80 backdrop-blur-sm rounded-xl p-6 border transition-all duration-300 cursor-pointer transform hover:scale-105 hover:-translate-y-2 animate-cardSlideUp shadow-lg ${
                  tool.id === 1 
                    ? 'border-yellow-400/60 hover:border-yellow-300/80 shadow-yellow-600/20' 
                    : tool.id === 2
                    ? 'border-blue-400/60 hover:border-blue-300/80 shadow-blue-600/20'
                    : (tool.id === 6 || tool.id === 7)
                    ? 'border-purple-400/60 hover:border-purple-300/80 shadow-purple-600/20'
                    : 'border-yellow-600/30 hover:border-yellow-400/80 hover:shadow-yellow-600/20'
                }`}
                onClick={() => openChat(tool)}
                style={{
                  animationDelay: `${index * 0.1}s`
                }}
              >
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl ${
                  tool.id === 1 
                    ? 'bg-gradient-to-br from-yellow-600/0 to-yellow-600/20' 
                    : tool.id === 2
                    ? 'bg-gradient-to-br from-blue-600/0 to-blue-600/15'
                    : (tool.id === 6 || tool.id === 7)
                    ? 'bg-gradient-to-br from-purple-600/0 to-purple-600/15'
                    : 'bg-gradient-to-br from-yellow-600/0 to-yellow-600/15'
                }`}></div>
                
                <div className="relative z-10 text-center">
                  {/* Enhanced Icon for Advanced Tools */}
                  <div className="mb-4 flex justify-center">
                    <div className={`p-3 rounded-lg group-hover:scale-110 transition-all duration-300 ${
                      tool.id === 1 
                        ? 'bg-gradient-to-br from-yellow-500/30 to-yellow-600/40 group-hover:from-yellow-400/40 group-hover:to-yellow-500/50' 
                        : tool.id === 2
                        ? 'bg-gradient-to-br from-blue-500/30 to-blue-600/40 group-hover:from-blue-400/40 group-hover:to-blue-500/50'
                        : (tool.id === 6 || tool.id === 7)
                        ? 'bg-gradient-to-br from-purple-500/30 to-purple-600/40 group-hover:from-purple-400/40 group-hover:to-purple-500/50'
                        : 'bg-gradient-to-br from-yellow-600/20 to-yellow-700/30 group-hover:from-yellow-500/30 group-hover:to-yellow-600/40'
                    }`}>
                      <tool.icon className={`w-8 h-8 transition-colors duration-300 ${
                        tool.id === 1 
                          ? 'text-yellow-300 group-hover:text-yellow-200' 
                          : tool.id === 2
                          ? 'text-blue-300 group-hover:text-blue-200'
                          : (tool.id === 6 || tool.id === 7)
                          ? 'text-purple-300 group-hover:text-purple-200'
                          : 'text-yellow-400 group-hover:text-yellow-300'
                      }`} />
                    </div>
                  </div>
                  
                  {/* Tool Name */}
                  <h3 className={`text-sm font-medium mb-2 tracking-wide transition-colors duration-300 leading-tight ${
                    tool.id === 1 
                      ? 'text-yellow-200 group-hover:text-yellow-100' 
                      : tool.id === 2
                      ? 'text-blue-200 group-hover:text-blue-100'
                      : (tool.id === 6 || tool.id === 7)
                      ? 'text-purple-200 group-hover:text-purple-100'
                      : 'text-yellow-100 group-hover:text-yellow-300'
                  }`}>
                    {tool.name}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-xs text-gray-400 mb-3 group-hover:text-gray-300 transition-colors duration-300 leading-relaxed">
                    {tool.description}
                  </p>
                  
                  {/* Enhanced Category Badge */}
                  <div className={`inline-block px-2 py-1 rounded-full ${
                    tool.id === 1 
                      ? 'bg-yellow-500/20' 
                      : tool.id === 2
                      ? 'bg-blue-500/20'
                      : (tool.id === 6 || tool.id === 7)
                      ? 'bg-purple-500/20'
                      : 'bg-yellow-600/20'
                  }`}>
                    <span className={`text-[10px] uppercase tracking-wider font-medium ${
                      tool.id === 1 
                        ? 'text-yellow-200' 
                        : tool.id === 2
                        ? 'text-blue-200'
                        : (tool.id === 6 || tool.id === 7)
                        ? 'text-purple-200'
                        : 'text-yellow-300'
                    }`}>
                      {tool.category}
                    </span>
                  </div>
                  
                  {/* Priority Indicator */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className={`w-2 h-2 rounded-full animate-ping ${
                      tool.id === 1 
                        ? 'bg-yellow-300' 
                        : tool.id === 2
                        ? 'bg-blue-300'
                        : (tool.id === 6 || tool.id === 7)
                        ? 'bg-purple-300'
                        : 'bg-yellow-400'
                    }`}></div>
                  </div>

                  {/* Special Badge for Advanced Tools */}
                  {(tool.id === 1 || tool.id === 2 || tool.id === 6 || tool.id === 7) && (
                    <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className={`px-2 py-1 rounded-full text-[8px] font-bold ${
                        tool.id === 1 
                          ? 'bg-yellow-400 text-black' 
                          : tool.id === 2
                          ? 'bg-blue-400 text-black'
                          : 'bg-purple-400 text-black'
                      }`}>
                        {tool.id === 1 ? 'IA+' : tool.id === 2 ? 'EXPERT' : 'AI'}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Enhanced Core Stats */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center space-x-6 bg-gradient-to-r from-gray-900/40 to-black/60 backdrop-blur-sm rounded-lg px-8 py-4 border border-yellow-600/20">
              <div className="text-center">
                <div className="text-xl font-light text-yellow-400">8</div>
                <div className="text-xs text-gray-500 uppercase tracking-wider">Funciones Core</div>
              </div>
              <div className="w-px h-10 bg-yellow-600/30"></div>
              <div className="text-center">
                <div className="text-xl font-light text-yellow-400">24/7</div>
                <div className="text-xs text-gray-500 uppercase tracking-wider">IA Disponible</div>
              </div>
              <div className="w-px h-10 bg-yellow-600/30"></div>
              <div className="text-center">
                <div className="text-xl font-light text-blue-400">Expert</div>
                <div className="text-xs text-gray-500 uppercase tracking-wider">Consultores</div>
              </div>
              <div className="w-px h-10 bg-yellow-600/30"></div>
              <div className="text-center">
                <div className="text-xl font-light text-purple-400">AI+</div>
                <div className="text-xs text-gray-500 uppercase tracking-wider">Due Diligence</div>
              </div>
              <div className="w-px h-10 bg-yellow-600/30"></div>
              <div className="text-center">
                <div className="text-xl font-light text-green-400">Mass</div>
                <div className="text-xs text-gray-500 uppercase tracking-wider">Data Extract</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Advanced Chat Interface */}
      {renderAdvancedChatInterface()}

      {/* Enhanced Footer */}
      <footer className="border-t border-yellow-600/10 py-4 text-center bg-gradient-to-t from-gray-900/30 to-transparent relative z-10">
        <p className="text-gray-600 text-xs font-light tracking-[0.15em] uppercase">
          © 2025 UMBRA • Advanced Legal Intelligence • IA + Human Expertise + Due Diligence + Mass Data Processing
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