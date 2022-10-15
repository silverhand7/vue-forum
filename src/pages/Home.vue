<template>
    <h1>Welcome to the forum</h1>

    <category-list :categories="categories"></category-list>
</template>

<script>

import sourceData from '@/data.json';
import CategoryList from '@/components/CategoryList.vue';

export default {
    components: {
        CategoryList
    },
    data() {
        return {
            categories: sourceData.categories
        }
    },
}

</script>