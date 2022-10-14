<template>
    <h1>{{ thread.title }}</h1>
    <div class="post-list">
        <div v-for="postId in thread.posts" :key="postId" class="post">
            <div class="user-info">
                <a href="#" class="user-name">{{ userById(postById(postId).userId).name }}</a>
                <a href="#">
                    <img :src="userById(postById(postId).userId).avatar" alt="" class="avatar-large">
                </a>
                <p class="desktop-only text-small">102 posts</p>
            </div>
            <div class="post-content">
                <div>
                    <p>{{ postById(postId).text }}</p>
                </div>
            </div>
            <div class="post-date text-faded">
                {{ postById(postId).publishedAt }}
            </div>
        </div>
    </div>
</template>

<script>

import sourceData from '@/data.json';

export default {
    props: {
        id: {
            return: true,
            type: String
        }
    },
    data() {
        return {
            threads: sourceData.threads,
            posts: sourceData.posts,
            users: sourceData.users,
        }
    },
    computed: {
        thread() {
            return this.threads.find(thread => thread.id === this.id);
        }
    },
    methods: {
        postById(postId) {
            return this.posts.find(p => p.id === postId);
        },
        userById(userId) {
            return this.users.find(u => u.id === userId);
        }
    }
}

</script>