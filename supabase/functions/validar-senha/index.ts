import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ValidacaoResponse {
  valida: boolean;
  erros?: string[];
}

function validarSenha(senha: string): ValidacaoResponse {
  console.log('Validando senha...');
  const erros: string[] = [];

  // Verificar comprimento mínimo de 8 caracteres
  if (senha.length < 8) {
    erros.push('A senha deve ter no mínimo 8 caracteres');
  }

  // Verificar se tem pelo menos uma letra maiúscula
  if (!/[A-Z]/.test(senha)) {
    erros.push('A senha deve conter pelo menos uma letra maiúscula');
  }

  // Verificar se tem pelo menos um número
  if (!/[0-9]/.test(senha)) {
    erros.push('A senha deve conter pelo menos um número');
  }

  // Verificar se tem pelo menos um símbolo especial
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(senha)) {
    erros.push('A senha deve conter pelo menos um símbolo especial (!@#$%^&*()_+-=[]{};\':"|,.<>/?)');
  }

  const valida = erros.length === 0;
  console.log(`Validação concluída: ${valida ? 'válida' : 'inválida'}`);
  
  if (valida) {
    return { valida: true };
  } else {
    return { valida: false, erros };
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Requisição recebida:', req.method);

    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ 
          valida: false, 
          erros: ['Método não permitido. Use POST'] 
        }),
        {
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const body = await req.json();
    console.log('Body recebido');

    if (!body.senha) {
      return new Response(
        JSON.stringify({ 
          valida: false, 
          erros: ['O campo senha é obrigatório'] 
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const resultado = validarSenha(body.senha);

    return new Response(
      JSON.stringify(resultado),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Erro ao processar requisição:', error);
    return new Response(
      JSON.stringify({ 
        valida: false, 
        erros: ['Erro ao processar a requisição'] 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
