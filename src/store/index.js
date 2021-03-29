import Vuex from 'vuex'
import Vue from 'vue'

import chatSession from '@/store/chats/chatSession'
import agentSession from '@/store/agentSession'
import customer from '@/store/customers/customer'
import csrPhoneSession from '@/store/csrPhoneSession'
Vue.use(Vuex);

const store = new Vuex.Store({
    modules:{
        agentSession,
        chatSession,
        customer,
        csrPhoneSession,
    }
});
export default store;