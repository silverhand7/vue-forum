<template>
    <h1>Welcome to the forum</h1>

    <category-list :categories="categories"></category-list>
    <forum-list :forums=forums />
</template>

<script>

import sourceData from '@/data.json';
import ForumList from '@/components/ForumList.vue';
import CategoryList from '@/components/CategoryList.vue';

export default {
    components: {
        ForumList,
        CategoryList
    },
    data() {
        return {
            forums: sourceData.forums,
            categories: sourceData.categories
        }
    },
}

</script>