import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Lock, Server, Code } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ValidationResult {
  valida: boolean;
  erros?: string[];
}

const Index = () => {
  const [senha, setSenha] = useState("");
  const [resultado, setResultado] = useState<ValidationResult | null>(null);
  const [loading, setLoading] = useState(false);

  const validarSenha = async () => {
    if (!senha.trim()) {
      toast.error("Digite uma senha para validar");
      return;
    }

    setLoading(true);
    setResultado(null);

    try {
      const { data, error } = await supabase.functions.invoke('validar-senha', {
        body: { senha }
      });

      if (error) throw error;

      setResultado(data as ValidationResult);
      
      if (data.valida) {
        toast.success("Senha válida!");
      } else {
        toast.error("Senha inválida");
      }
    } catch (error) {
      console.error('Erro ao validar senha:', error);
      toast.error("Erro ao validar senha");
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
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Server className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Validador de Senhas
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Microsserviço de validação de senhas com backend
          </p>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <Badge variant="secondary" className="gap-1">
              <Code className="w-3 h-3" />
              Node.js + Deno
            </Badge>
            <Badge variant="outline">Edge Functions</Badge>
            <Badge variant="outline">Regex</Badge>
          </div>
        </div>

        {/* Main Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-primary" />
              Testar Validação
            </CardTitle>
            <CardDescription>
              Digite uma senha para validar no backend
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Digite a senha..."
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                onKeyPress={handleKeyPress}
                className="font-mono"
              />
              <Button onClick={validarSenha} disabled={loading}>
                {loading ? "Validando..." : "Validar"}
              </Button>
            </div>

            {resultado && (
              <Alert className={resultado.valida ? "border-accent" : "border-destructive"}>
                <div className="flex items-start gap-3">
                  {resultado.valida ? (
                    <CheckCircle2 className="w-5 h-5 text-accent mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-destructive mt-0.5" />
                  )}
                  <div className="flex-1 space-y-2">
                    <AlertDescription className="font-semibold">
                      {resultado.valida ? "✓ Senha válida!" : "✗ Senha inválida"}
                    </AlertDescription>
                    {resultado.erros && resultado.erros.length > 0 && (
                      <ul className="space-y-1 text-sm">
                        {resultado.erros.map((erro, index) => (
                          <li key={index} className="text-muted-foreground">
                            • {erro}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </Alert>
            )}

            <div className="pt-4 space-y-3 text-sm border-t border-border">
              <p className="font-semibold text-foreground">Regras de validação:</p>
              <ul className="space-y-1 text-muted-foreground">
                <li>✓ Mínimo de 8 caracteres</li>
                <li>✓ Pelo menos 1 letra maiúscula</li>
                <li>✓ Pelo menos 1 número</li>
                <li>✓ Pelo menos 1 caractere especial (!@#$%^&*)</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Documentation Card */}
        <Card>
          <CardHeader>
            <CardTitle>Por que validar no backend?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Mesmo com validação no frontend, <strong className="text-foreground">a validação no backend é essencial</strong> por várias razões críticas:
            </p>
            
            <div className="space-y-3">
              <div className="p-3 bg-muted rounded-lg">
                <h3 className="font-semibold text-foreground mb-1">🔒 Segurança</h3>
                <p className="text-sm">
                  O frontend pode ser manipulado. Usuários mal-intencionados podem desabilitar o JavaScript, 
                  modificar o código ou usar ferramentas como cURL/Postman para enviar dados diretamente à API, 
                  ignorando completamente a validação do frontend.
                </p>
              </div>

              <div className="p-3 bg-muted rounded-lg">
                <h3 className="font-semibold text-foreground mb-1">✅ Integridade dos dados</h3>
                <p className="text-sm">
                  O backend é a última linha de defesa. Garantir que apenas dados válidos entrem no banco 
                  de dados previne inconsistências, corrupção de dados e problemas de segurança.
                </p>
              </div>

              <div className="p-3 bg-muted rounded-lg">
                <h3 className="font-semibold text-foreground mb-1">🌐 Múltiplos clientes</h3>
                <p className="text-sm">
                  APIs podem ser consumidas por diferentes aplicações (web, mobile, desktop). 
                  A validação no backend garante regras consistentes independentemente do cliente.
                </p>
              </div>

              <div className="p-3 bg-muted rounded-lg">
                <h3 className="font-semibold text-foreground mb-1">📜 Compliance e auditoria</h3>
                <p className="text-sm">
                  Muitas regulamentações (LGPD, GDPR) exigem que a validação aconteça no servidor. 
                  Logs do backend podem comprovar que as regras foram aplicadas.
                </p>
              </div>
            </div>

            <p className="pt-2 border-t border-border">
              <strong className="text-foreground">Conclusão:</strong> A validação no frontend melhora a experiência do usuário com 
              feedback imediato, mas a validação no backend é <strong className="text-foreground">obrigatória</strong> para 
              garantir a segurança e integridade do sistema.
            </p>
          </CardContent>
        </Card>

        {/* API Documentation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="w-5 h-5" />
              Documentação da API
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <p className="text-sm font-semibold text-foreground mb-2">Endpoint:</p>
                <code className="block p-3 bg-muted rounded text-sm font-mono">
                  POST /validar-senha
                </code>
              </div>

              <div>
                <p className="text-sm font-semibold text-foreground mb-2">Request Body:</p>
                <pre className="p-3 bg-muted rounded text-sm font-mono overflow-x-auto">
{`{
  "senha": "MinhaSenh@123"
}`}
                </pre>
              </div>

              <div>
                <p className="text-sm font-semibold text-foreground mb-2">Response (válida):</p>
                <pre className="p-3 bg-muted rounded text-sm font-mono overflow-x-auto">
{`{
  "valida": true
}`}
                </pre>
              </div>

              <div>
                <p className="text-sm font-semibold text-foreground mb-2">Response (inválida):</p>
                <pre className="p-3 bg-muted rounded text-sm font-mono overflow-x-auto">
{`{
  "valida": false,
  "erros": [
    "A senha deve ter no mínimo 8 caracteres",
    "A senha deve conter pelo menos 1 número"
  ]
}`}
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
