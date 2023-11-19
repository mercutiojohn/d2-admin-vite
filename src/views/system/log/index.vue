<template>
  <d2-container>
    <el-table
      :data="log"
      size="mini"
      style="width: 100%"
      empty-text="暂无日志信息"
      stripe>
      <!-- 时间 -->
      <el-table-column
        prop="time"
        label="Time"
        width="140">
      </el-table-column>
      <!-- 类型 -->
      <el-table-column
        prop="type"
        label="Type"
        align="center"
        width="100">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.type"
            size="mini">
            {{scope.row.type}}
          </el-tag>
        </template>
      </el-table-column>
      <!-- 触发组件 -->
      <el-table-column
        label="Component"
        align="center"
        width="150"
        show-overflow-tooltip>
        <template slot-scope="scope">
          {{getTag(scope.row) && `<${getTag(scope.row)}>`}}
        </template>
      </el-table-column>
      <!-- 信息 -->
      <el-table-column
        prop="message"
        label="Message"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column type="expand">
        <div slot-scope="props" style="display: flex; flex-direction: column; gap: 10px;">
          <d2-highlight v-if="props.row.meta.trace" :code="props.row.meta.trace"/>
          <d2-highlight v-else :code="props.row.message"/>
          <span style="text-align: right;" v-if="props.row.meta.source">{{props.row.meta.source}}</span>
          <!-- <pre v-html="props.row.message"></pre> -->
        </div>
      </el-table-column>
      <!-- 触发页面 -->
      <el-table-column
        label="Url"
        align="left"
        width="350"
        show-overflow-tooltip>
        <template slot-scope="scope">
          {{get(scope.row, 'meta.url')}}
        </template>
      </el-table-column>
      <!-- 查看详情 -->
      <el-table-column
        fixed="right"
        align="center"
        label="More"
        width="100">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleShowMore(scope.row)">
            <d2-icon name="i-ri:terminal-line w-16px h-16px"/>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button
      slot="footer"
      type="primary"
      size="mini"
      :loading="uploading"
      @click="handleUpload">
      <d2-icon name="i-fa-cloud"/>
      Upload {{log.length}} log data
    </el-button>
  </d2-container>
</template>

<script>
import Vue from 'vue'
import { mapState } from 'vuex'
import { get } from 'lodash'
import vueJsonTreeView from 'vue-json-tree-view'
Vue.use(vueJsonTreeView)
export default {
  data () {
    return {
      uploading: false,
      treeOptions: {
        maxDepth: 10,
        rootObjectKey: 'error111',
        modifiable: false
      },
    }
  },
  computed: {
    ...mapState('d2admin/log', [
      'log'
    ])
  },
  methods: {
    get,
    getTag(row) {
      // console.log('[getTag]', row, this.get(row, 'meta.vm.$vnode.componentOptions.tag'))
      return this.get(row, 'meta.vm.$vnode.componentOptions.tag')
    },
    handleShowMore (log) {
      // 打印一条日志的所有信息到控制台
      this.$notify({
        type: 'info',
        title: '日志详情',
        message: '完整的日志内容已经打印到控制台'
      })
      this.$log.capsule('D2Admin', 'handleShowMore', 'primary')
      console.group(log.message)
      console.log('time: ', log.time)
      console.log('type: ', log.type)
      console.log(log.meta)
      console.groupEnd()
    },
    // 日志上传
    handleUpload () {
      this.uploading = true
      this.$notify({
        type: 'info',
        title: '日志上传',
        message: `开始上传${this.log.length}条日志`
      })
      setTimeout(() => {
        this.uploading = false
        this.$notify({
          type: 'success',
          title: '日志上传',
          message: '上传成功'
        })
      }, 3000)
    }
  },
  mounted() {
    // console.log('[log]', this.log)
  }
}
</script>
