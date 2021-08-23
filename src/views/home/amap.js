
/*
 * 异步创建script标签
 */
export default function MapLoader() {
  return new Promise((resolve, reject) => {
    if (window.AMap) {
      // console.log('不加载')
      resolve(window.AMap)
    } else {
      // console.log('加载')
      var script = document.createElement('script')
      script.type = 'text/javascript'
      script.async = true
      script.src = 'https://webapi.amap.com/maps?v=1.4.15&key=' + 'a627f2b8f458885346e9a2e2dea7c23d'
      script.onerror = reject
      document.head.appendChild(script)
    }
    window.initAMap = () => {
      resolve(window.AMap)
    }
  })
}
