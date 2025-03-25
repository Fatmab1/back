import { CapteurDto } from "src/capteur/dto/Capteur.dto";

export class MachineDto {
  id_machine: number;
  nom: string;
  id_workshop: number;
  capteurs : CapteurDto[]
  }
  