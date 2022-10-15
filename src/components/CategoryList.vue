<template>
    <div class="col-full">
        <div v-for="category in categories"
            :key="category.id"
            class="forum-list"
        >
            <h2 class="list-title">{{ category.name }}</h2>
            <forum-list :forums="getForumsForCategory(category)"></forum-list>
        </div>
    </div>
</template>

<script>
import sourceData from '@/data.json';
import ForumList from '@/components/ForumList.vue';

export default {
    components: {
        ForumList
    },
    props: {
        categories: {
            required: true,
            type: Array,
        }
    },
    methods: {
        getForumsForCategory(category) {
            return sourceData.forums.filter(forum => forum.categoryId === category.id);
        }
    }
}
</script>