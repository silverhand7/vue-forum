<template>
    <div class="flex-grid">
        <div class="col-3 push-top">
            <user-profile-card :user="user"></user-profile-card>
        </div>

        <div class="col-7 push-top">
            <div class="profile-header">
                <span class="text-lead">
                    Joker's recent activity
                </span>
                <a href="#">See only started threads?</a>
            </div>

            <hr>

            <post-list :posts="user.posts" />
        </div>
    </div>
</template>

<script>
import PostList from '@/components/PostList';
import UserProfileCard from '@/components/UserProfileCard.vue';
import { mapGetters } from 'vuex';
export default {
    components: {
        PostList,
        UserProfileCard
    },
    computed: {
        ...mapGetters({ user: 'authUser' }),
    }
}
</script>