import { createApp } from 'vue';
import App from './App.vue';
import router from '@/router';
import store from '@/store';


const forumApp = createApp(App);
forumApp.use(router);
forumApp.use(store);
// Automatically register global components with prefix App https://vuejs.org/style-guide/rules-strongly-recommended.html#base-component-names
const requireComponent = require.context(
    './components',
    true,
    /App[A-Z]\w+\.(vue|js)$/
)
requireComponent.keys().forEach(function (fileName) {
    let baseComponentConfig = requireComponent(fileName);
    baseComponentConfig = baseComponentConfig.default || baseComponentConfig;
    const baseComponentName =
        baseComponentConfig.name ||
        fileName.replace(/^.+\//, '').replace(/\.\w+$/, '');
    forumApp.component(baseComponentName, baseComponentConfig);
});

forumApp.mount('#app');
