import type { WhoAmI } from "../schemas/whoami";

type WhoAmIViewModel = {
  name: string;
  last_name: string;
  second_last_name: string;
  email: string;
  phone: string;
  account_executive: {
    code: string;
    name: string;
  };
};

export function formatWhoAmI({
  cliente,
  usuario,
  ejecutivoCuenta,
}: WhoAmI): WhoAmIViewModel {
  return {
    name: cliente.nombres,
    last_name: cliente.paterno,
    second_last_name: cliente.materno,
    email: usuario.email,
    phone: usuario.celular,
    account_executive: {
      code: ejecutivoCuenta.codEjecutivo,
      name: ejecutivoCuenta.glsEjecutivo,
    },
  };
}
