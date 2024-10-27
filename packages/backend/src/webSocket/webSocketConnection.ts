import WebSocket from "ws";
import * as Https from "https";

const serverUrl = "https://localhost:8080";
const wsUrl = "wss://localhost:8080";

export const webSocketServerInfo = {
  serverUrl,
  wsUrl,
  connect: false,
};

// サーバに接続可能か確認する関数
function checkServerConnection(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const req = Https.get(url, (res) => {
      // ステータスコード200（OK）の場合は接続可能
      resolve(res.statusCode === 200);
    });

    req.on("error", () => {
      resolve(false);
    });

    req.end();
  });
}

// WebSocket接続を行う関数
function connectWebSocket(url: string) {
  const ws = new WebSocket(url);

  ws.on("open", () => {
    console.log("WebSocket connection opened");
    // メッセージをサーバに送信
    ws.send("Hello Server!");
  });

  ws.on("message", (message) => {
    console.log("Received from server:", message.toString());
  });

  ws.on("close", () => {
    console.log("WebSocket connection closed");
  });

  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  });
}

// メイン処理
export async function webSocket() {
  const isServerAvailable = await checkServerConnection(serverUrl);
  if (isServerAvailable) {
    console.log("Server is available. Connecting to WebSocket...");
    webSocketServerInfo.connect = true;
    connectWebSocket(wsUrl);
  } else {
    console.error("Server is not available. Cannot connect to WebSocket.");
  }
}

// const webSocket = new WebSocket("wss://localhost:8080", {
//   perMessageDeflate: false,
//   rejectUnauthorized: false,
// });
// webSocket.onopen = () => {
//   console.log("WebSocket connected");
// };

// webSocket.onmessage = (message) => {
//   console.log(`Received: ${message.data}`);
// };

// webSocket.onclose = () => {
//   console.log("WebSocket closed");
// };
