import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import './index.css'
import pinia from './store'; // 导入 Pinia
import router from './router'; // 导入 Vue Router
import i18n from './i18n/index';
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { Calendar,CountDown,NoticeBar,NavBar,Image as VanImage,List,Tab, Tabs,Button,Dialog,Sticky,Icon,Uploader ,Field, CellGroup ,Progress,Popup,RadioGroup, Radio,Checkbox, CheckboxGroup,PullRefresh,Tag,Toast    } from 'vant';
// 2. 引入组件样式
import 'vant/lib/index.css';
import { Locale } from 'vant';
import enUS from 'vant/es/locale/lang/en-US';
const app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

Locale.use('en-US', enUS);

// 设置一个全局的图片上传路径import.meta.env.VITE_UPLOAD_URL
app.config.globalProperties.$uploadUrl = import.meta.env.VITE_UPLOAD_URL;
app.use(i18n); // 使用 Vue I18n
app.use(pinia); // 使用 Pinia
app.use(router); // 使用 Vue Router
app.use(Calendar)
app.use(CountDown)
app.use(NoticeBar)
app.use(NavBar)
app.use(VanImage);
app.use(List);
app.use(Tab);
app.use(Tabs);
app.use(Button);
app.use(Dialog);
app.use(Sticky);
app.use(Icon);
app.use(Uploader);
app.use(Field);
app.use(CellGroup);
app.use(Progress);
app.use(Popup);
app.use(Radio);
app.use(RadioGroup);
app.use(Checkbox);
app.use(CheckboxGroup);
app.use(PullRefresh);
app.use(Tag);
app.use(Toast)
// app.use(ElementPlus) // 使用 Element Plus
app.mount('#app')
