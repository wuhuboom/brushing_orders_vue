import { useUserStore } from "@/store/modules/user";

class WebSocketClient {
  constructor(url, protocols = []) {
    if (WebSocketClient.instance) {
      return WebSocketClient.instance;
    }
    console.log('WebSocketClient初始化');
    this.url = `${import.meta.env.VITE_WS_URL}market/SOCKET_REMIND_USER_${useUserStore().userInfo.id}?req=dfg44dfc`;
    this.protocols = protocols;
    this.ws = null;
    this.heartbeatInterval = 30000; // 心跳间隔时间，单位毫秒
    this.reconnectInterval = 5000; // 重连间隔时间，单位毫秒
    this.heartbeatTimer = null;
    this.reconnectTimer = null;
    this.isConnected = false;
    this.callback = null; // 消息回调
    // 是否需要重连
    this.needReconnect = true;

    WebSocketClient.instance = this;
    return this;
  }

  connect(callback) {
    this.callback = callback;
    this.ws = new WebSocket(this.url);
    console.log('WebSocket连接中...', this.ws);
    this.ws.onopen = () => {
      console.log('WebSocket连接成功', this, this.ws);
      this.isConnected = true;
      this.startHeartbeat();
    };

    this.ws.onmessage = (event) => {
      console.log('WebSocket收到消息:', event);
      if (event.data && event.data !== 'pong') {
        let msgs = event.data.split("!&!");
        console.log('收到消息1:', msgs);
        if (msgs.length >= 2) {
          // uni.$emit('updateTrade', msgs);
          // window.$emit('updateTrade', msgs);
          if(msgs[1] == -1){
            useUserStore().getUserBalance();
          }
          window.dispatchEvent(new CustomEvent('updateTrade', { detail: msgs }));
          if (this.callback) { this.callback(msgs); }
        }
      }
    };

    this.ws.onclose = (event) => {
      console.log('WebSocket连接关闭:', event);
      this.isConnected = false;
      this.stopHeartbeat();
      if (this.needReconnect) {
        this.reconnect();
      }
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket错误:', error);
      this.isConnected = false;
      this.stopHeartbeat();
      this.reconnect();
    };
  }

  startHeartbeat() {
    this.heartbeatTimer = setInterval(() => {
      if (this.ws && this.ws.readyState === 1) { // 1 表示 WebSocket.OPEN
        this.ws.send('ping' );
        console.log('发送心跳包');
      }
    }, this.heartbeatInterval);
  }

  stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  reconnect() {
    if (this.reconnectTimer) {
      return;
    }

    this.reconnectTimer = setTimeout(() => {
      console.log('尝试重连...');
      this.connect(this.callback);
      this.reconnectTimer = null;
    }, this.reconnectInterval);
  }

  send(message) {
    if (this.ws && this.ws.readyState === 1) { // 1 表示 WebSocket.OPEN
      this.ws.send({ data: message });
    } else {
      console.error('WebSocket未连接，无法发送消息');
    }
  }

  close(isReconnect = true) {
    this.needReconnect = isReconnect
    this.stopHeartbeat();
    if (this.ws) {
      this.ws.close();
    }
  }
}

// 导出 WebSocketClient 类
export default WebSocketClient;