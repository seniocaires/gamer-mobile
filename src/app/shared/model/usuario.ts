import { ConfiguracaoUsuario } from "./configuracao-usuario";

export class Usuario {
  id: number;
  nome: string;
  configuracao: ConfiguracaoUsuario;

  constructor() {
    this.configuracao = new ConfiguracaoUsuario();
  }
}
