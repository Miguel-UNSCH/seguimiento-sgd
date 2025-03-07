import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { signInSchema } from "./utils/zod/schemas";
import { query } from "@/lib/db";
import descifrar from "./lib/decrypt";

const authConfig: NextAuthConfig = {
  providers: [
    Credentials({
      name: "Credenciales",
      credentials: {
        username: { label: "Usuario o Email", type: "text" },
        password: { label: "Contraseña", type: "password" },
      },
      authorize: async (credentials) => {
        const { data, success } = signInSchema.safeParse(credentials);

        if (!success) {
          throw new Error("Formato de usuario o contraseña inválido");
        }

        const { username, password } = data;

        try {
          
          const result = await query(
            'SELECT cod_user, cdes_user, cclave FROM idosgd.seg_usuarios1 WHERE cod_user = $1',
            [username.toUpperCase()]
          );

          const user = result[0];
          if (!user || !user.cclave) {
            throw new Error("Credenciales incorrectas");
          }
          const decryptedPassword = descifrar(user.cclave);
          if (decryptedPassword !== password) {
            throw new Error("Credenciales incorrectas");
          }
          return {
            id: user.cod_user.toString(),
            user: user.cdes_user,
          };
        } catch (error) {
          console.error("Error durante la autorización:", error);
          throw new Error("Credenciales incorrectas o permisos insuficientes");
        }
      },
    }),
  ],
};

export default authConfig;
