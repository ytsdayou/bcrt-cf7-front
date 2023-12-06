import Vue from 'vue'
import {
  Button, ButtonGroup, Select, Option, OptionGroup, Loading, Image, Dialog, Popconfirm,
  Switch, RadioGroup, RadioButton, Input, InputNumber, Icon, Tabs, TabPane, Pagination, DatePicker, Form, FormItem,
  Empty, Tooltip
} from 'element-ui';
import App from './App.vue'

Vue.use(Button)
Vue.use(ButtonGroup)
Vue.use(Select)
Vue.use(Option)
Vue.use(OptionGroup)
Vue.use(Input)
Vue.use(InputNumber)
Vue.use(Icon)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Pagination)
Vue.use(DatePicker)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Empty)
Vue.use(Loading)
Vue.use(Image)
Vue.use(Dialog)
Vue.use(Popconfirm)
Vue.use(Switch)
Vue.use(RadioGroup)
Vue.use(RadioButton)
Vue.use(Tooltip)

Vue.config.productionTip = false

Vue.prototype.m = 1;

import VueI18n from 'vue-i18n'
import enLocale from 'element-ui/lib/locale/lang/en'
//import zhLocale from 'element-ui/lib/locale/lang/zh-CN'

const langs = {
  //"zh_CN": "zh-cn",
  "en_US": "en",
}

Vue.use(VueI18n)
Vue.config.lang = langs[window.bctr_cf7_data.locale] ? langs[window.bctr_cf7_data.locale] : "en";
//Vue.locale('zh-cn', zhLocale)
Vue.locale('en', enLocale)

// vue-sasytable
import "vue-easytable/libs/theme-default/index.css";
import VueEasytable from "vue-easytable";
import { VeLocale } from "vue-easytable";
import enUS from "vue-easytable/libs/locale/lang/en-US.js";
Vue.use(VueEasytable);
VeLocale.use(enUS);

Vue.prototype.SYS_FIELDS = ['id'];

new Vue({
  render: h => h(App),
}).$mount('#boo-cool-cf7-app')