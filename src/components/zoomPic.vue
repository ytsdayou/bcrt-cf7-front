<template>
    <div style="text-align: center;">
        <el-image
            style="width: 500px; height: 500px"
            :src="src"
            fit="contain"></el-image>
    </div>
</template>
<script>
export default {
    data() {
        return {

        }
    },

    props: {
        src: {type: String, default: ""}
    },
}
</script>