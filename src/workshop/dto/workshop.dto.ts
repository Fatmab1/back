import { MachineDto } from "src/machine/dto/machine.dto";

export class Workshop {
  id_workshop : number ;
  nom: string;
  id_uniteF: number;
  machines : MachineDto[]
  }
  