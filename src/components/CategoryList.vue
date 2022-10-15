<template>
    <forum-list v-for="category in categories"
        :key="category.id"
        :forums="getForumsForCategory(category)"
        :category-name="category.name"
    >
    </forum-list>
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