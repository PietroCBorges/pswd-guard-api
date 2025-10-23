import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ValidacaoRequest {
  senha: string;
}

interface ValidacaoResponse {
  valida: boolean;
  erros?: string[];
}

function validarSenha(senha: string): ValidacaoResponse {
  const erros: string[] = [];

  // Regex para cada regra
  const temMinimo8Caracteres = /.{8,}/;
  const temMaiuscula = /[A-Z]/;
  const temNumero = /[0-9]/;
  const temEspecial = /[!@#$%^&*]/;

  if (!temMinimo8Caracteres.test(senha)) {
    erros.push("A senha deve ter no mínimo 8 caracteres");
  }

  if (!temMaiuscula.test(senha)) {
    erros.push("A senha deve conter pelo menos 1 letra maiúscula");
  }

  if (!temNumero.test(senha)) {
    erros.push("A senha deve conter pelo menos 1 número");
  }

  if (!temEspecial.test(senha)) {
    erros.push("A senha deve conter pelo menos 1 caractere especial (!@#$%^&*)");
  }

  if (erros.length === 0) {
    return { valida: true };
  }

  return { valida: false, erros };
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Recebida requisição para validar senha');

    const { senha }: ValidacaoRequest = await req.json();

    if (!senha || typeof senha !== 'string') {
      console.error('Senha inválida ou não fornecida');
      return new Response(
        JSON.stringify({ 
          valida: false, 
          erros: ["Campo 'senha' é obrigatório e deve ser uma string"] 
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log('Validando senha...');
    const resultado = validarSenha(senha);
    console.log('Resultado da validação:', resultado);

    return new Response(JSON.stringify(resultado), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Erro ao processar requisição:', error);
    return new Response(
      JSON.stringify({ 
        valida: false, 
        erros: ["Erro interno do servidor"] 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
