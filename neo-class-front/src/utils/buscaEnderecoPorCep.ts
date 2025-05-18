export type EnderecoViaCep = {
  uf: string;
  cidade: string;
  rua: string;
  bairro: string;
}
export async function buscaEnderecoPorCep(cep: string): Promise<EnderecoViaCep | null> {
  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    if (!response.ok) {
      throw new Error("Erro ao buscar o CEP");
    }
    const data = await response.json();
    if (data.erro) {
      return null;
    }
    return {
      uf: data.uf,
      cidade: data.localidade,
      rua: data.logradouro,
      bairro: data.bairro,
    };
  } catch (error) {
    console.error("Erro ao buscar o CEP:", error);
    return null;
  }
}