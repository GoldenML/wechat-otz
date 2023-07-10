// #ifndef VUE3
import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue({
	...App
})

app.$mount()
// #endif

// #ifdef VUE3
import Store from './store'
import {
	createSSRApp
} from 'vue'

function deepClone(source){
  const target = source.constructor ===  Array ? [] : {}
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      const element = source[key];
      if(element && typeof element === 'object'){
        target[key] = deepClone(source[key])
      } else {
        target[key] = source[key]
      }
    }
  }
  return target
}

export function createApp() {
	const app = createSSRApp(App)
	app.config.globalProperties.$deepClone = deepClone
	app.use(Store)
	return {
		app
	}
}
// #endif