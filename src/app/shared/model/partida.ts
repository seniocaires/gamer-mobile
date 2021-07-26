import { Usuario } from "./usuario";

export class Partida {
  id: number;
  inicio: string;
  termino: string;
  atualizacao: string;
  pontos: number;
  usuario: Usuario;
}
