import { AIChat } from "@/components/AIChat";

export default function AIAssistant() {
  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="container mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Asistente de IA</h1>
          <p className="text-muted-foreground">
            Chatea con nuestra IA para obtener ayuda sobre BLV Games
          </p>
        </div>
        <AIChat />
      </div>
    </div>
  );
}
