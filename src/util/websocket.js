import { useMarketStore } from "../store/modules/market";

let instance = null;

class WebSocketClient {
  static getInstance() {
    if (!instance) {
      instance = new WebSocketClient();
    }
    return instance;
  }

  _init() {
    console.log('WebSocketClient初始化');
    this.baseUrl = import.meta.env.VITE_WS_URL;
    this.connections = new Map(); // 存储所有的WebSocket连接
    this.heartbeatInterval = 30000;
    this.reconnectInterval = 5000;
    return this;
  }

  // 新增start方法，支持单个symbol或数组
  start(symbols, callback) {
    if (!symbols) return;

    // 将单个symbol转换为数组形式处理
    let symbolArray = []
    if (Array.isArray(symbols)) {
      symbols.map(item => {
        symbolArray.push(item.symbol)
      })
    } else {
      symbolArray = [symbols];
    }

    symbolArray.forEach(symbol => {
      // 如果该symbol已经有连接，先关闭它
      if (this.connections.has(symbol)) {
        this.closeSymbol(symbol);
      }

      // 创建新的连接
      this._createConnection(symbol, callback);
    });
  }

  // 创建单个连接
  _createConnection(symbol, callback) {
    const url = `${this.baseUrl}market/${symbol}?req=dfg44dfc`;
    const connection = {
      ws: null,
      heartbeatTimer: null,
      reconnectTimer: null,
      isConnected: false,
      callback
    };

    connection.ws = new WebSocket(url);

    connection.ws.onopen = () => {
      connection.isConnected = true;
      this.startHeartbeat(connection);
    };

    connection.ws.onmessage = (event) => {
      if (event.data.length > 20) {
        const data = JSON.parse(event.data);
        // 写入到pinia的store中
        useMarketStore().setMarketDetail(data);
        if (connection.callback) {
          connection.callback(event);
        }
      }
    };

    connection.ws.onclose = () => {
      connection.isConnected = false;
      this.stopHeartbeat(connection);
      this.reconnect(symbol, callback);
    };

    connection.ws.onerror = (error) => {
      connection.isConnected = false;
      this.stopHeartbeat(connection);
      this.reconnect(symbol, callback);
    };

    this.connections.set(symbol, connection);
  }

  // 关闭单个symbol的连接
  closeSymbol(symbol) {
    const connection = this.connections.get(symbol);
    if (connection) {
      this.stopHeartbeat(connection);
      if (connection.ws) {
        connection.ws.close();
      }
      if (connection.reconnectTimer) {
        clearTimeout(connection.reconnectTimer);
      }
      this.connections.delete(symbol);
    }
  }

  // 关闭所有连接
  close() {
    for (const symbol of this.connections.keys()) {
      this.closeSymbol(symbol);
    }
  }

  startHeartbeat(connection) {
    connection.heartbeatTimer = setInterval(() => {
      if (connection.ws && connection.isConnected) {
        connection.ws.send('ping');
      }
    }, this.heartbeatInterval);
  }

  stopHeartbeat(connection) {
    if (connection.heartbeatTimer) {
      clearInterval(connection.heartbeatTimer);
      connection.heartbeatTimer = null;
    }
  }

  reconnect(symbol, callback) {
    const connection = this.connections.get(symbol);
    if (connection && !connection.reconnectTimer) {
      connection.reconnectTimer = setTimeout(() => {
        this._createConnection(symbol, callback);
        connection.reconnectTimer = null;
      }, this.reconnectInterval);
    }
  }

  // 发送消息到指定的symbol连接
  send(symbol, message) {
    const connection = this.connections.get(symbol);
    if (connection && connection.ws && connection.isConnected) {
      connection.ws.send(message);
    } else {
      console.error(`WebSocket for ${symbol} is not connected`);
    }
  }
}

export default WebSocketClient.getInstance()._init();