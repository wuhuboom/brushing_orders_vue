import WebSocketClient from "@/util/userSocket"
let wsClient = null
export function setUserRemind() {
	wsClient = new WebSocketClient();
	wsClient.connect();
}

export function closeUserRemind(isReconnect = true) {
	if (wsClient) {
		wsClient.close(isReconnect)
	}
}