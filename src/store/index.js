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
        createPost({ commit, state }, post) {
            post.id = 'ggg' + Math.random();
            post.userId = state.authId;
            post.publishedAt = Math.floor(Date.now() / 1000);
            commit('setPost', { post });
            commit('appendPostToThread', {
                postId: post.id,
                threadId: post.threadId
            });
        },
        updateUser({ commit }, user) {
            commit('setUser', {
                user,
                userId: user.id
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
            commit('setThread', { thread });
            commit('appendThreadToUser', { userId, threadId: id });
            commit('appendThreadToForum', { forumId, threadId: id });
            dispatch('createPost', { text, threadId: id });
            return state.threads.find(thread => thread.id === id);
        },
        async updateThread({ commit, state }, {title, text, id}) {
            const thread = state.threads.find(thread => thread.id === id);
            const post = state.posts.find(post => post.id === thread.posts[0]);
            const newThread = { ...thread, title }
            const newPost = { ...post, text }
            commit('setThread', { thread: newThread});
            commit('setPost', { post: newPost});
            return newThread;
        }
    },
    mutations: {
        setPost(state, { post }) {
            const index = state.posts.findIndex(p => p.id === post.id);
            if (post.id && index !== -1) {
                state.posts[index] = post;
            } else {
                state.posts.push(post);
            }
        },
        appendPostToThread(state, { postId, threadId}) {
            const thread = state.threads.find(thread => thread.id === threadId);
            thread.posts = thread.posts || [];
            thread.posts.push(postId);
        },
        setUser(state, { user, userId }) {
            const userIndex = state.users.findIndex(user => user.id === userId);
            state.users[userIndex] = user;
        },
        setThread(state, { thread }) {
            const index = state.threads.findIndex(t => t.id === thread.id);
            if (thread.id && index !== -1) {
                state.threads[index] = thread;
            } else {
                state.threads.push(thread);
            }
        },
        appendThreadToForum(state, { forumId, threadId  }) {
            const forum = state.forums.find(forum => forum.id === forumId);
            forum.posts = forum.posts || [];
            forum.posts.push(threadId);
        },
        appendThreadToUser(state, { userId, threadId  }) {
            const user = state.users.find(user => user.id === userId);
            user.posts = user.posts || [];
            user.posts.push(threadId);
        }
    }
});