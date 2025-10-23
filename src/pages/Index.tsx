import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, CheckCircle2, XCircle, Lock, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [senha, setSenha] = useState("");
  const [resultado, setResultado] = useState<{ valida: boolean; erros?: string[] } | null>(null);
  const [loading, setLoading] = useState(false);

  const validarSenha = async () => {
    setLoading(true);
    setResultado(null);

    try {
      const { data, error } = await supabase.functions.invoke('validar-senha', {
        body: { senha }
      });

      if (error) throw error;
      setResultado(data);
    } catch (error) {
      console.error('Erro ao validar senha:', error);
      setResultado({ 
        valida: false, 
        erros: ["Erro ao validar senha. Tente novamente."] 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      validarSenha();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="rounded-full bg-primary/10 p-6 backdrop-blur-sm border border-primary/20">
              <Shield className="w-12 h-12 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Validador de Senhas
          </h1>
          <p className="text-muted-foreground text-lg">
            Microsserviço de validação de senhas seguras
          </p>
        </div>

        {/* Main Card */}
        <Card className="border-border/50 backdrop-blur-sm bg-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Testar Validação
            </CardTitle>
            <CardDescription>
              Digite uma senha para verificar se atende aos requisitos de segurança
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Input */}
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Digite a senha..."
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                onKeyPress={handleKeyPress}
                className="h-12 text-lg bg-secondary/50 border-border/50"
              />
              <Button 
                onClick={validarSenha} 
                disabled={loading}
                className="w-full h-12 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Validando...
                  </>
                ) : (
                  "Validar Senha"
                )}
              </Button>
            </div>

            {/* Requisitos */}
            <div className="rounded-lg border border-border/50 bg-secondary/30 p-4 space-y-2">
              <p className="font-medium text-sm text-muted-foreground mb-3">Requisitos:</p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2 text-foreground/80">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Mínimo de 8 caracteres
                </li>
                <li className="flex items-center gap-2 text-foreground/80">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Pelo menos 1 letra maiúscula
                </li>
                <li className="flex items-center gap-2 text-foreground/80">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Pelo menos 1 número
                </li>
                <li className="flex items-center gap-2 text-foreground/80">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Pelo menos 1 símbolo especial (!@#$%^&*()_+-=[]{};\':"|,.&lt;&gt;/?)
                </li>
              </ul>
            </div>

            {/* Resultado */}
            {resultado && (
              <Alert 
                className={`border-2 ${
                  resultado.valida 
                    ? 'border-success/50 bg-success/10' 
                    : 'border-destructive/50 bg-destructive/10'
                }`}
              >
                <div className="flex items-start gap-3">
                  {resultado.valida ? (
                    <CheckCircle2 className="w-6 h-6 text-success shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-6 h-6 text-destructive shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1 space-y-2">
                    <AlertDescription className={`font-medium ${
                      resultado.valida ? 'text-success' : 'text-destructive'
                    }`}>
                      {resultado.valida ? '✓ Senha Válida!' : '✗ Senha Inválida'}
                    </AlertDescription>
                    {resultado.erros && resultado.erros.length > 0 && (
                      <ul className="space-y-1 text-sm">
                        {resultado.erros.map((erro, index) => (
                          <li key={index} className="text-foreground/80">
                            • {erro}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* API Info */}
        <Card className="border-border/50 backdrop-blur-sm bg-card/50">
          <CardHeader>
            <CardTitle className="text-lg">Endpoint API</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-mono bg-secondary px-2 py-1 rounded text-primary">POST</span>
                <code className="text-xs bg-secondary/50 px-3 py-1 rounded">/validar-senha</code>
              </div>
              
              <div className="text-sm space-y-2">
                <p className="text-muted-foreground">Exemplo de requisição:</p>
                <pre className="bg-secondary/50 p-3 rounded-lg overflow-x-auto text-xs">
                  <code>{`{
  "senha": "SuaSenha123!"
}`}</code>
                </pre>
              </div>

              <div className="text-sm space-y-2">
                <p className="text-muted-foreground">Resposta (senha inválida):</p>
                <pre className="bg-secondary/50 p-3 rounded-lg overflow-x-auto text-xs">
                  <code>{`{
  "valida": false,
  "erros": [
    "A senha deve ter no mínimo 8 caracteres",
    "A senha deve conter pelo menos uma letra maiúscula",
    "A senha deve conter pelo menos um número",
    "A senha deve conter pelo menos um símbolo especial (!@#$%^&*()_+-=[]{};\':"|,.<>/?)"
  ]
}`}</code>
                </pre>
              </div>

              <div className="text-sm space-y-2">
                <p className="text-muted-foreground">Senha válida:</p>
                <pre className="bg-secondary/50 p-3 rounded-lg overflow-x-auto text-xs">
                  <code>{`{
  "valida": true
}`}</code>
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
