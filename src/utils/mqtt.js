/*
 * FileName: mqtt连接
 * @author: ZhouJiaXing
 * @date: 2021/5/17 下午5:31
 */
import mqtt from 'mqtt'

const connectUrl = process.env.VUE_APP_MQTT_IP // 连接服务端地址，注意查看ws协议对应的端口号
// 连接选项
const options = {
  clean: true, // true: 清除会话, false: 保留会话
  connectTimeout: 4000, // 超时时间
  clientId: 'mqttjs_' + Math.random().toString(16).substr(2),	// 客户端ID
  username: 'admin', // 连接用户名
  password: 'QWERqwer123', // 连接密码，有的密码默认为public
  keepalive: 600 // 心跳时间,客户端和服务端无通信时隔多少时间会断开连接
}

// 返回一个mqtt client
export default function connect() {
  return mqtt.connect(connectUrl, options)
}

/*
  使用方法
*/

/*
import connect from '@/utils/mqtt' // 引入mqtt

export default {
  name: 'Demo',
  data() {
    return {
      client: null // mqtt client
    }
  },
  created() {
    this.client = connect() // 建立连接
    this.client.on('connect', () => {
      console.log('连接成功')
      // 订阅多个主题,必须先订阅才能在 message 中 收到消息
      this.client.subscribe(
        ['tourist_enter', 'message_arrived'], // 订阅主题
        { qos: 1 }, // 保证消息传递次数
        (err) => {
          console.log(err || '订阅成功')
        }
      )
      // 发布消息
      this.client.publish('tourist_enter', 'tourist_enter', (err) => {
        console.log(err || '发布成功')
      })
    })
    // 失败重连
    this.client.on('reconnect', (error) => {
      console.log('正在重连:', error)
    })
    // 连接失败
    this.client.on('error', (error) => {
      console.log('连接失败:', error)
    })
    // 接收消息
    this.client.on('message', (topic, message) => {
      console.log('收到消息：', topic, message.toString())
    })
  },
  beforeDestroy() {
    this.client.end(true)// passing it to true will close the client right away, without waiting for the in-flight messages to be acked. This parameter is optional.
  }
}
*/

