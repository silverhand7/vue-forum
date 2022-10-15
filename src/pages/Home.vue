<template>
    <h1 class="push-top">Welcome to the forum</h1>

    <category-list :categories="categories"></category-list>
</template>

<script>
import CategoryList from '@/components/CategoryList.vue';

export default {
    components: {
        CategoryList
    },
    computed: {
        categories() {
            return this.$store.state.categories;
        }
    }
}

</script>