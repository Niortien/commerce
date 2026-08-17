import { io, type Socket } from "socket.io-client";

let caisseSocket: Socket | null = null;

export function getCaisseSocket(accessToken: string): Socket {
  if (caisseSocket) {
    caisseSocket.auth = { token: accessToken };
    return caisseSocket;
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_URL est requis pour la connexion socket");
  }

  caisseSocket = io(`${baseUrl}/caisse`, {
    autoConnect: false,
    auth: { token: accessToken },
  });

  return caisseSocket;
}

export function disconnectCaisseSocket(): void {
  if (!caisseSocket) return;
  caisseSocket.disconnect();
}
