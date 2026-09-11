import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "ADMIN" | "BUYER";
    } & DefaultSession["user"];
  }
  interface User {
    role: "ADMIN" | "BUYER";
  }
}
