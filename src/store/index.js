//import sourceData from '@/data.json';
import { createStore } from 'vuex';
import { findById, upsert } from '@/helpers';
import firebase from 'firebase';

export default createStore({
    state: {
        categories: [],
        forums: [],
        threads: [],
        posts: [],
        users: [],
        authId: 'ALXhxjwgY9PinwNGHpfai6OWyDu2'
    },
    getters: {
        authUser: (state, getters) => {
            return getters.user(state.authId);
        },
        user: state => {
            return (id) => {
                const user = findById(state.users, id);
                if (!user) return null;
                return {
                    ...user,
                    get posts() { //authUser.posts
                        return state.posts.filter(post => post.userId === user.id);
                    },
                    get postsCount() { //authUser.postsCount
                        return this.posts.length;
                    },
                    get threads() {
                        return state.threads.filter(thread => thread.userId === user.id);
                    },
                    get threadsCount() {
                        return this.threads.length;
                    }
                }
            }
        },
        thread: state => {
            return (id) => {
                const thread = findById(state.threads, id);
                return {
                    ...thread,
                    get author() {
                        return findById(state.users, thread.userId);
                    },
                    get repliesCount() {
                        return thread.posts.length - 1;
                    },
                    get contributorsCount() {
                        return thread.contributors?.length;
                    },
                }
            }
        }
    },
    actions: {
        createPost({ commit, state }, post) {
            post.id = 'ggg' + Math.random();
            post.userId = state.authId;
            post.publishedAt = Math.floor(Date.now() / 1000);
            commit('setItem', { resource: 'posts', item: post });
            commit('appendPostToThread', {
                parentId: post.threadId,
                childId: post.id
            });
            commit('appendContributorToThread', {
                parentId: post.threadId,
                childId: state.authId
            });
        },
        updateUser({ commit }, user) {
            commit('setItem', {
                resource: 'users',
                item: user
            });
        },
        async createThread({ commit, state, dispatch }, {
            text, title, forumId
        }) {
            const id = 'ggg' + Math.random();
            const userId = state.authId;
            const publishedAt = Math.floor(Date.now() / 1000);
            const thread = {
                forumId,
                title,
                publishedAt,
                userId,
                id
            }
            commit('setItem', { resource: 'threads', item: thread });
            commit('appendThreadToUser', { parentId: userId, childId: id });
            commit('appendThreadToForum', { parentId: forumId, childId: id });
            dispatch('createPost', { text, threadId: id });
            return findById(state.threads, id);
        },
        async updateThread({ commit, state }, {title, text, id}) {
            const thread = findById(state.threads, id);
            const post = findById(state.posts, thread.posts[0]);
            const newThread = { ...thread, title }
            const newPost = { ...post, text }
            commit('setItem', { resource: 'threads', item: newThread});
            commit('setItem', { resource: 'posts', item: newPost});
            return newThread;
        },
        fetchThread({ dispatch }, { id }) {
            return dispatch('fetchItem', { resource: 'threads', id, emoji: 't'});
        },
        fetchUser({ dispatch }, { id }) {
            return dispatch('fetchItem', { resource: 'users', id, emoji: 'u'});
        },
        fetchPost({ dispatch }, { id }) {
            return dispatch('fetchItem', { resource: 'posts', id, emoji: 'p'});
        },
        fetchPosts( { dispatch }, { ids }) {
            return dispatch('fetchItems', { resource: 'posts', ids, emoji: 'p' })
        },
        fetchUsers( { dispatch }, { ids }) {
            return dispatch('fetchItems', { resource: 'users', ids, emoji: 'u' })
        },
        fetchThreads( { dispatch }, { ids }) {
            return dispatch('fetchItems', { resource: 'threads', ids, emoji: 't' })
        },
        fetchItem({ state, commit }, { id, emoji, resource }) {
            console.log('fire', emoji, id);
            return new Promise((resolve) => {
                firebase.firestore().collection(resource).doc(id).onSnapshot((doc) => {
                    const item = { ...doc.data(), id: doc.id }
                    commit('setItem', { resource, id, item });
                    resolve(item);
                });
            });
        },
        fetchItems({ dispatch }, { ids, resource, emoji}) {
            return Promise.all(ids.map(id => dispatch('fetchItem', { id, resource, emoji })));
        }
    },
    mutations: {
        setItem(state, { resource, item }) {
            upsert(state[resource], item);
        },
        appendPostToThread: makeAppendChildToParentMutation({
            parent: 'threads',
            child: 'posts'
        }),
        appendThreadToForum: makeAppendChildToParentMutation({
            parent: 'forums',
            child: 'threads'
        }),
        appendThreadToUser: makeAppendChildToParentMutation({
            parent: 'users',
            child: 'threads'
        }),
        appendContributorToThread: makeAppendChildToParentMutation({
            parent: 'threads',
            child: 'contributors'
        })
    }
});

function makeAppendChildToParentMutation({ parent, child }) {
    return (state, { parentId, childId}) => {
        const resource = findById(state[parent], parentId);
        resource[child] = resource[child] || [];
        if (!resource[child].includes(childId)) {
            resource[child].push(childId);
        }
    }
}
