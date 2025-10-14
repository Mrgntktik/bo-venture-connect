import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AIChat } from "@/components/AIChat";

export function ChatBubble() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Chat flotante */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 animate-scale-in">
          <Card className="w-[400px] h-[600px] shadow-2xl border-2 border-primary/20 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b bg-primary text-primary-foreground">
              <h3 className="font-semibold flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Chat con IA
              </h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 hover:bg-primary-foreground/20 text-primary-foreground"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-hidden">
              <AIChat compact />
            </div>
          </Card>
        </div>
      )}

      {/* Burbuja azul flotante */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-2xl z-50 bg-blue-600 hover:bg-blue-700 transition-all hover:scale-110 animate-fade-in"
        size="icon"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </Button>
    </>
  );
}
