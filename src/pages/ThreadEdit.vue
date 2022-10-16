<template>
    <div class="col-full push-top">

        <h1>Editing <i>{{ thread.title }}</i></h1>

        <thread-editor :title="thread.title" :text="text" @save="save" @cancel="cancel"></thread-editor>
    </div>
</template>

<script>
import ThreadEditor from '@/components/ThreadEditor.vue';

export default {
    components: {
        ThreadEditor
    },
    props: {
        id: {
            type: String,
            required: true
        }
    },
    computed: {
        thread() {
            return this.$store.state.threads.find(thread => thread.id === this.id);
        },
        text() {
            return this.$store.state.posts.find(
                post => post.id === this.thread.posts[0]
            ).text;
        }
    },
    methods: {
        async save({title, text}) {
            const thread = await this.$store.dispatch('updateThread', {
                id: this.id,
                title,
                text
            }); //return value

            this.$router.push({name: 'ThreadShow', params: { id: thread.id }});
        },
        cancel() {
            this.$router.push({name: 'ThreadShow', params: { id: this.id} });
        }
    }
}
</script>