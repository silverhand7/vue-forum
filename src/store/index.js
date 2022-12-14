import { createStore } from 'vuex';
import sourceData from '@/data.json';
import { findById, upsert } from '@/helpers';

export default createStore({
    state: {
        ...sourceData,
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
            commit('setPost', { post });
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
            commit('setThread', { thread: newThread});
            commit('setPost', { post: newPost});
            return newThread;
        }
    },
    mutations: {
        setPost(state, { post }) {
            upsert(state.posts, post);
        },
        setUser(state, { user, userId }) {
            const userIndex = state.users.findIndex(user => user.id === userId);
            state.users[userIndex] = user;
        },
        setThread(state, { thread }) {
            upsert(state.threads, thread);
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
