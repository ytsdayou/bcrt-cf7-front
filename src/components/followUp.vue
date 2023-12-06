<template>
    <div class="follow-wrapper">
        <div class="group-title">New Memo</div>
        <div class="form-wrapper">
            <el-input type="textarea" v-model="memo" style="margin-bottom: 8px;" placeholder="Type something..."></el-input>
            <div>
                <el-button type="primary" @click="onSubmit" size="mini">Save</el-button>
            </div>
        </div>
        <div class="group-title">
            Memos
        </div>

        <template v-if="list.length > 0">
            <div class="memo-list">
                <div class="memo-row" v-for="row in list" :key="row.id">
                    <div class="main">
                        {{ row.memo }}
                    </div>
                    <div class="sub">
                        <span class="user"> {{ row.user_login }} </span>
                        <span>{{row.add_time}}</span>
                    </div>
                </div>
            </div>
        </template>
        <template v-else>
            <el-empty description="No Data"></el-empty>
        </template>
    </div>
</template>
<script>
import fetchData from "../api";
import { Message } from 'element-ui';
export default {
    data() {
        return {
            loading: true,
            reverse: true,
            memo: null,
            list: [],
        }
    },

    props: {
        row: {type: Object},
    },

    mounted() {
        this.w = window.bctr_cf7_data;
        this.getList();
    },

    methods: {
        onSubmit() {
            if( !this.memo ) {
                Message.error({
                    message: "Please type something first",
                    showClose: true,
                });
                return false;
            }

            this.loading = true;

            fetchData({
                action: 'bctr_cf7_followup_add',
                memo: this.memo,
                row_id: this.row.id,
                nonce: this.w.nonce
            }).then(res => {
                if( res["success"] ) {

                    Message.success({
                        message: res["data"].mess,
                        showClose: true,
                    });
                    this.getList();

                } else {

                    Message.error({
                        message: res["data"] && res["data"].mess ? res["data"].mess : "Add fail",
                        showClose: true,
                    });
                    
                }
                this.loading = false;
            });
        },

        getList() {
            this.list = [];
            this.loading = true;
            fetchData({
                action: 'bctr_cf7_followup_list',
                row_id: this.row.id,
                nonce: this.w.nonce
            }).then(res => {
                if( res["success"] ) {

                    const data = res['data'];
                    this.list = data['list'];

                }
                this.loading = false;
            });
        }
    }
}
</script>
<style lang="scss" scoped>
.follow-wrapper {
    padding-left: 24px;
    .group-title {
        color: #112529;
        font-size: 16px;
        margin-bottom: 12px;
        &:nth-child(n+2) {
            margin-top: 30px;
        }
    }
    .memo-list {
        max-height: calc(100vh - 400px);
        overflow: auto;
        .memo-row {
            background-color: #f8f8f8;
            border-radius: 5px;
            padding: 16px;
            margin-bottom: 8px;
            .main {
                margin-bottom: 12px;
                font-size: 14px;
                color: #3c3c3c;
            }
            .sub {
                font-size: 12px;
                color: #686868;
                .user {
                    margin-right: 18px;
                }
            }
        }
    }
}
</style>