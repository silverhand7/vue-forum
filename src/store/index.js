import { createStore } from 'vuex';
import sourceData from '@/data.json';

export default createStore({
    state: {
        ...sourceData,
        authId: 'ALXhxjwgY9PinwNGHpfai6OWyDu2'
    },
    getters: {
        authUser: state => {
            const user = state.users.find(user => user.id === state.authId);
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
    actions: {
        createPost(context, post) {
            post.id = 'ggg' + Math.random();
            context.commit('setPost', { post });
            context.commit('appendPostToThread', {
                postId: post.id,
                threadId: post.threadId
            });
        }
    },
    mutations: {
        setPost(state, { post }) {
            state.posts.push(post);
        },
        appendPostToThread(state, { postId, threadId}) {
            state.threads.find(thread => thread.id === threadId).posts.push(postId);
        }
    }
});